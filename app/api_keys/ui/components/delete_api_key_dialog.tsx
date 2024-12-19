import ApiKey from '#api_keys/database/models/api_key'
import Button from '#common/ui/components/button'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '#common/ui/components/dialog'
import useParams from '#common/ui/hooks/use_params'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import { useForm } from '@inertiajs/react'
import { DialogDescription } from '@radix-ui/react-dialog'
import * as React from 'react'

interface DeleteApiKeyDialogProps {
  isOpen: boolean
  onClose: () => void
  apiKey: ApiKey
}

const DeleteApiKeyDialog: React.FunctionComponent<DeleteApiKeyDialogProps> = ({
  isOpen,
  apiKey,
  onClose,
}) => {
  const params = useParams()
  const form = useForm({})
  const successToast = useSuccessToast()
  const handleDelete = () => {
    form.delete(`/organizations/${params.organizationSlug}/api_keys/${apiKey.id}`, {
      onSuccess: () => {
        successToast('API Key deleted successfully.')
      },
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete API Key</DialogTitle>
          <DialogDescription>
            <p>
              Are you sure you want to <strong>delete</strong> the API key?
            </p>
            <p>You won't be able to recover it.</p>
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <Button variant="destructive" type="button" onClick={handleDelete}>
            Delete Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteApiKeyDialog
