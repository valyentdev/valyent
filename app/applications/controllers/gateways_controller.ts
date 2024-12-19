import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class GatewaysController {
  @bindOrganizationWithMember
  async index({ inertia, params, response }: HttpContext, organization: Organization) {
    /**
     * Get fleet.
     */
    const getFleetResult = await organization.ravelClient.fleets.get(params.applicationId)
    if (!getFleetResult.success) {
      logger.error({ reason: getFleetResult.reason, organization }, 'Failed to get fleet.')
      return response.internalServerError()
    }

    /**
     * List gateways.
     */
    const listGatewaysResult = await organization.ravelClient.fleets.get(params.applicationId)
    if (!listGatewaysResult.success) {
      logger.error({ reason: listGatewaysResult.reason, organization }, 'Failed to get gateways.')
      return response.internalServerError()
    }

    return inertia.render('applications/gateways', {
      fleet: getFleetResult.value,
      gateways: listGatewaysResult.value,
    })
  }
}
