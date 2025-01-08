import Application from '#applications/database/models/application'
import Deployment, { DeploymentStatus } from '#applications/database/models/deployment'
import bindApplication from '#applications/decorators/bind_application'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Machine, RestartPolicy, FetchErrorWithPayload } from 'valyent.ts'
import jwt from 'jsonwebtoken'

export default class DeploymentsController {
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
    await application.loadOnce('organization')
    const organization = application.organization

    /**
     * Retrieve incoming tarball.
     */
    const tarball = request.file('tarball', {
      size: '20mb',
      extnames: ['tar.gz'],
    })

    if (tarball === null) {
      return response.badRequest('No file uploaded.')
    }

    /**
     * Save file to S3.
     */
    const fileName = `${organization.slug}/${application.name}.tar.gz`
    await tarball.moveToDisk(fileName, 's3')

    /**
     * Save deployment in the database.
     */
    const deployment = await application
      .related('deployments')
      .create({ origin: 'cli', status: DeploymentStatus.Building })

    const token = jwt.sign({ deploymentId: deployment.id }, env.get('APP_KEY'))
    console.log('token', token)

    /**
     * Compute webhook URL.
     */
    let webhookURL =
      env.get('NODE_ENV') === 'production'
        ? `${env.get('APP_URL')}/deployments/updates`
        : env.get('WEBHOOK_URL', 'https://smee.io/S1v6TfUa5IAvuPo')

    /**
     * Ignite builder machine.
     */
    let machine: Machine
    try {
      machine = await organization.ravelClient.machines.create(application.name, {
        region: request.input('region'),
        config: {
          image: env.get('BUILDER_IMAGE', 'valyent/builder:latest'),
          guest: { cpu_kind: 'eco', cpus: 1, memory_mb: 1024 },
          workload: {
            env: [
              `S3_ENDPOINT=${env.get('S3_ENDPOINT')}`,
              `S3_BUCKET_NAME=${env.get('S3_BUCKET')}`,
              `S3_ACCESS_KEY_ID=${env.get('S3_ACCESS_KEY_ID')}`,
              `S3_SECRET_ACCESS_KEY=${env.get('S3_SECRET_ACCESS_KEY')}`,
              `FILE_NAME=${fileName}`,
              `IMAGE_NAME=${organization.slug}/${application.name}`,
              `REGISTRY_HOST=${env.get('REGISTRY_HOST')}`,
              `REGISTRY_TOKEN=${env.get('REGISTRY_TOKEN')}`,
              `ORGANIZATION=${organization.slug}`,
              `DEPLOYMENT_ID=${deployment.id}`,
              `API_TOKEN=${token}`,
              `WEBHOOK_URL=${webhookURL}`,
            ],
            init: { user: 'root' },
            restart: { policy: RestartPolicy.Never },
          },
          auto_destroy: true,
        },
        skip_start: false,
      })
    } catch (error) {
      if (error instanceof FetchErrorWithPayload) {
        logger.error({ payload: error.payload, deployment }, `Failed to create machine.`)
      } else {
        logger.error({ error }, `Failed to create machine.`)
      }
      return
    }

    /**
     * Save builder machine id in the database, on the deployment model.
     */
    deployment.builderMachineId = machine.id
    await deployment.save()

    return deployment
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
     * If the build is unsuccessful, we set the deployment status as BuildFailed.
     */
    if (success === false) {
      deployment.status = DeploymentStatus.BuildFailed
      deployment.errorMessage = error_message
      await deployment.save()

      return response.ok('Deployment status saved.')
    }

    deployment.status = DeploymentStatus.Deploying
    await deployment.save()

    return response.ok('Deployment status saved.')
  }
}
