import * as React from 'react'
import CRUDTable from '../components/crud_table'
import Button from '#common/ui/components/button'
import CreateApiKeyDialog from '../components/create_api_key_dialog'
import { IconCirclePlus } from '@tabler/icons-react'
import DashboardLayout from '#common/ui/components/dashboard_layout'

export default function Index() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  return (
    <DashboardLayout
      breadcrumbs={[{ label: 'API Keys' }]}
      title="API Keys"
      description="Manage your organization-related API Keys. These API keys are used to access the whole Valyent API."
      actionButton={
        <Button
          icon={<IconCirclePlus className="h-4 w-4" />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create API Key
        </Button>
      }
    >
      <CreateApiKeyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      <CRUDTable />
    </DashboardLayout>
  )
}
