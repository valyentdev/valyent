import React from 'react'
import ApplicationLayout from '../components/application_layout'
import { Card, CardTitle, CardContent, CardDescription } from '#common/ui/components/card'
import { IconExternalLink } from '@tabler/icons-react'
import { MachineRecord, MachineStatus } from 'valyent.ts'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '#common/ui/components/table'
import { Link } from '@inertiajs/react'
import useParams from '#common/ui/hooks/use_params'
import { formatDistanceToNow, parseISO } from 'date-fns'
import clsx from 'clsx'
import MachineActions from '../components/machine_actions'

export default function MachinesPage({ machines }: { machines: Array<MachineRecord> }) {
  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Machines' }]}>
      <div className="sm:col-span-3 lg:col-span-4">
        <CardTitle>Machines</CardTitle>
        <CardDescription className="flex flex-wrap mt-1">
          <p className="mr-1">View and manage the virtual machines orchestrated by Ravel.</p>
          <a
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
            href="https://docs.valyent.cloud/glossary#machine"
            target="_blank"
          >
            <span>Learn more about Valyent Machines.</span>
            <IconExternalLink className="h-4 w-4" />
          </a>
        </CardDescription>
        <Card className="mt-8">
          <CardContent className="p-0">
            <Table className="rounded-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Machine</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.length === 0 ? (
                  <TableCell>
                    <p className="text-sm italic text-muted-foreground">No machine yet...</p>
                  </TableCell>
                ) : null}

                {machines.map((machine) => (
                  <MachineTableItem machine={machine} key={machine.id} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ApplicationLayout>
  )
}

function MachineTableItem({ machine }: { machine: MachineRecord }) {
  const params = useParams()
  return (
    <TableRow>
      <TableCell className="flex items-center space-x-2 mt-1">
        <div className="flex items-center">
          <div className={'flex-none rounded-full p-1 ' + getColorClass(machine.state)}>
            <div className={clsx('h-2 w-2 rounded-full bg-current')}></div>
          </div>
        </div>
        <Link
          href={`/organizations/${params.organizationSlug}/applications/${params.applicationId}/machines/${machine.id}`}
          className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          {machine.id}
        </Link>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center bg-gradient-to-b from-white/75 to-blue-100/75 rounded-sm border border-blue-200 text-blue-600 font-medium px-2 text-sm font-mono py-1 min-w-max">
          {machine.region}
        </span>
      </TableCell>
      <TableCell>
        {formatDistanceToNow(parseISO(machine.created_at), { addSuffix: true })}
      </TableCell>
      <TableCell>
        <MachineActions machine={machine} />
      </TableCell>
    </TableRow>
  )
}

function getColorClass(status: MachineStatus) {
  switch (status) {
    case MachineStatus.Stopped:
      return 'text-zinc-400 !bg-zinc-50'
    case MachineStatus.Starting:
    case MachineStatus.Stopping:
    case MachineStatus.Destroying:
    case MachineStatus.Preparing:
      return 'text-yellow-500 !bg-yellow-100'
    case MachineStatus.Destroyed:
      return 'text-red-500 !bg-red-100'
    case MachineStatus.Created:
    case MachineStatus.Running:
      return 'text-emerald-500 !bg-emerald-100 animate-pulse'
  }
}
