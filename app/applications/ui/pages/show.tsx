import React from 'react'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Application from '#applications/database/models/application'
import { Cpu, MemoryStick } from 'lucide-react'

export default function ShowPage({ application }: { application: Application }) {
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
                <dt className="font-medium text-sm text-foreground">Application Name</dt>
                <dd className="text-sm text-muted-foreground">{application.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-sm text-foreground">Created At</dt>
                <dd className="text-sm text-muted-foreground">
                  {formatDistanceToNow(parseISO(application.fleet!.created_at), {
                    addSuffix: true,
                  })}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-sm text-foreground">Region</dt>
                <dd className="text-sm text-muted-foreground flex space-x-1 items-center">
                  <img className="w-4 h-4" src="/ovh.svg" />
                  <span>{application.region}</span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-sm text-foreground">RAM</dt>
                <dd className="text-sm text-muted-foreground flex space-x-1 items-center">
                  <MemoryStick className="w-4 h-4 text-blue-900" />
                  <span>{application.guest.memory_mb}MB</span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-sm text-foreground">CPU Kind</dt>
                <dd className="text-sm text-muted-foreground flex space-x-1 items-center">
                  <Cpu className="w-4 h-4 text-blue-900" />
                  <span>{application.guest.cpu_kind}</span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-sm text-foreground">VCPUs</dt>
                <dd className="text-sm text-muted-foreground">{application.guest.cpus}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ApplicationLayout>
  )
}
