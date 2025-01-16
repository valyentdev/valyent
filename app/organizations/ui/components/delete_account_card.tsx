import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '#common/ui/components/card'
import { useForm } from '@inertiajs/react'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '#common/ui/components/dialog'
import React from 'react'
import Button from '#common/ui/components/button'

export default function DeleteAccountCard() {
  const form = useForm({})

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.delete('/settings')
  }

  return (
    <Card className="mt-6" variant="danger">
      <CardHeader className="!border-red-600/30">
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Once you delete your account, there is no going back. All your data will be deleted.
        </CardDescription>
      </CardHeader>
      <CardContent variant="danger">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] rounded-sm !gap-0 !p-0 !pt-4 border-red-100">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>

              <DialogDescription>Are you sure you want to delete your account?</DialogDescription>
            </DialogHeader>

            <form
              className="bg-red-50 border-t border-red-100 rounded-b-md py-4 px-6"
              onSubmit={onSubmit}
            >
              <Button variant="destructive" loading={form.processing} type="submit">
                Delete Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
