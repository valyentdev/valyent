import React from 'react'
import { Link } from '@inertiajs/react'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Card, CardContent } from '#common/ui/components/card'
import { BrainCircuitIcon, PlusCircleIcon, SparkleIcon } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Application from '#applications/database/models/application'
import Onboarding from '../components/onboarding'
import DashboardLayout from '#common/ui/components/dashboard_layout'

export default function IndexPage({ applications }: { applications: Array<Application> }) {
  const { currentOrganization } = useOrganizations()
  return (
    <DashboardLayout
      actionButton={
        <Link
          className="btn-primary"
          href={`/organizations/${currentOrganization?.slug}/applications/create`}
        >
          <PlusCircleIcon className="h-4 w-4" />
          <span>Create Application</span>
        </Link>
      }
      breadcrumbs={[{ label: 'Applications' }]}
      title="Applications"
    >
      {applications.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-4">
          {applications.map((application) => (
            <ApplicationCard application={application} key={application.id} />
          ))}
        </div>
      ) : (
        <Onboarding
          title="Start deploying your applications."
          description="Follow the steps below to start deploying your applications with Valyent."
        />
      )}
    </DashboardLayout>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  const { currentOrganization } = useOrganizations()
  const baseApplicationPath = `/organizations/${currentOrganization?.slug}/applications/${application.id}`

  return (
    <Link className="group" href={baseApplicationPath}>
      <Card className="group-hover:border-zinc-600/40 transition-colors">
        <CardContent className="space-y-3 flex flex-col !py-5">
          <div className="flex items-center gap-x-1">
            {application.name === 'sandboxes' ? (
              <BrainCircuitIcon className="h-4.5 w-4.5 text-purple-700" />
            ) : (
              <SparkleIcon className="h-4.5 w-4.5 text-blue-700" />
            )}
            <span className="font-semibold text-zinc-600 text-sm hover:underline">
              {application.name}
            </span>
          </div>
          <span className="text-zinc-600 text-xs">
            Created{' '}
            {formatDistanceToNow(parseISO(application.fleet!.created_at), { addSuffix: true })}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
