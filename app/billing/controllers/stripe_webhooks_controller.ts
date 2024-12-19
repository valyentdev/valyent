import StripeWebhooksService from '#billing/services/stripe_webhooks_service'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import Stripe from 'stripe'

export default class StripeWebhooksController {
  private stripeWebhooksService = new StripeWebhooksService()

  async handleWebhook({ request, response }: HttpContext) {
    /**
     * Create a new Stripe client instance.
     */
    const stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    })

    /**
     * Ensure that Stripe webhooks are enabled.
     */
    if (!stripe.webhooks) {
      return response.badRequest('Webhooks are not configured')
    }

    /**
     * Check whether this request looks like a Stripe webhook request.
     */
    if (!request.raw() || !request.header('stripe-signature')) {
      return response.badRequest('Invalid request')
    }

    try {
      /**
       * Retrieve the event payload, while verifing its signature against our Stripe's webhook secret key.
       */
      const payload = stripe.webhooks.constructEvent(
        request.raw()!,
        request.header('stripe-signature')!,
        env.get('STRIPE_WEBHOOK_SECRET')!
      )

      /**
       * Handle the event based on its type, making use of the StripeWebhooksService.
       */
      switch (payload.type) {
        case 'payment_method.attached':
          await this.stripeWebhooksService.handlePaymentMethodAttachment(
            payload.data.object as Stripe.PaymentMethod
          )
          break
        case 'payment_method.detached':
          await this.stripeWebhooksService.handlePaymentMethodDetachment(
            payload.data.object as Stripe.PaymentMethod
          )
          break
      }

      return { received: true }
    } catch (error) {
      logger.error(error, 'Some error occured while handling Stripe webhook.')
      return response.badRequest(error.message)
    }
  }
}
