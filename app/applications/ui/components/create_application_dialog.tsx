import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from '#common/ui/components/dialog'
import Button from '#common/ui/components/button'
import { useForm } from '@inertiajs/react'
import Label from '#common/ui/components/label'
import { Input } from '#common/ui/components/input'
import useOrganizations from '#organizations/ui/hooks/use_organizations'

export type CreateApplicationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CreateApplicationDialog({ open, setOpen }: CreateApplicationDialogProps) {
  const { currentOrganization } = useOrganizations()

  const form = useForm({
    name: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(`/organizations/${currentOrganization?.slug}/applications`, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-2">
              <Label>Application Name</Label>

              <Input
                id="name"
                className="!col-span-3 w-full"
                autoComplete="off"
                value={form.data.name}
                placeholder="bolero"
                onChange={(e) =>
                  form.setData('name', e.target.value.toLowerCase().replace(' ', '-'))
                }
                minLength={3}
                maxLength={30}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" loading={form.processing}>
              <span>Create new application</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
