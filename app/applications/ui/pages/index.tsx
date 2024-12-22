import React from 'react'
import ApplicationsLayout from '../components/applications_layout'
import type { Fleet } from 'valyent.ts'
import { Link } from '@inertiajs/react'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Card, CardContent } from '#common/ui/components/card'
import { PlusCircleIcon, SparkleIcon } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import Button from '#common/ui/components/button'
import CreateApplicationDialog from '../components/create_application_dialog'

export default function IndexPage({ fleets }: { fleets: Array<Fleet> }) {
  const [createApplicationDialogOpen, setCreateApplicationDialogOpen] = React.useState(false)

  return (
    <ApplicationsLayout breadcrumbs={[{ label: 'List' }]}>
      <CreateApplicationDialog
        open={createApplicationDialogOpen}
        setOpen={setCreateApplicationDialogOpen}
      />
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-serif text-black">
          List of Applications
        </h1>
        <Button
          onClick={() => setCreateApplicationDialogOpen(true)}
          icon={<PlusCircleIcon className="h-4 w-4" />}
        >
          Create Application
        </Button>
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-8">
        {fleets.map((fleet) => (
          <FleetCard fleet={fleet} key={fleet.id} />
        ))}
      </div>
    </ApplicationsLayout>
  )
}

function FleetCard({ fleet }: { fleet: Fleet }) {
  const { currentOrganization } = useOrganizations()
  const baseFleetPath = `/organizations/${currentOrganization?.slug}/applications/${fleet.id}`
  return (
    <Link className="group" href={baseFleetPath}>
      <Card className="group-hover:border-zinc-600/40 transition-colors">
        <CardContent className="space-y-3 flex flex-col !py-5">
          <div className="flex items-center gap-x-1">
            <SparkleIcon className="h-4.5 w-4.5 text-blue-700" />
            <span className="font-semibold text-zinc-600 text-sm hover:underline">
              {fleet.name}
            </span>
          </div>
          <span className="text-zinc-600 text-xs">
            Created {formatDistanceToNow(parseISO(fleet.created_at), { addSuffix: true })}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
