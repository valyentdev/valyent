import React from 'react'
import { Fleet, LogEntry, Machine } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import { Card, CardContent, CardTitle } from '#common/ui/components/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#common/ui/components/select'
import { CpuIcon } from 'lucide-react'
import useParams from '#common/ui/hooks/use_params'
import Ansi from '@curvenote/ansi-to-react'
import { formatDate, parseISO } from 'date-fns'

export default function LogsPage({ machines }: { fleet: Fleet; machines: Array<Machine> }) {
  const [currentMachine, setCurrentMachine] = React.useState<Machine | undefined>(undefined)
  const [entries, setEntries] = React.useState<Array<LogEntry>>([])
  const params = useParams()

  async function fetchLogs(machine: Machine) {
    try {
      const response = await fetch(
        `/organizations/${params.organizationSlug}/applications/${params.applicationId}/machines/${machine.id}/logs`
      )

      const entries = (await response.json()) as Array<LogEntry>
      setEntries(entries)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (!currentMachine) {
      return
    }
    console.log('fetching...')
    fetchLogs(currentMachine)
  }, [currentMachine])

  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Settings' }]}>
      <div className="flex space-x-4 items-center">
        <CardTitle>Logs</CardTitle>
        <div>
          <Select
            value={currentMachine?.id.toString()}
            onValueChange={(id) => setCurrentMachine(machines.find((machine) => machine.id === id))}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue
                placeholder={
                  <div className="flex items-center space-x-2 font-medium">
                    <span className="border lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-md lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10">
                      <CpuIcon className="h-4 w-4 text-blue-800" />
                    </span>
                    <span className="pr-1">Select a machine</span>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currentMachine ? (
                  <SelectLabel>
                    <div className="flex items-center space-x-2 font-medium">
                      <span className="border lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-md lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10">
                        <CpuIcon className="h-4 w-4 text-blue-800" />
                      </span>
                      <span>Select a machine</span>
                    </div>
                  </SelectLabel>
                ) : null}
                {machines.map((machine) => (
                  <SelectItem className="cursor-pointer" key={machine.id} value={machine.id}>
                    <p>
                      <span className="font-medium">{machine.region}</span>{' '}
                      <span>({machine.id})</span>
                    </p>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="mt-4">
        <CardContent className="!px-4 !py-2">
          <ul className="min-h-8 max-h-96 overflow-y-auto font-mono text-sm" id="logs-container">
            {entries.map((entry, index) => (
              <li key={index}>
                <span className="mr-4 text-emerald-600">
                  {formatDate(new Date(entry.timestamp * 1000), 'yyyy-MM-dd HH:mm:ss O')}
                </span>
                <Ansi>{entry.message}</Ansi>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}
