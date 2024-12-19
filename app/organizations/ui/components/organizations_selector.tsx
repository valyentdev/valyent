import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import useOrganizations from '../hooks/use_organizations'
import { IconPlus } from '@tabler/icons-react'
import CreateOrganizationDialog from './create_organization_dialog'
import Avatar from '#common/ui/components/avatar'

const OrganizationsSelector = () => {
  const { organizations, currentOrganization } = useOrganizations()
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [currentOrganizationSlug, setCurrentOrganizationSlug] = React.useState(
    currentOrganization?.slug
  )

  return (
    <>
      <CreateOrganizationDialog open={createDialogOpen} setOpen={setCreateDialogOpen} />

      <Select
        value={currentOrganizationSlug}
        onValueChange={(value) => {
          setCurrentOrganizationSlug(value)
          if (value === 'create') {
            setCreateDialogOpen(true)
            return
          }
          window.location.href = `/organizations/${value}`
        }}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentOrganizationSlug(currentOrganization?.slug)
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>

        <SelectContent>
          {organizations.map((organization) => (
            <SelectItem
              value={organization.slug}
              key={organization.slug}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Avatar text={organization.name || 'X Y'} />
                <div className="flex items-center space-x-3 sm:flex">
                  <span className="inline-block max-w-[100px] truncate text-sm font-medium sm:max-w-[200px]">
                    {organization?.name}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
          <SelectItem value="create" className="cursor-pointer py-2.5">
            <div className="flex items-center space-x-2">
              <IconPlus className="h-4 w-4 rounded-full shadow-lg mr-1" />
              <span>Create New Organization</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

export default OrganizationsSelector
