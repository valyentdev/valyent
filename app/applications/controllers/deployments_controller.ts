import { DeploymentStatus } from '#applications/database/models/deployment'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import { RestartPolicy } from 'valyent.ts'

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
    const key = `${organization.slug}/${application.name}.tar.gz`
    await tarball.moveToDisk(key, 's3')

    /**
     * Ignite builder machine.
     */
    const machine = await organization.ravelClient.machines.create(application.name, {
      region: request.input('region'),
      config: {
        image: env.get('BUILDER_IMAGE', 'valyent/builder:latest'),
        guest: { cpu_kind: 'standard', cpus: 4, memory_mb: 4096 },
        workload: {
          env: [
            `S3_ENDPOINT=${env.get('S3_ENDPOINT')}`,
            `S3_BUCKET_NAME=${env.get('S3_BUCKET')}`,
            `S3_ACCESS_KEY_ID=${env.get('S3_ACCESS_KEY')}`,
            `S3_SECRET_ACCESS_KEY=${env.get('S3_SECRET_KEY')}`,
            `FILE_NAME=${application.name}.tar.gz`,
            `IMAGE_NAME=${application.name}`,
            `REGISTRY_HOST='registry.fly.io'`,
            `REGISTRY_TOKEN=${env.get('REGISTRY_TOKEN')}`,
          ],
          init: { user: 'root' },
          restart: { policy: RestartPolicy.Never },
        },
        auto_destroy: true,
      },
      skip_start: false,
    })

    /**
     * Save deployment in the database.
     */
    const deployment = await application
      .related('deployments')
      .create({ origin: 'cli', status: DeploymentStatus.Building, builderMachineId: machine.id })

    return deployment
  }
}
