import * as React from 'react'
import Step from './step'
import useParams from '../hooks/use_params'
import { IconCreditCard, IconInfoCircle } from '@tabler/icons-react'
import useQuery from '../hooks/use_query'
import LinkWithSpinner from './link_with_spinner'
import useOrganizations from '#organizations/ui/hooks/use_organizations'

export default function BillingInformationStep() {
  /**
   * Retrieve the query parameters from Inertia page props.
   */
  const query = useQuery()

  /**
   * Retrieve the URL parameters from Inertia page props.
   */
  const params = useParams()

  /**
   * Retrieve the current organization from Inertia page props.
   */
  const { currentOrganization } = useOrganizations()

  /**
   * Compute property to figure out whether a valid payment method now exists for the current organization.
   */
  const paymentMethodAdded: boolean =
    query['payment_success'] === 'true' || !!currentOrganization?.hasValidPaymentMethod

  return (
    <Step
      title="Billing Information"
      description="Valyent bills on usage. Add a payment method to start using our services."
    >
      <div>
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-400 rounded-md flex items-start">
          <IconInfoCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-emerald-700">
            <p className="font-semibold mb-1">Usage-Based Billing</p>
            <p>You'll only be charged for what you use. No upfront costs or minimum fees.</p>
          </div>
        </div>
        {paymentMethodAdded ? (
          <div className="flex items-center text-emerald-600 font-medium">
            <IconCreditCard className="h-4 w-4 mr-2" />
            <span>Payment method added successfully!</span>
          </div>
        ) : (
          <div>
            <LinkWithSpinner
              className="btn-emerald gap-x-2"
              href={`/organizations/${params.organizationSlug}/billing/change_payment_method?overview=true`}
              icon={<IconCreditCard className="h-4 w-4" />}
              label="Add Payment Method"
            />
            <p className="mt-2 text-xs text-zinc-600">
              Your card won't be charged until you start using our services.
            </p>
          </div>
        )}
      </div>
    </Step>
  )
}
