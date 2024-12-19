import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#common/ui/components/card'
import { useForm } from '@inertiajs/react'
import Button from '#common/ui/components/button'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import useParams from '#common/ui/hooks/use_params'
import Organization from '#organizations/database/models/organization'
import InputField from '#common/ui/components/input_field'

export type EditOrganizationCardProps = {
  organization: Organization
}

export default function EditOrganizationCard({ organization }: EditOrganizationCardProps) {
  const successToast = useSuccessToast()
  const form = useForm({ name: organization.name })
  const params = useParams()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.patch(`/organizations/${params.organizationSlug}`, {
      onSuccess: () => successToast(),
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-1">
              <InputField
                label="Organization name"
                id="name"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                minLength={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button loading={form.processing} type="submit">
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
