import Button from '#common/ui/components/button'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '#common/ui/components/dialog'
import useParams from '#common/ui/hooks/use_params'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import { DialogDescription } from '@radix-ui/react-dialog'
import * as React from 'react'

interface DeleteApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
}

const DeleteApplicationDialog: React.FunctionComponent<DeleteApplicationDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const params = useParams()
  const form = useForm({})
  const successToast = useSuccessToast()
  const handleDelete = () => {
    form.delete(`/organizations/${params.organizationSlug}/applications/${params.applicationId}`, {
      onSuccess: () => {
        successToast('Application deleted successfully.')
      },
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Application</DialogTitle>
          <DialogDescription>
            <p>
              Are you sure you want to <strong>delete</strong> the application?
            </p>
            <p>You won't be able to recover it.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Button variant="destructive" type="button" onClick={handleDelete}>
            Delete Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteApplicationDialog
