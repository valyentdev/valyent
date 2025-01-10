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

router.get('/organizations/:organizationSlug/ai', ({ params, response }) =>
  response.redirect(`/organizations/${params.organizationSlug}/ai/sandboxes`)
)

const SandboxesController = () => import('#ai/controllers/sandboxes_controller')

router
  .get('/organizations/:organizationSlug/ai/sandboxes', [SandboxesController, 'index'])
  .use(middleware.auth())

router
  .post('/organizations/:organizationSlug/ai/sandboxes', [SandboxesController, 'store'])
  .use(middleware.auth())
