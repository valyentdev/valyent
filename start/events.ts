import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

emitter.on('db:query', (event) => {
  logger.debug(event.sql)
})

/**
 * Log errors.
 */
emitter.onError((event, error, data) => {
  logger.error({ event, error, data }, 'Failed to handle event')
})
