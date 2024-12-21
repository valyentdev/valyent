import Button from '#common/ui/components/button'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '#common/ui/components/dialog'
import useParams from '#common/ui/hooks/use_params'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import { DialogDescription } from '@radix-ui/react-dialog'
import * as React from 'react'
import { Gateway } from 'valyent.ts'

interface DeleteGatewayDialogProps {
  isOpen: boolean
  onClose: () => void
  gateway: Gateway
}

const DeleteGatewayDialog: React.FunctionComponent<DeleteGatewayDialogProps> = ({
  isOpen,
  gateway,
  onClose,
}) => {
  const params = useParams()
  const form = useForm({})
  const successToast = useSuccessToast()
  const handleDelete = () => {
    form.delete(
      `/organizations/${params.organizationSlug}/applications/${params.applicationId}/gateways/${gateway.id}`,
      {
        onSuccess: () => {
          successToast('Gateway deleted successfully.')
        },
      }
    )
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Gateway</DialogTitle>
          <DialogDescription>
            <p>
              Are you sure you want to <strong>delete</strong> the gateway?
            </p>
            <p>You won't be able to recover it.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Button variant="destructive" type="button" onClick={handleDelete}>
            Delete Gateway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteGatewayDialog
