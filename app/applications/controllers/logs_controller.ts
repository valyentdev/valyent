import Application from '#applications/database/models/application'
import bindApplication from '#applications/decorators/bind_application'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { Machine } from 'valyent.ts'

export default class LogsController {
  @bindApplication
  async index({ inertia, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')
    await application.loadFleet()

    /**
     * List machines.
     */
    let machines: Array<Machine>
    try {
      machines = await application.organization.ravelClient.machines.list(application.fleet!.id)
    } catch (error) {
      logger.error({ error, application }, 'Failed to list machines.')
      return response.internalServerError()
    }

    return inertia.render('applications/logs', {
      application,
      machines,
    })
  }

  @bindApplication
  async getLogs({ params, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')

    const logEntries = await application.organization.ravelClient.machines.getLogs(
      application.id,
      params.machineId
    )

    return response.json(logEntries)
  }
}
