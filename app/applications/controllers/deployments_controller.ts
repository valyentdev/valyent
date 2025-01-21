import Application from '#applications/database/models/application'
import Deployment, { DeploymentStatus } from '#applications/database/models/deployment'
import bindApplication from '#applications/decorators/bind_application'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import DeploymentSuccessfulBuild from '#applications/events/deployment_successful_build'
import { inject } from '@adonisjs/core'
import DeploymentsService from '#applications/services/deployments_service'
import { Client, LogEntry } from 'valyent.ts'
import logger from '@adonisjs/core/services/logger'
import { MultipartFile } from '@adonisjs/core/bodyparser'

@inject()
export default class DeploymentsController {
  private adminClient = new Client(
    env.get('RAVEL_API_SECRET'),
    env.get('RAVEL_ADMIN_NAMESPACE', 'admin'),
    env.get('RAVEL_API_ENDPOINT')
  )

  constructor(private deploymentsService: DeploymentsService) {}

  @bindApplication
  async index({ inertia }: HttpContext, application: Application) {
    /**
     * Retrieve deployments.
     */
    const deployments = await application
      .related('deployments')
      .query()
      .orderBy('created_at', 'desc')
      .preload('application')

    return inertia.render('applications/deployments', {
      application,
      deployments,
    })
  }

  @bindApplication
  async store({ request, response }: HttpContext, application: Application) {
    /**
     * Save deployment in the database.
     */
    const deployment = await application.related('deployments').create({
      origin: 'cli',
      status: DeploymentStatus.Building,
      fileName: '',
    })

    /**
     * Retrieve incoming tarball.
     */
    let tarball: MultipartFile | null = null
    try {
      tarball = request.file('tarball', {
        size: '20mb',
        extnames: ['tar.gz'],
      })
    } catch (error) {
      deployment.status = DeploymentStatus.BuildFailed
      await deployment.save()
      throw error
    }

    /**
     * Handle the case when a tarball is not provided.
     * We skip the build process and return the deployment immediately.
     * It's especially useful for cases where the user wants to build the Docker image himself.
     */
    if (tarball === null) {
      await this.deploymentsService.igniteDeployment(deployment)
      return response.json(deployment)
    }

    /**
     * Save file to S3.
     */
    await application.loadOnce('organization')
    const fileName = `${application.organization.slug}/${deployment.id}.tar.gz`
    await tarball.moveToDisk(fileName, 's3')

    deployment.fileName = fileName
    await deployment.save()

    await this.deploymentsService.igniteBuilder(deployment)

    return response.json(deployment)
  }

  async handleWebhook({ request, response }: HttpContext) {
    /**
     * Check that there is an authorization header (we expect a JWT to be set there!).
     */
    const header = request.header('Authorization')
    if (!header) {
      return response.unauthorized('No valid authorization header found.')
    }

    /**
     * Try to split the header, to retrieve the JWT.
     */
    let token: string
    try {
      token = header.replace('Bearer ', '')

      if (token === '') {
        throw new Error('Empty JWT.')
      }
    } catch (error) {
      return response.unauthorized('No valid JWT found.')
    }

    /**
     * Try to retrieve the deployment from the JWT.
     */
    let deploymentId: string
    try {
      const result = jwt.verify(token, env.get('APP_KEY'))
      if (result === null || typeof result === 'string') {
        throw new Error('Invalid result.')
      }
      deploymentId = (result as { deploymentId: string }).deploymentId
    } catch (error) {
      return response.unauthorized('No deployment ID found in the JWT.')
    }

    /**
     * Try to retrieve the deployment from the database.
     */
    const deployment = await Deployment.findBy('id', deploymentId)
    if (deployment === null) {
      return response.notFound('Deployment not found.')
    }

    /**
     * Retrieve body.
     */
    const { success, error_message } = request.body()

    /**
     * Retrieve the machine builder logs
     */
    let builderLogs: Array<LogEntry> = []
    try {
      builderLogs = await this.adminClient.machines.getLogs(
        deployment.application.id,
        env.get('RAVEL_BUILDERS_FLEET', 'builders')
      )
    } catch (error) {
      logger.error({ error, deployment }, 'Failed to retrieve machine builder logs')
    }

    /**
     * Delete the machine builder machine.
     */
    try {
      await this.adminClient.machines.delete(
        deployment.application.id,
        env.get('RAVEL_BUILDERS_FLEET', 'builders'),
        true
      )
    } catch (error) {
      logger.error({ error, deployment }, 'Failed to delete machine builder machine')
    }

    /**
     * If the build is unsuccessful, we set the deployment status as BuildFailed.
     */
    if (success === false) {
      deployment.status = DeploymentStatus.BuildFailed
      deployment.errorMessage = error_message
      deployment.builderLogs = builderLogs
      await deployment.save()

      return response.ok('Deployment status saved.')
    }

    /**
     * Save the status in the database.
     */
    deployment.status = DeploymentStatus.Deploying
    await deployment.save()

    /**
     * Let's dispatch the successful build event.
     */
    await DeploymentSuccessfulBuild.dispatch(deployment)

    return response.ok('Deployment status saved.')
  }

  @bindApplication
  async streamBuilderLogs({ params, response }: HttpContext, application: Application) {
    /**
     * Try to retrieve deployment.
     */
    const deployment = await application
      .related('deployments')
      .query()
      .where('id', params.deploymentId)
      .first()
    if (deployment === null) {
      return response.notFound('Deployment not found.')
    }

    /**
     * Ensure that a builder machine id is associated to the deployment.
     */
    if (deployment.builderMachineId === null) {
      return response.notFound('Builder machine ID not found.')
    }

    /**
     * Set SSE Headers.
     */
    response.response.setHeader('Content-Type', 'text/event-stream')
    response.response.setHeader('Cache-Control', 'no-cache')
    response.response.setHeader('Connection', 'keep-alive')
    response.response.setHeader('Access-Control-Allow-Origin', '*')
    response.response.flushHeaders()

    if (deployment.builderLogs) {
      for await (const logEntry of deployment.builderLogs) {
        /**
         * Send log entry to client, through a SSE.
         */
        response.response.write(JSON.stringify(logEntry) + '\n')

        /**
         * Flush the buffer to ensure all data is sent immediately. This is necessary for SSE.
         */
        response.response.flushHeaders()
      }
      response.response.end()
      return
    }

    try {
      await this.adminClient.machines.wait(
        env.get('RAVEL_BUILDERS_FLEET', 'builders'),
        deployment.builderMachineId,
        'running',
        10 // in seconds
      )
    } catch (error) {
      logger.debug({ error }, 'Timeout exceeded')
      return response.badRequest('Timeout exceeded')
    }

    const logEntries = this.adminClient.machines.getLogsStream(
      env.get('RAVEL_BUILDERS_FLEET', 'builders'),
      deployment.builderMachineId
    )
    for await (const logEntry of logEntries) {
      /**
       * Send log entry to client, through a SSE.
       */
      response.response.write(JSON.stringify(logEntry) + '\n')

      /**
       * Flush the buffer to ensure all data is sent immediately. This is necessary for SSE.
       */
      response.response.flushHeaders()
    }

    response.response.end()
  }
}
