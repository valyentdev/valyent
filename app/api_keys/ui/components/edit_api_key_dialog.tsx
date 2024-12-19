import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#common/ui/components/dialog'
import Button from '#common/ui/components/button'
import { Input } from '#common/ui/components/input'
import Label from '#common/ui/components/label'
import ApiKey from '#api_keys/database/models/api_key'
import { useForm } from '@inertiajs/react'
import useParams from '#common/ui/hooks/use_params'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import React from 'react'

const EditApiKeyDialog = ({
  isOpen,
  onClose,
  apiKey,
}: {
  isOpen: boolean
  onClose: () => void
  apiKey: ApiKey
}) => {
  const params = useParams()
  const form = useForm({ name: apiKey.name })
  const successToast = useSuccessToast()

  const handleSave = () => {
    form.patch(`/organizations/${params.organizationSlug}/api_keys/${apiKey.id}`, {
      onSuccess: () => {
        successToast('API Key updated successfully.')
      },
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={form.data.name}
            onChange={(e) => form.setData('name', e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditApiKeyDialog
