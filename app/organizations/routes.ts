/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const OrganizationsController = () => import('./controllers/organizations_controller.js')
const SettingsController = () => import('./controllers/settings_controller.js')

router
  .get('/organizations/:organizationSlug', ({ params, response }) => {
    return response.redirect(`/organizations/${params.organizationSlug}/applications`)
  })
  .use(middleware.auth())
  .as('organizations.show')

/**
 * Proxy-related routes.
 */
const CrudController = () => import('#applications/controllers/crud_controller')
const ProxyController = () => import('#organizations/controllers/proxy_controller')

router.post('/v1/fleets', [CrudController, 'store']).use(middleware.auth({ guards: ['api'] }))
router
  .delete('/v1/fleets/:fleetId', [ProxyController, 'deleteFleet'])
  .use(middleware.auth({ guards: ['api'] }))

router
  .get('/v1/fleets', [ProxyController, 'handleRequest'])
  .use(middleware.auth({ guards: ['api'] }))

router
  .any('/v1/gateways', [ProxyController, 'handleRequest'])
  .use(middleware.auth({ guards: ['api'] }))

router
  .any('/v1/fleets/*', [ProxyController, 'handleRequest'])
  .use(middleware.auth({ guards: ['api'] }))

router
  .any('/v1/gateways/*', [ProxyController, 'handleRequest'])
  .use(middleware.auth({ guards: ['api'] }))

router
  .resource('organizations', OrganizationsController)
  .except(['create', 'destroy', 'show'])
  .params({ organizations: 'organizationSlug' })
  .use('*', middleware.auth())

router
  .get('/organizations/:organizationSlug/settings', [OrganizationsController, 'edit'])
  .use(middleware.auth())

router
  .get('/organizations/:organizationSlug/join', [OrganizationsController, 'join'])
  .use(middleware.auth())

router
  .post('/organizations/:organizationSlug/quit', [OrganizationsController, 'quit'])
  .use(middleware.auth())

router
  .post('/organizations/:organizationSlug/invite', [OrganizationsController, 'invite'])
  .use(middleware.auth())

router
  .get('/organizations/:organizationSlug/settings/account', [SettingsController, 'edit'])
  .use(middleware.auth())
router.patch('/settings', [SettingsController, 'update']).use(middleware.auth())
