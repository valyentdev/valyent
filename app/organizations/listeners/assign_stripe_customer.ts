import Organization from '#organizations/database/models/organization'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import Stripe from 'stripe'

export default class AssignStripeCustomer {
  @inject()
  async handle({ organization }: { organization: Organization }) {
    const stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    })
    const [member] = await organization.related('members').query().where('role', 'owner').limit(1)
    const owner = await member.related('user').query().firstOrFail()
    const customer = await stripe.customers.create({
      email: owner.email,
      name: organization.name,
    })
    organization.stripeCustomerId = customer.id
    await organization.save()
  }
}
