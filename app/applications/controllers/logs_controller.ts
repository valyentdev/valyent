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
  async streamLogs({ params, response }: HttpContext, application: Application) {
    await application.loadOnce('organization')

    /**
     * Set SSE Headers.
     */
    response.response.setHeader('Content-Type', 'text/event-stream')
    response.response.setHeader('Cache-Control', 'no-cache')
    response.response.setHeader('Connection', 'keep-alive')
    response.response.setHeader('Access-Control-Allow-Origin', '*')
    response.response.flushHeaders()

    const logEntries = application.organization.ravelClient.machines.getLogsStream(
      application.id,
      params.machineId
    )
    for await (const logEntry of logEntries) {
      /**
       * Send log entry to client, through a SSE.
       */
      response.response.write(`data: ${JSON.stringify(logEntry)}\n\n`)
      logger.info({ logEntry, application }, 'Received log entry.')

      /**
       * Flush the buffer to ensure all data is sent immediately. This is necessary for SSE.
       */
      response.response.flushHeaders()
    }

    response.response.end()
  }
}
