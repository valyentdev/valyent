import * as React from 'react'
import AuthLayout from '../components/auth_layout'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import Organization from '#organizations/database/models/organization'
import Button from '#common/ui/components/button'
import { useForm } from '@inertiajs/react'
import Label from '#common/ui/components/label'
import { IconCircleCheck } from '@tabler/icons-react'

interface CliProps {
  organizations: Organization[]
  success?: boolean
}

const Cli: React.FunctionComponent<CliProps> = ({ organizations, success }) => {
  const form = useForm({
    organizationID: organizations.length > 0 ? organizations[0].id : '',
  })

  function continueAs(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.post(window.location.href)
  }

  if (success) {
    return (
      <AuthLayout title="CLI Authenticated">
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded-sm flex items-start">
          <IconCircleCheck className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-emerald-700">
            <p className="font-semibold mb-1">Successfully authenticated</p>
            <p>You can now interact with Valyent's API from the CLI.</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Authenticate your CLI">
      <Label>Organization</Label>
      <Select
        value={form.data.organizationID}
        onValueChange={(id) => form.setData('organizationID', id)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an organization" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select an organization</SelectLabel>
            {organizations.map((organization) => (
              <SelectItem key={organization.id} value={organization.id}>
                {organization.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {organizations.length > 0 ? (
        <form className="max-w-xl mx-auto mt-4" onSubmit={continueAs}>
          <Button type="submit" value="Submit" loading={form.processing} className="w-full">
            Continue
          </Button>
        </form>
      ) : null}
    </AuthLayout>
  )
}

export default Cli
