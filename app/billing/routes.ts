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

const BillingController = () => import('./controllers/billing_controller.js')
const StripeWebhooksController = () => import('./controllers/stripe_webhooks_controller.js')

router
  .get('/organizations/:organizationSlug/billing', [BillingController, 'show'])
  .use(middleware.auth())
  .as('billing.show')

router
  .get('/organizations/:organizationSlug/billing/manage', [BillingController, 'manage'])
  .use(middleware.auth())
  .as('billing.manage')

router
  .get('/organizations/:organizationSlug/billing/change_payment_method', [
    BillingController,
    'initiatePaymentMethodChange',
  ])
  .use(middleware.auth())
  .as('billing.initiatePaymentMethodChange')

router.post('/stripe/webhooks', [StripeWebhooksController, 'handleWebhook'])
