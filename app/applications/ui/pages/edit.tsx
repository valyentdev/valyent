import React from 'react'
import { Fleet } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import Button from '#common/ui/components/button'

export default function EditPage({ fleet }: { fleet: Fleet }) {
  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Settings' }]}>
      <div className="sm:col-span-3 lg:col-span-4">
        <Card>
          <CardContent>
            <CardTitle>Delete Application</CardTitle>
            <CardDescription>
              Deleting this application will permanently remove all associated data.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="destructive">Delete Application</Button>
          </CardFooter>
        </Card>
      </div>
    </ApplicationLayout>
  )
}
