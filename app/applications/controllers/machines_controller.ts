import Application from '#applications/database/models/application'
import bindApplication from '#applications/decorators/bind_application'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Fleet, MachineEvent, MachineRecord } from 'valyent.ts'

export default class MachinesController {
  @bindApplication
  async index({ inertia, params, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')
    await application.loadFleet()

    /**
     * Retrieve machines.
     */
    let machines: Array<MachineRecord>
    try {
      machines = await application.organization.ravelClient.machines.listRecords(
        application.fleet!.id
      )
    } catch (error) {
      logger.error(
        {
          error,
          organization: application.organization,
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

  @bindApplication
  async show({ inertia, params, response }: HttpContext, application: Application) {
    /**
     * Get fleet.
     */
    let fleet: Fleet
    try {
      await application.loadOnce('organization')
      fleet = await application.organization.ravelClient.fleets.get(application.id)
    } catch (error) {
      logger.error({ error, organization: application.organization }, 'Failed to get fleet.')
      return response.internalServerError()
    }

    /**
     * Get machine.
     */
    let machine: MachineRecord
    try {
      machine = await application.organization.ravelClient.machines.getRecord(
        application.id,
        params.machineId
      )
    } catch (error) {
      logger.error(
        { error, organization: application.organization, applicationId: params.applicationId },
        'Failed to get machine.'
      )
      return response.internalServerError()
    }

    /**
     * List events.
     */
    let events: Array<MachineEvent>
    try {
      events = await application.organization.ravelClient.machines.listEvents(
        application.id,
        params.machineId
      )
    } catch (error) {
      logger.error(
        {
          error,
          organization: application.organization,
          applicationId: params.applicationId,
        },
        'Failed to list events.'
      )
      return response.internalServerError()
    }

    return inertia.render('applications/machine', {
      application,
      fleet,
      machine,
      events,
    })
  }

  @bindApplication
  async start({ params, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')
    await application.organization.ravelClient.machines.start(application.id, params.machineId)

    return response.redirect().back()
  }

  @bindApplication
  async stop({ params, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')
    await application.organization.ravelClient.machines.stop(application.id, params.machineId, {
      timeout: 0,
      signal: 'SIGKILL',
    })

    return response.redirect().back()
  }

  @bindApplication
  async destroy({ params, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')
    await application.organization.ravelClient.machines.delete(
      application.id,
      params.machineId,
      true
    )

    return response
      .redirect()
      .toPath(
        `/organizations/${application.organization.slug}/applications/${params.applicationId}/machines`
      )
  }
}
