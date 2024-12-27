import React from 'react'
import { Fleet } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '#common/ui/components/card'
import Button from '#common/ui/components/button'
import DeleteApplicationDialog from '../components/delete_application_dialog'

export default function EditPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  return (
    <ApplicationLayout title="Settings" breadcrumbs={[{ label: 'Settings' }]}>
      <DeleteApplicationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
      <div className="sm:col-span-3 lg:col-span-4">
        <Card>
          <CardContent>
            <CardTitle>Delete Application</CardTitle>
            <CardDescription>
              Deleting this application will permanently remove all associated data.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete Application
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ApplicationLayout>
  )
}
