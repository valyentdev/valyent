import React from 'react'
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
import EditApplicationSpecs from '../components/edit_application_specs'

export default function EditPage({ application }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  return (
    <ApplicationLayout title="Settings" breadcrumbs={[{ label: 'Settings' }]}>
      <div className="space-y-6">
        <div className="sm:col-span-3 lg:col-span-4">
          <EditApplicationSpecs application={application} />
        </div>

        <div className="sm:col-span-3 lg:col-span-4">
          <DeleteApplicationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
          />
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
      </div>
    </ApplicationLayout>
  )
}
