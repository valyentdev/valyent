import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Fleet, Machine, MachineEvent } from 'valyent.ts'

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
    let machines: Array<Machine>
    try {
      machines = await organization.ravelClient.machines.list(application.fleet!.id)
    } catch (error) {
      logger.error(
        {
          error,
          organization,
          applicationId: params.applicationId,
        },
        'Failed to get list of machines.'
      )
      return response.internalServerError()
    }

    return inertia.render('applications/machines', {
      application,
      machines,
    })
  }

  @bindOrganizationWithMember
  async show({ inertia, params, response }: HttpContext, organization: Organization) {
    /**
     * Get fleet.
     */
    let fleet: Fleet
    try {
      fleet = await organization.ravelClient.fleets.get(params.applicationId)
    } catch (error) {
      logger.error({ error, organization }, 'Failed to get fleet.')
      return response.internalServerError()
    }

    /**
     * Get machine.
     */
    let machine: Machine
    try {
      machine = await organization.ravelClient.machines.get(params.applicationId, params.machineId)
    } catch (error) {
      logger.error(
        { error, organization, applicationId: params.applicationId },
        'Failed to get machine.'
      )
      return response.internalServerError()
    }

    /**
     * List events.
     */
    let events: Array<MachineEvent>
    try {
      events = await organization.ravelClient.machines.listEvents(
        params.applicationId,
        params.machineId
      )
    } catch (error) {
      logger.error(
        {
          error,
          organization,
          applicationId: params.applicationId,
        },
        'Failed to list events.'
      )
      return response.internalServerError()
    }

    return inertia.render('applications/machine', {
      fleet,
      machine,
      events,
    })
  }

  @bindOrganizationWithMember
  async start({ params, response }: HttpContext, organization: Organization) {
    await organization.ravelClient.machines.start(params.applicationId, params.machineId)

    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async stop({ params, response }: HttpContext, organization: Organization) {
    await organization.ravelClient.machines.stop(params.applicationId, params.machineId, {
      timeout: 0,
      signal: 'SIGKILL',
    })

    return response.redirect().back()
  }

  @bindOrganizationWithMember
  async destroy({ params, response }: HttpContext, organization: Organization) {
    await organization.ravelClient.machines.delete(params.applicationId, params.machineId, true)

    return response
      .redirect()
      .toPath(`/organizations/${organization.slug}/applications/${params.applicationId}/machines`)
  }
}
