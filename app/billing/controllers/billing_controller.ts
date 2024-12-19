import Organization from '#organizations/database/models/organization'
import bindOrganizationWithMember from '#organizations/decorators/bind_organization_with_member'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import Stripe from 'stripe'

@inject()
export default class BillingController {
  #stripe = new Stripe(env.get('STRIPE_SECRET_KEY'), {
    apiVersion: '2024-06-20',
  })

  @bindOrganizationWithMember
  async show({ inertia }: HttpContext) {
    return inertia.render('billing/show', {
      invoices: [],
    })
  }

  @bindOrganizationWithMember
  async manage({ response }: HttpContext, organization: Organization) {
    const redirectUrl =
      env.get('APP_URL', 'http://localhost:3333') +
      router.makeUrl('billing.show', {
        organizationSlug: organization.slug,
      })

    const configuration = await this.#stripe.billingPortal.configurations.create({
      business_profile: {
        privacy_policy_url: 'https://valyent.cloud/legal/privacy',
        terms_of_service_url: 'https://valyent.cloud/legal/terms',
      },
      features: {
        customer_update: {
          allowed_updates: ['email', 'tax_id'],
          enabled: true,
        },
        invoice_history: {
          enabled: true,
        },
      },
    })

    const session = await this.#stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: redirectUrl,
      configuration: configuration.id,
    })

    return response.redirect(session.url)
  }

  @bindOrganizationWithMember
  async initiatePaymentMethodChange(
    { request, response }: HttpContext,
    organization: Organization
  ) {
    const fromOverview = request.qs().overview === 'true'
    let redirectUrl: string
    if (fromOverview) {
      redirectUrl =
        env.get('APP_URL', 'http://localhost:3333') +
        router.makeUrl('organizations.show', {
          organizationSlug: organization.slug,
        })
    } else {
      redirectUrl =
        env.get('APP_URL', 'http://localhost:3333') +
        router.makeUrl('billing.show', {
          organizationSlug: organization.slug,
        })
    }

    const session = await this.#stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      customer: organization.stripeCustomerId,
      success_url: redirectUrl + '?payment_success=true',
      cancel_url: redirectUrl,
    })

    return response.redirect(session.url!)
  }
}
