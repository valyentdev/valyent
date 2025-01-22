import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#common/ui/components/card'
import { useForm } from '@inertiajs/react'
import Button from '#common/ui/components/button'
import useSuccessToast from '#common/ui/hooks/use_success_toast'
import useParams from '#common/ui/hooks/use_params'
import Organization from '#organizations/database/models/organization'
import InputField from '#common/ui/components/input_field'
import Input from '#common/ui/components/input'
import { IconCheck, IconCopy } from '@tabler/icons-react'

export type EditOrganizationCardProps = {
  organization: Organization
}

export default function EditOrganizationCard({ organization }: EditOrganizationCardProps) {
  const successToast = useSuccessToast()
  const form = useForm({ name: organization.name })
  const params = useParams()
  const [copied, setCopied] = React.useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.patch(`/organizations/${params.organizationSlug}`, {
      onSuccess: () => successToast(),
    })
  }
  const handleCopySlugToClipboard = () => {
    navigator.clipboard.writeText(organization.slug)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5 * 1000)
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
            <div className="grid gap-1">
              <InputField
                label="Organization slug"
                id="slug"
                readOnly
                value={organization.slug}
                onChange={() => {}}
                helper="This field cannot be changed. It serves as a unique identifier for your organization."
                inputClassName="!rounded-r-none"
              >
                <Button
                  className="!rounded-l-none !h-10"
                  type="button"
                  onClick={handleCopySlugToClipboard}
                >
                  {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
                </Button>
              </InputField>
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
