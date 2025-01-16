import React from 'react'
import Button from '#common/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '#common/ui/components/dialog'
import { useForm } from '@inertiajs/react'

export type QuitOrganizationCardProps = {
  organization: { name: string; slug: string }
}

export default function QuitOrganizationCard({ organization }: QuitOrganizationCardProps) {
  const { processing, post: handlePost } = useForm()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handlePost(`/organizations/${organization.slug}/quit`)
  }

  return (
    <Card className="mt-6" variant="danger">
      <CardHeader className="!border-red-600/30">
        <CardTitle>Quit organization</CardTitle>
        <CardDescription>Are you sure you want to quit this organization?</CardDescription>
      </CardHeader>
      <CardContent variant="danger">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="danger">Quit organization</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] rounded-sm !gap-0 !p-0 !pt-4 border-red-100">
            <DialogHeader>
              <DialogTitle>Quit organization</DialogTitle>

              <DialogDescription>
                Are you sure you want to quit this organization?
              </DialogDescription>
            </DialogHeader>

            <form
              className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
              onSubmit={onSubmit}
            >
              <Button variant="danger" loading={processing}>
                Quit organization
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
