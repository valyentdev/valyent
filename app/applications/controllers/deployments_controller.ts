import { DeploymentStatus } from '#applications/database/models/deployment'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import { Machine, RestartPolicy, FetchErrorWithPayload } from 'valyent.ts'

export default class DeploymentsController {
  @bindOrganizationWithMember
  async index({ params, inertia }: HttpContext, organization: Organization) {
    /**
     * Get application.
     */
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId)
      .firstOrFail()

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

  @bindOrganizationWithMember
  async store({ request, response, params }: HttpContext, organization: Organization) {
    /**
     * Get application.
     */
    const application = await organization
      .related('applications')
      .query()
      .where('fleetId', params.applicationId)
      .firstOrFail()

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
        console.log('FetchErrorWithPayload', error.payload)
      } else {
        console.log('not FetchErrorWithPayload')
      }
      return
    }

    /**
     * Save deployment in the database.
     */
    const deployment = await application
      .related('deployments')
      .create({ origin: 'cli', status: DeploymentStatus.Building, builderMachineId: machine.id })

    return deployment
  }
}
