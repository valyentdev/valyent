import React from 'react'
import { Fleet, Gateway } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import { Card, CardTitle, CardContent, CardDescription } from '#common/ui/components/card'
import { IconCirclePlus, IconExternalLink } from '@tabler/icons-react'
import Button from '#common/ui/components/button'
import CreateGatewayDialog from '../components/create_gateway_dialog'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '#common/ui/components/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '#common/ui/components/dropdown_menu'
import { MoreHorizontal, Trash } from 'lucide-react'
import DeleteGatewayDialog from '../components/delete_gateway_dialog'
import useOrganizations from '#organizations/ui/hooks/use_organizations'

export default function GatewaysPage({ gateways }: { fleet: Fleet; gateways: Array<Gateway> }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Gateways' }]}>
      <CreateGatewayDialog open={isCreateDialogOpen} setOpen={setIsCreateDialogOpen} />
      <div className="flex space-x-4 items-center">
        <CardTitle>Gateways</CardTitle>

        <Button
          icon={<IconCirclePlus className="h-4 w-4" />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create Gateway
        </Button>
      </div>
      <CardDescription className="flex flex-wrap mt-2">
        <p className="mr-1">View and manage the entrypoints of your machines.</p>
        <a
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          href="https://docs.valyent.cloud/glossary#gateway"
          target="_blank"
        >
          <span>Learn more about Valyent Gateways.</span>
          <IconExternalLink className="h-4 w-4" />
        </a>
      </CardDescription>
      <Card className="sm:col-span-3 lg:col-span-4 mt-8">
        <CardContent className="p-0">
          <Table className="rounded-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Target Port</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gateways.length === 0 ? (
                <TableCell>
                  <p className="text-sm italic text-muted-foreground">No gateway yet...</p>
                </TableCell>
              ) : null}
              {gateways.map((gateway) => (
                <GatewayTableItem gateway={gateway} key={gateway.id} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}

function GatewayTableItem({ gateway }: { gateway: Gateway }) {
  const [openDeleteGatewayDialog, setOpenDeleteGatewayDialog] = React.useState(false)

  return (
    <TableRow>
      <DeleteGatewayDialog
        gateway={gateway}
        isOpen={openDeleteGatewayDialog}
        onClose={() => setOpenDeleteGatewayDialog(false)}
      />

      <TableCell>
        <a
          href={`https://${gateway.name}.valyent.app`}
          className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          target="_blank"
        >
          {gateway.name}
        </a>
      </TableCell>
      <TableCell>{gateway.id}</TableCell>
      <TableCell>{gateway.target_port}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-700"
              onClick={() => setOpenDeleteGatewayDialog(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
