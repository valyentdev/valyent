import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Machine } from 'valyent.ts'

export default class LogsController {
  @bindOrganizationWithMember
  async index({ inertia, params, response }: HttpContext, organization: Organization) {
    const application = await organization
      .related('applications')
      .query()
      .where('id', params.applicationId)
      .firstOrFail()
    await application.load('organization')
    await application.loadFleet()

    /**
     * List machines.
     */
    let machines: Array<Machine>
    try {
      machines = await organization.ravelClient.machines.list(application.fleet!.id)
    } catch (error) {
      logger.error({ error, organization }, 'Failed to list machines.')
      return response.internalServerError()
    }

    return inertia.render('applications/logs', {
      application,
      machines,
    })
  }

  @bindOrganizationWithMember
  async getLogs({ params, response }: HttpContext, organization: Organization) {
    const logEntries = await organization.ravelClient.machines.getLogs(
      params.applicationId,
      params.machineId
    )

    return response.json(logEntries)
  }
}
