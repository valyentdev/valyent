import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '#common/ui/components/dialog'
import Spinner from '#common/ui/components/spinner'
import useUser from '#common/ui/hooks/use_user'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import * as React from 'react'

export default function PaymentMethodDialog() {
  const { currentOrganization } = useOrganizations()
  const [loading, setLoading] = React.useState(false)
  return (
    <Dialog open={currentOrganization!.hasValidPaymentMethod}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[425px] rounded-md !gap-0 !p-0 !pt-4 border-zinc-300/20"
        noClose
      >
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>

          <DialogDescription>
            You can add a payment method to your account by clicking the button below. This will
            allow you to pay for your invoices automatically, based on your usage.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 border-t border-zinc-300/20 rounded-b-lg bg-accent">
          <a
            className="focus:outline-none btn-emerald"
            href="/billing/change_payment_method"
            onClick={() => setLoading(true)}
            autoFocus
          >
            {loading && <Spinner className="mr-2 h-4 w-4" />}
            Add Payment Method
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
