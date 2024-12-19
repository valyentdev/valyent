import * as React from 'react'
import CRUDTable from '../components/crud_table'
import Button from '#common/ui/components/button'
import CreateApiKeyDialog from '../components/create_api_key_dialog'
import { IconCirclePlus } from '@tabler/icons-react'
import DashboardLayout from '#common/ui/components/dashboard_layout'
import ApplicationsLayout from '#applications/ui/components/applications_layout'

export default function Index() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  return (
    <ApplicationsLayout>
      <div className="flex gap-x-4">
        <h1 className="pb-2 text-2xl sm:text-3xl tracking-tight font-serif text-black">API Keys</h1>
        <Button
          icon={<IconCirclePlus className="h-4 w-4" />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create API Key
        </Button>
      </div>
      <h2 className="pb-8 text-sm text-zinc-600 font-normal">
        Manage your organization-related API Keys. These API keys are used to access the whole
        Valyent API.
      </h2>

      <CreateApiKeyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      <CRUDTable />
    </ApplicationsLayout>
  )
}
