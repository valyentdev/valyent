import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Gateway } from 'valyent.ts'

export default class GatewaysController {
  @bindOrganizationWithMember
  async index({ inertia, params, response }: HttpContext, organization: Organization) {
    /**
     * Get application.
     */
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId)
      .firstOrFail()
    await application.load('organization')
    await application.loadFleet()

    /**
     * List gateways.
     */
    let gateways: Array<Gateway>
    try {
      gateways = await organization.ravelClient.gateways.list(application.fleet!.id)
    } catch (error) {
      logger.error({ error, organization }, 'Failed to list gateways.')
      return response.internalServerError()
    }

    return inertia.render('applications/gateways', {
      application,
      gateways,
    })
  }

  @bindOrganizationWithMember
  async store({ request, params, response }: HttpContext, organization: Organization) {
    await organization.ravelClient.gateways.create({
      name: request.input('name'),
      fleet: params.applicationId,
      target_port: request.input('targetPort'),
    })

    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async destroy({ params, response }: HttpContext, organization: Organization) {
    await organization.ravelClient.gateways.delete(params.gatewayId)

    return response.redirect().back()
  }
}
