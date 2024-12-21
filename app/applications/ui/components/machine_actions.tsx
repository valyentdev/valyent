import React from 'react'
import { IconTrash } from '@tabler/icons-react'
import { Machine, MachineStatus } from 'valyent.ts'
import { Link } from '@inertiajs/react'
import useParams from '#common/ui/hooks/use_params'
import { CirclePlayIcon, CircleStopIcon, LogsIcon } from 'lucide-react'
import { cn } from '#common/ui/lib/cn'

export type MachineActionsProps = {
  machine: Machine
  big?: boolean
}

export default function MachineActions({ machine, big }: MachineActionsProps) {
  const params = useParams()

  return (
    <div className="flex flex-wrap items-center space-x-2">
      {machine.state === MachineStatus.Stopped && (
        <button className="hover:opacity-85 transition-opacity lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-md lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10">
          <CirclePlayIcon className={cn(big ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5', ' text-blue-800')} />
        </button>
      )}
      <Link
        className="hover:opacity-85 transition-opacity lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-md lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10"
        href={`/organizations/${params.organizationSlug}/applications/${params.applicationId}/logs?machineId=${machine.id}`}
      >
        <LogsIcon className={cn(big ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5', ' text-blue-800')} />
      </Link>
      {machine.state !== MachineStatus.Stopped && (
        <button className="hover:opacity-85 transition-opacity lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-red-100/75 lg:rounded-md lg:shadow-sm shadow-red-800/10 lg:ring-1 ring-red-800/10">
          <CircleStopIcon className={cn(big ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5', ' text-red-800')} />
        </button>
      )}
      {machine.state !== MachineStatus.Destroyed && machine.state !== MachineStatus.Destroying && (
        <button className="hover:opacity-85 transition-opacity lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-red-100/75 lg:rounded-md lg:shadow-sm shadow-red-800/10 lg:ring-1 ring-red-800/10">
          <IconTrash className={cn(big ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5', ' text-red-800')} />
        </button>
      )}
    </div>
  )
}
