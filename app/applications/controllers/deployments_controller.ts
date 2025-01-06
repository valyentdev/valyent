import { DeploymentStatus } from '#applications/database/models/deployment'
import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'

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

    const deployment = await application
      .related('deployments')
      .create({ origin: 'cli', status: DeploymentStatus.Building })

    return deployment
  }
}
