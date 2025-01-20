import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#common/ui/components/dialog'
import { LogEntry } from 'valyent.ts'
import Ansi from '@curvenote/ansi-to-react'
import { formatDate } from 'date-fns'
import Deployment from '#applications/database/models/deployment'

const BuildLogsDialog = ({
  open,
  onOpenChange,
  deployment,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  deployment: Deployment
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Build Logs</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6">
          <ul className="min-h-8 flex flex-col gap-y-1 font-mono text-sm">
            {deployment.builderLogs?.map((entry, index) => (
              <li key={index}>
                <span className="mr-4 text-emerald-600">
                  {formatDate(new Date(entry.timestamp * 1000), 'yyyy-MM-dd HH:mm:ss O')}
                </span>
                <Ansi>{entry.message}</Ansi>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BuildLogsDialog
