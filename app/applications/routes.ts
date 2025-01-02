import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CrudController = () => import('./controllers/crud_controller.js')

router
  .resource('organizations.applications', CrudController)
  .params({ organizations: 'organizationSlug', applications: 'applicationId' })
  .use('*', middleware.auth())

const MachinesController = () => import('./controllers/machines_controller.js')

router
  .resource('organizations.applications.machines', MachinesController)
  .params({
    organizations: 'organizationSlug',
    applications: 'applicationId',
    machines: 'machineId',
  })
  .use('*', middleware.auth())

router
  .post('/organizations/:organizationSlug/applications/:applicationId/machines/:machineId/start', [
    MachinesController,
    'start',
  ])
  .use(middleware.auth())

router
  .post('/organizations/:organizationSlug/applications/:applicationId/machines/:machineId/stop', [
    MachinesController,
    'stop',
  ])
  .use(middleware.auth())

const LogsController = () => import('./controllers/logs_controller.js')

router
  .get('/organizations/:organizationSlug/applications/:applicationId/logs', [
    LogsController,
    'index',
  ])
  .use(middleware.auth())

router
  .get('/organizations/:organizationSlug/applications/:applicationId/machines/:machineId/logs', [
    LogsController,
    'getLogs',
  ])
  .use(middleware.auth())

const GatewaysController = () => import('./controllers/gateways_controller.js')

router
  .resource('organizations.applications.gateways', GatewaysController)
  .params({
    organizations: 'organizationSlug',
    applications: 'applicationId',
    gateways: 'gatewayId',
  })
  .use('*', middleware.auth())

const DeploymentsController = () => import('./controllers/deployments_controller.js')

router
  .get('/organizations/:organizationSlug/applications/:applicationId/deployments', [
    DeploymentsController,
    'index',
  ])
  .use(middleware.auth())

router
  .post('/v1/fleets', [CrudController, 'store'])
  .use(middleware.auth({ guards: ['web', 'api'] }))
router
  .delete('/v1/fleets/:fleetId', [CrudController, 'delete'])
  .use(middleware.auth({ guards: ['web', 'api'] }))

/**
 * Environment variables.
 */

const EnvironmentVariablesController = () =>
  import('./controllers/environment_variables_controller.js')

router
  .get('/organizations/:organizationSlug/applications/:applicationId/env', [
    EnvironmentVariablesController,
    'edit',
  ])
  .use([middleware.auth()])
router
  .patch('/organizations/:organizationSlug/applications/:applicationId/env', [
    EnvironmentVariablesController,
    'update',
  ])
  .use([middleware.auth({ guards: ['web', 'api'] })])
