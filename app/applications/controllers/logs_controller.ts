import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class LogsController {
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
     * List machines.
     */
    const listMachinesResult = await organization.ravelClient.machines.list(getFleetResult.value.id)
    if (!listMachinesResult.success) {
      logger.error({ reason: listMachinesResult.reason, organization }, 'Failed to list machines.')
      return response.internalServerError()
    }

    return inertia.render('applications/logs', {
      fleet: getFleetResult.value,
      machines: listMachinesResult.value,
    })
  }

  @bindOrganizationWithMember
  async getLogs({ params, response }: HttpContext, organization: Organization) {
    const logsResponse = await organization.ravelClient.machines.getLogs(
      params.applicationId,
      params.machineId
    )
    if (!logsResponse.success) {
      logger.error({ reason: logsResponse.reason, organization }, 'Failed to get logs.')
      return response.internalServerError()
    }

    return response.json(logsResponse.value)
  }
}
