import React from 'react'
import { Fleet } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import { Card, CardContent, CardHeader, CardTitle } from '#common/ui/components/card'

export default function LogsPage({ fleet }: { fleet: Fleet }) {
  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Settings' }]}>
      <Card className="sm:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </ApplicationLayout>
  )
}
