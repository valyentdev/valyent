import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class MachinesController {
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
     * Retrieve machines.
     */
    const listMachinesResult = await organization.ravelClient.machines.list(application.fleet!.id)
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
      application,
      machines: listMachinesResult.value,
    })
  }

  @bindOrganizationWithMember
  async show({ inertia, params, response }: HttpContext, organization: Organization) {
    /**
     * Get fleet.
     */
    const getFleetResult = await organization.ravelClient.fleets.get(params.applicationId)
    if (!getFleetResult.success) {
      logger.error({ reason: getFleetResult.reason, organization }, 'Failed to get fleet.')
      return response.internalServerError()
    }

    /**
     * Get machine.
     */
    const getMachineResult = await organization.ravelClient.machines.get(
      params.applicationId,
      params.machineId
    )
    if (!getMachineResult.success) {
      logger.error(
        {
          reason: getMachineResult.reason,
          organization,
          applicationId: params.applicationId,
        },
        'Failed to get machine.'
      )
      return response.internalServerError()
    }

    /**
     * List events.
     */
    const listEventsResult = await organization.ravelClient.machines.listEvents(
      params.applicationId,
      params.machineId
    )
    if (!listEventsResult.success) {
      logger.error(
        {
          reason: listEventsResult.reason,
          organization,
          applicationId: params.applicationId,
        },
        'Failed to list events.'
      )
      return response.internalServerError()
    }

    return inertia.render('applications/machine', {
      fleet: getFleetResult.value,
      machine: getMachineResult.value,
      events: listEventsResult.value,
    })
  }

  @bindOrganizationWithMember
  async start({ params, response }: HttpContext, organization: Organization) {
    /**
     * Start machine.
     */
    const startMachineResult = await organization.ravelClient.machines.start(
      params.applicationId,
      params.machineId
    )
    if (!startMachineResult.success) {
      logger.error(
        {
          reason: startMachineResult.reason,
          organization,
          applicationId: params.applicationId,
          machineId: params.machineId,
        },
        'Failed to start machine.'
      )
      return response.internalServerError()
    }

    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async stop({ params, response }: HttpContext, organization: Organization) {
    /**
     * Stop machine.
     */
    const stopMachineResult = await organization.ravelClient.machines.stop(
      params.applicationId,
      params.machineId,
      {
        timeout: 0,
        signal: 'SIGKILL',
      }
    )
    if (!stopMachineResult.success) {
      logger.error(
        {
          reason: stopMachineResult.reason,
          organization,
          applicationId: params.applicationId,
          machineId: params.machineId,
        },
        'Failed to stop machine.'
      )
      return response.internalServerError()
    }

    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async destroy({ params, response }: HttpContext, organization: Organization) {
    /**
     * Delete machine.
     */
    const deleteMachineResult = await organization.ravelClient.machines.delete(
      params.applicationId,
      params.machineId,
      true
    )
    if (!deleteMachineResult.success) {
      logger.error(
        {
          reason: deleteMachineResult.reason,
          organization,
          applicationId: params.applicationId,
          machineId: params.machineId,
        },
        'Failed to delete machine.'
      )
      return response.internalServerError()
    }

    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/applications/${params.applicationId}/machines`)
  }
}
