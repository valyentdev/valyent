import useUser from '#common/ui/hooks/use_user'
import { useForm } from '@inertiajs/react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#common/ui/components/card'
import Button from '#common/ui/components/button'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import * as React from 'react'
import InputField from '#common/ui/components/input_field'

export default function MyAccountCard() {
  const user = useUser()
  const successToast = useSuccessToast()

  const form = useForm({
    email: user.email,
    fullName: user.fullName,
    newPassword: '',
    confirmPassword: '',
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.patch('/settings', {
      onSuccess: () => successToast(),
      forceFormData: true,
    })
  }

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-4 divide-y divide-zinc-600/20">
          <div className="space-y-4 px-6">
            <div className="grid gap-1">
              <InputField
                label="Email Address"
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <InputField
                label="Full Name"
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={form.data.fullName}
                onChange={(e) => form.setData('fullName', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 px-6 pt-6">
            <div className="grid gap-1">
              <InputField
                label="New Password"
                labelRight={<span className="text-zinc-700">(optional)</span>}
                id="newPassword"
                placeholder="••••••••••••"
                type="password"
                value={form.data.newPassword}
                onChange={(e) => form.setData('newPassword', e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <InputField
                label="Confirm Password"
                labelRight={<span className="text-zinc-700">(optional)</span>}
                id="confirmPassword"
                placeholder="••••••••••••"
                type="password"
                value={form.data.confirmPassword}
                onChange={(e) => form.setData('confirmPassword', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button loading={form.processing} type="submit">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
