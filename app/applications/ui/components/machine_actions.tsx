import React from 'react'
import { IconTrash } from '@tabler/icons-react'
import { MachineRecord, MachineStatus } from 'valyent.ts'
import { Link, useForm } from '@inertiajs/react'
import useParams from '#common/ui/hooks/use_params'
import { CirclePlayIcon, CircleStopIcon, LogsIcon } from 'lucide-react'
import { cn } from '#common/ui/lib/cn'
import DeleteMachineDialog from './delete_machine_dialog'
import useSuccessToast from '#common/ui/hooks/use_success_toast'

export type MachineActionsProps = {
  machine: MachineRecord
  big?: boolean
}

export default function MachineActions({ machine: initialMachine, big }: MachineActionsProps) {
  const [machine, setMachine] = React.useState<MachineRecord>(initialMachine)

  const params = useParams()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const form = useForm()
  const successToast = useSuccessToast()
  const handleStart = () => {
    // Start machine
    form.post(
      `/organizations/${params.organizationSlug}/applications/${params.applicationId}/machines/${machine.id}/start`,
      {
        onSuccess: () => {
          successToast('Machine started successfully.')
          setMachine({ ...machine, state: MachineStatus.Starting })
        },
      }
    )
  }

  const handleStop = () => {
    // Stop machine
    form.post(
      `/organizations/${params.organizationSlug}/applications/${params.applicationId}/machines/${machine.id}/stop`,
      {
        onSuccess: () => {
          successToast('Machine stopped successfully.')
          setMachine({ ...machine, state: MachineStatus.Stopping })
        },
      }
    )
  }

  return (
    <div className="flex flex-wrap items-center space-x-2">
      <DeleteMachineDialog
        machine={machine}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />

      {(machine.state === MachineStatus.Stopped || machine.state === MachineStatus.Stopping) && (
        <button
          className="hover:opacity-85 transition-opacity p-1 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-sm lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10"
          onClick={handleStart}
        >
          <CirclePlayIcon className={cn(big ? 'h-5 w-5' : 'h-4 w-4', ' text-blue-800')} />
        </button>
      )}
      <Link
        className="hover:opacity-85 transition-opacity p-1 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-sm lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10"
        href={`/organizations/${params.organizationSlug}/applications/${params.applicationId}/logs?machineId=${machine.id}`}
      >
        <LogsIcon className={cn(big ? 'h-5 w-5' : 'h-4 w-4', ' text-blue-800')} />
      </Link>
      {machine.state !== MachineStatus.Stopped && machine.state !== MachineStatus.Stopping && (
        <button
          className="hover:opacity-85 transition-opacity p-1 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-red-100/75 lg:rounded-sm lg:shadow-sm shadow-red-800/10 lg:ring-1 ring-red-800/10"
          onClick={handleStop}
        >
          <CircleStopIcon className={cn(big ? 'h-5 w-5' : 'h-4 w-4', ' text-red-800')} />
        </button>
      )}
      {machine.state !== MachineStatus.Destroyed && machine.state !== MachineStatus.Destroying && (
        <button
          className="hover:opacity-85 transition-opacity p-1 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-red-100/75 lg:rounded-sm lg:shadow-sm shadow-red-800/10 lg:ring-1 ring-red-800/10"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <IconTrash className={cn(big ? 'h-5 w-5' : 'h-4 w-4', ' text-red-800')} />
        </button>
      )}
    </div>
  )
}
