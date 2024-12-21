import { Machine, MachineEvent } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#common/ui/components/card'
import useParams from '#common/ui/hooks/use_params'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { CpuIcon, Hash } from 'lucide-react'
import MachineActions from '../components/machine_actions'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '#common/ui/components/table'

export default function MachinePage({
  machine,
  events,
}: {
  machine: Machine
  events: Array<MachineEvent>
}) {
  const params = useParams()
  return (
    <ApplicationLayout
      breadcrumbs={[
        {
          href: `/organizations/${params.organizationSlug}/applications/${params.applicationId}/machines`,
          label: 'Machines',
        },
        {
          label: (
            <div className="flex items-center space-x-2">
              <CpuIcon className="h-4 w-4 text-zinc-600" />

              <span>{machine.id}</span>
            </div>
          ),
        },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 justify-between">
            <span>Machine Information</span>
            <MachineActions big machine={machine} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="font-medium text-sm text-foreground">Machine ID</dt>
              <dd className="text-sm text-muted-foreground">{machine.id}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="font-medium text-sm text-foreground">Region</dt>
              <dd className="text-sm text-muted-foreground">
                <span className="inline-flex items-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 rounded-md border border-blue-200 text-blue-600 font-medium px-2 text-sm font-mono py-1 min-w-max">
                  {machine.region}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-sm text-foreground">Image</dt>
              <dd className="text-sm text-muted-foreground">
                <div className="inline-flex space-x-1 w-full items-center lg:bg-gradient-to-b from-white/75 to-zinc-100/75 rounded-md border border-zinc-200 text-zinc-600 font-medium p-2 text-sm font-mono">
                  <Hash className="h-4 w-4 text-zinc-600" />
                  <span>{machine.config.image.split('@')[0]}</span>
                </div>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="font-medium text-sm text-foreground">Created At</dt>
              <dd className="text-sm text-muted-foreground">
                {formatDistanceToNow(parseISO(machine.created_at), { addSuffix: true })}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="font-medium text-sm text-foreground">Updated At</dt>
              <dd className="text-sm text-muted-foreground">
                {formatDistanceToNow(parseISO(machine.updated_at), { addSuffix: true })}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="font-medium text-sm text-foreground">Size/CPU</dt>
              <dd className="text-sm text-muted-foreground flex items-center space-x-1">
                <CpuIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {machine.config.guest.cpu_kind}-{machine.config.guest.cpus}@
                  {machine.config.guest.memory_mb}MB
                </span>
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Machine Environment variables</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machine.config.workload.env
                ? machine.config.workload.env.map((item) => (
                    <TableRow key={item}>
                      <TableCell>{item.split('=')[0]}</TableCell>
                      <TableCell>{item.split('=')[1]}</TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Machine Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.status}</TableCell>
                  <TableCell>{event.origin}</TableCell>
                  <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}
