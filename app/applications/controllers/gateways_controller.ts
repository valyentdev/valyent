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
    const listGatewaysResult = await organization.ravelClient.gateways.list(params.applicationId)
    if (!listGatewaysResult.success) {
      logger.error({ reason: listGatewaysResult.reason, organization }, 'Failed to list gateways.')
      return response.internalServerError()
    }

    return inertia.render('applications/gateways', {
      fleet: getFleetResult.value,
      gateways: listGatewaysResult.value,
    })
  }

  @bindOrganizationWithMember
  async store({ request, params, response }: HttpContext, organization: Organization) {
    /**
     * Try to store gateway.
     */
    const createGatewayResult = await organization.ravelClient.gateways.create({
      name: request.input('name'),
      fleet: params.applicationId,
      target_port: request.input('targetPort'),
    })
    if (!createGatewayResult.success) {
      logger.error(
        { reason: createGatewayResult.reason, organization },
        'Failed to create gateway.'
      )
      return response.internalServerError()
    }

    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async destroy({ params, response }: HttpContext, organization: Organization) {
    /**
     * Try to delete gateway.
     */
    const deleteGatewayResult = await organization.ravelClient.gateways.delete(params.gatewayId)
    if (!deleteGatewayResult.success) {
      logger.error(
        { reason: deleteGatewayResult.reason, organization },
        'Failed to delete gateway.'
      )
      return response.internalServerError()
    }

    return response.redirect().back()
  }
}
