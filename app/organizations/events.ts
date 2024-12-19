import emitter from '@adonisjs/core/services/emitter'
import OrganizationCreated from './events/organization_created.js'

const AssignStripeCustomer = () => import('./listeners/assign_stripe_customer.js')

emitter.on(OrganizationCreated, [AssignStripeCustomer])
