import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('http:request_completed', (event) => {
  const { req } = event.ctx.response.response
  logger.debug(`${req.method} ${req.url} ${event.ctx.response.getStatus()}`)
})

emitter.on('db:query', (event) => {
  logger.debug(event.sql)
})

/**
 * Log errors.
 */
emitter.onError((event, error, data) => {
  logger.error({ event, error, data }, 'Failed to handle event')
})
