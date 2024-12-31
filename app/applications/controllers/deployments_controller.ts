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
}
