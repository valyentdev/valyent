import Button from '#common/ui/components/button'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '#common/ui/components/dialog'
import useParams from '#common/ui/hooks/use_params'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import { DialogDescription } from '@radix-ui/react-dialog'
import * as React from 'react'
import { MachineRecord } from 'valyent.ts'

interface DeleteMachineDialogProps {
  isOpen: boolean
  onClose: () => void
  machine: MachineRecord
}

const DeleteMachineDialog: React.FunctionComponent<DeleteMachineDialogProps> = ({
  isOpen,
  onClose,
  machine,
}) => {
  const params = useParams()
  const form = useForm({})
  const successToast = useSuccessToast()
  const handleDelete = () => {
    form.delete(
      `/organizations/${params.organizationSlug}/applications/${params.applicationId}/machines/${machine.id}`,
      {
        onSuccess: () => {
          successToast('Machine deleted successfully.')
        },
      }
    )
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Machine</DialogTitle>
          <DialogDescription>
            <p>
              Are you sure you want to <strong>delete</strong> the application?
            </p>
            <p>You won't be able to recover it.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Button variant="destructive" type="button" onClick={handleDelete}>
            Delete Machine
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMachineDialog
