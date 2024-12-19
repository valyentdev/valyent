import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class MachinesController {
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
     * Retrieve machines.
     */
    const listMachinesResult = await organization.ravelClient.machines.list(params.applicationId)
    if (!listMachinesResult.success) {
      logger.error(
        {
          reason: listMachinesResult.reason,
          organization,
          applicationId: params.applicationId,
        },
        'Failed to get list of machines.'
      )
      return response.internalServerError()
    }

    return inertia.render('applications/machines', {
      fleet: getFleetResult.value,
      machines: listMachinesResult.value,
    })
  }
}
