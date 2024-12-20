/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const APIKeysController = () => import('#api_keys/controllers/crud_controller')
const CheckController = () => import('#api_keys/controllers/check_controller')

/**
 * CRUD routes.
 */
router
  .resource('organizations.api_keys', APIKeysController)
  .params({ organizations: 'organizationSlug' })
  .use('*', middleware.auth({ guards: ['web', 'api'] }))

router
  .get('/organizations/:organizationSlug/:resource/api_keys', [APIKeysController, 'index'])
  .use(middleware.auth({ guards: ['web', 'api'] }))

/**
 * Check route.
 */
router.get('/auth/api/check', [CheckController, 'handle'])
