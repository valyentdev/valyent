import React from 'react'
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
import { useForm } from '@inertiajs/react'
import useParams from '#common/ui/hooks/use_params'

const CreateApiKeyDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const params = useParams()
  const form = useForm({ name: '' })

  const handleCreate = () => {
    form.post(`/organizations/${params.organizationSlug}/api_keys`, {
      onSuccess: () => {
        onClose()
        form.reset()
      },
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
        </DialogHeader>
        <div className="px-6">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={form.data.name}
            onChange={(e) => form.setData('name', e.target.value)}
            placeholder="Manhattan Project"
          />
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleCreate}>
            Create Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateApiKeyDialog
