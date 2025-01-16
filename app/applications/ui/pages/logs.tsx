import React from 'react'
import { LogEntry, Machine } from 'valyent.ts'
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
import { formatDate } from 'date-fns'
import useQuery from '#common/ui/hooks/use_query'

export default function LogsPage({ machines }: { machines: Array<Machine> }) {
  const params = useParams()
  const query = useQuery()
  const [currentMachine, setCurrentMachine] = React.useState<Machine | undefined>(
    query.machineId ? machines.find((machine) => machine.id === query.machineId) : undefined
  )
  const [entries, setEntries] = React.useState<Array<LogEntry>>([])

  React.useEffect(() => {
    if (!currentMachine) {
      return
    }

    const es = new EventSource(
      `/organizations/${params.organizationSlug}/applications/${params.applicationId}/machines/${currentMachine.id}/logs`
    )

    es.onmessage = ({ data }) => {
      try {
        const logEntry = JSON.parse(data) as LogEntry
        if (!logEntry) {
          return
        }
        setEntries((entries) => [...entries, logEntry])
      } catch (error) {}
    }

    return () => {
      es.close()
    }
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
                    <span className="border lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-sm lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10">
                      <CpuIcon className="h-4 w-4 text-blue-800" />
                    </span>
                    <span className="pr-1">Select a machine</span>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {machines.length === 0 ? (
                  <SelectLabel className="font-normal italic">No machine to select</SelectLabel>
                ) : null}
                {currentMachine ? (
                  <SelectLabel>
                    <div className="flex items-center space-x-2 font-medium">
                      <span className="border lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-sm lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10">
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
        <CardContent className="!p-6">
          {currentMachine ? (
            <ul
              className="min-h-8 max-h-[30rem] flex flex-col gap-y-1 overflow-y-auto font-mono text-sm"
              id="logs-container"
            >
              {entries.map((entry, index) => (
                <li key={index}>
                  <span className="mr-4 text-emerald-600">
                    {formatDate(new Date(entry.timestamp * 1000), 'yyyy-MM-dd HH:mm:ss O')}
                  </span>
                  <Ansi>{entry.message}</Ansi>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-muted-foreground">Select a machine...</p>
          )}
        </CardContent>
      </Card>
    </ApplicationLayout>
  )
}
