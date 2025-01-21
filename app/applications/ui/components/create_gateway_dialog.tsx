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
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import useParams from '#common/ui/hooks/use_params'

export type CreateGatewayDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CreateGatewayDialog({ open, setOpen }: CreateGatewayDialogProps) {
  const { currentOrganization } = useOrganizations()
  const successToast = useSuccessToast()
  const params = useParams()
  const form = useForm({
    name: '',
    targetPort: 3000,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.post(
      `/organizations/${currentOrganization?.slug}/applications/${params.applicationId}/gateways`,
      {
        onSuccess: () => {
          successToast('Gateway successfully created.')

          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] gap-0">
        <DialogHeader>
          <DialogTitle>New Gateway</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-2">
              <Label htmlFor="name">Gateway Name</Label>

              <div className="flex">
                <span className="flex h-10 rounded-sm text-neutral-500 font-medium rounded-r-none border-r-0 border border-zinc-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200">
                  https://
                </span>
                <Input
                  id="name"
                  className="!col-span-3 rounded-none"
                  autoComplete="off"
                  value={form.data.name}
                  placeholder="bolero"
                  onChange={(e) =>
                    form.setData('name', e.target.value.toLowerCase().replace(' ', '-'))
                  }
                  minLength={3}
                  maxLength={30}
                />
                <span className="flex h-10 rounded-sm text-neutral-500 font-medium rounded-l-none border-l-0 border border-zinc-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200">
                  valyent.app
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 py-4 px-6 pt-0">
            <div className="grid gap-2">
              <Label htmlFor="targetPort">Target Port</Label>

              <Input
                id="targetPort"
                className="!col-span-3 w-full"
                autoComplete="off"
                value={form.data.targetPort}
                placeholder="8080"
                defaultValue="3000"
                onChange={(e) => form.setData('targetPort', parseInt(e.target.value))}
                minLength={0}
                step={1}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" loading={form.processing}>
              <span>Create new Gateway</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
