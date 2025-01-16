import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#common/ui/components/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#common/ui/components/dropdown_menu'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import usePageProps from '#common/ui/hooks/use_page_props'
import ApiKey from '#api_keys/database/models/api_key'
import EditApiKeyDialog from './edit_api_key_dialog'
import { Card, CardContent } from '#common/ui/components/card'
import DeleteApiKeyDialog from './delete_api_key_dialog'
import { DateTime } from 'luxon'

const CRUDTable = () => {
  const { apiKeys } = usePageProps<{ apiKeys: ApiKey[] }>()
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedApiKey, setSelectedApiKey] = React.useState<ApiKey | null>(null)

  const handleEdit = (id: number) => {
    const apiKey = apiKeys.find((key) => key.id === id)
    if (!apiKey) return
    setSelectedApiKey(apiKey)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    const apiKey = apiKeys.find((key) => key.id === id)
    if (!apiKey) return
    setSelectedApiKey(apiKey)
    setIsDeleteDialogOpen(true)
  }

  const formatDate = (date: DateTime | null): string => {
    if (date === null) {
      return 'Never'
    }
    return new Date(date as unknown as number).toLocaleTimeString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table className="rounded-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.name}</TableCell>
                <TableCell>{formatDate(key.createdAt)}</TableCell>
                <TableCell>{formatDate(key.updatedAt)}</TableCell>
                <TableCell>{formatDate(key.lastUsedAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(key.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-700"
                        onClick={() => handleDelete(key.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedApiKey && (
          <EditApiKeyDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            apiKey={selectedApiKey}
          />
        )}
        {selectedApiKey && (
          <DeleteApiKeyDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            apiKey={selectedApiKey}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default CRUDTable
