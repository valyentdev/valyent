import React from 'react'
import ApplicationsLayout from '../components/applications_layout'
import type { Fleet } from 'valyent.ts'
import { Link } from '@inertiajs/react'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Card, CardContent } from '#common/ui/components/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#common/ui/components/dropdown_menu'
import { MoreHorizontal, Edit, Logs, Network, SparkleIcon } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'

export default function IndexPage({ fleets }: { fleets: Array<Fleet> }) {
  return (
    <ApplicationsLayout>
      <div className="grid lg:grid-cols-3">
        {fleets.map((fleet) => (
          <FleetCard fleet={fleet} key={fleet.id} />
        ))}
      </div>
    </ApplicationsLayout>
  )
}

function FleetCard({ fleet }: { fleet: Fleet }) {
  const { currentOrganization } = useOrganizations()
  return (
    <Link
      className="group"
      href={`/organizations/${currentOrganization?.slug}/applications/${fleet.id}`}
    >
      <Card className="group-hover:border-zinc-600/40 transition-colors">
        <CardContent className="space-y-3 flex flex-col !py-5">
          <div className="flex justify-between">
            <div className="flex items-center gap-x-1">
              <SparkleIcon className="h-4.5 w-4.5 text-blue-700" />
              <span className="font-semibold text-zinc-600 text-sm hover:underline">
                {fleet.name}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="divide-y divide-zinc-200">
                <DropdownMenuItem className="text-emerald-700 hover:!text-emerald-900">
                  <Logs className="mr-2 h-4 w-4" />
                  View Logs
                </DropdownMenuItem>
                <DropdownMenuItem className="text-blue-700 hover:!text-blue-900">
                  <Network className="mr-2 h-4 w-4" />
                  Manage Gateways
                </DropdownMenuItem>
                <DropdownMenuItem className="text-purple-700 hover:!text-purple-900">
                  <Edit className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <span className="text-zinc-600 text-xs">
            Created {formatDistanceToNow(parseISO(fleet.created_at), { addSuffix: true })}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
