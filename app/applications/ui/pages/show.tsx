import React from 'react'
import { Fleet } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import { formatDistanceToNow, parseISO } from 'date-fns'

export default function ShowPage({ fleet }: { fleet: Fleet }) {
  const { currentOrganization } = useOrganizations()
  const basePath = `/organizations/${currentOrganization?.slug}`
  return (
    <ApplicationLayout title="Overview" breadcrumbs={[{ label: 'Overview' }]}>
      <div className="sm:col-span-3 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
            <CardDescription>Check out details of your application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="font-medium text-sm text-foreground">Fleet Name</dt>
                <dd className="text-sm text-muted-foreground">{fleet.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-sm text-foreground">Created At</dt>
                <dd className="text-sm text-muted-foreground">
                  {formatDistanceToNow(parseISO(fleet.created_at), { addSuffix: true })}
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ApplicationLayout>
  )
}
