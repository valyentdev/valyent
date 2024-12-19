import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .on('/organizations/:organizationSlug/applications/overview')
  .renderInertia('applications/overview')
  .use(middleware.auth())

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

const LogsController = () => import('./controllers/logs_controller.js')

router
  .get('/organizations/:organizationSlug/applications/:applicationId/logs', [
    LogsController,
    'index',
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
