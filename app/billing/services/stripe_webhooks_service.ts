import Organization from '#organizations/database/models/organization'
import { DateTime } from 'luxon'
import Stripe from 'stripe'

export default class StripeWebhooksService {
  async handlePaymentMethodAttachment(paymentMethod: Stripe.PaymentMethod) {
    /**
     * Retrieve the Stripe customer ID.
     */
    if (!paymentMethod || !paymentMethod.customer) {
      throw new Error(
        'StripeWebhooksService failed to retrieve the Stripe customer object, while attaching a method method.'
      )
    }
    const stripeCustomerId = paymentMethod.customer.toString()

    /**
     * Try to retrieve an organization with a matching Stripe customer ID.
     */
    const organization = await Organization.query()
      .where('stripe_customer_id', stripeCustomerId)
      .first()
    if (organization === null) {
      throw new Error(
        'StripeWebhooksService failed to retrieve organization, while trying to attach a payment method.'
      )
    }

    /**
     * Set the payment method-related fields.
     */
    const expirationDate = DateTime.fromObject({
      month: paymentMethod.card!.exp_month,
      year: paymentMethod.card!.exp_year,
    })
    organization.stripePaymentMethodExpirationDate = expirationDate
    organization.stripePaymentMethodId = paymentMethod.id

    /**
     * Save the now updated organization in the database.
     */
    await organization.save()
  }

  async handlePaymentMethodDetachment(paymentMethod: Stripe.PaymentMethod) {
    /**
     * Try to retrieve an organization with the matching payment method to detach.
     */
    const organization = await Organization.query()
      .where('stripe_payment_method_id', paymentMethod.id)
      .first()
    if (organization === null) {
      throw new Error(
        'StripeWebhooksService failed to retrieve organization while trying to detach a payment method'
      )
    }

    /**
     * Set the payment method-related fields to null.
     */
    organization.stripePaymentMethodId = null
    organization.stripePaymentMethodExpirationDate = null

    /**
     * Save the now updated organization in the database.
     */
    await organization.save()
  }
}
