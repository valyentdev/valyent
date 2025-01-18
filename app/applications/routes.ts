import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CrudController = () => import('./controllers/crud_controller.js')

router
  .resource('organizations.applications', CrudController)
  .params({ organizations: 'organizationSlug', applications: 'applicationId' })
  .use('*', middleware.auth())

const GithubWebhooksController = () => import('./controllers/github_webhooks_controller.js')
router.post('/github/webhooks', [GithubWebhooksController, 'handleWebhooks']).as('github.webhooks')

const GitHubController = () => import('./controllers/github_controller.js')
router
  .get('/organizations/:organizationSlug/github/repositories', [
    GitHubController,
    'listRepositories',
  ])
  .middleware(middleware.auth({ guards: ['web', 'api'] }))

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
    'streamLogs',
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
  .post('/deployments/webhooks', [DeploymentsController, 'handleWebhook'])
  .as('deployments.webhooks')

router
  .get('/organizations/:organizationSlug/applications/:applicationId/deployments', [
    DeploymentsController,
    'index',
  ])
  .use(middleware.auth({ guards: ['web', 'api'] }))

router
  .post('/organizations/:organizationSlug/applications/:applicationId/deployments', [
    DeploymentsController,
    'store',
  ])
  .use(middleware.auth({ guards: ['web', 'api'] }))
  .as('deployments.store')

router
  .get(
    '/organizations/:organizationSlug/applications/:applicationId/deployments/:deploymentId/builder/logs',
    [DeploymentsController, 'streamBuilderLogs']
  )
  .use(middleware.auth({ guards: ['web', 'api'] }))
  .as('deployments.streamBuilderLogs')

router
  .post('/v1/fleets', [CrudController, 'store'])
  .use(middleware.auth({ guards: ['web', 'api'] }))
router
  .delete('/v1/fleets/:applicationId', [CrudController, 'destroy'])
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
  .use([middleware.auth({ guards: ['web', 'api'] })])
router
  .patch('/organizations/:organizationSlug/applications/:applicationId/env', [
    EnvironmentVariablesController,
    'update',
  ])
  .use([middleware.auth({ guards: ['web', 'api'] })])
  .as('applications.env.update')
