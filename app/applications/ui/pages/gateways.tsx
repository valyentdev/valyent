import React from 'react'
import { Fleet } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '#common/ui/components/card'
import { IconExternalLink } from '@tabler/icons-react'

export default function GatewaysPage({ fleet }: { fleet: Fleet }) {
  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Gateways' }]}>
      <Card className="sm:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle>Gateways</CardTitle>
          <CardDescription className="flex flex-wrap">
            <p className="mr-1">View and manage the entrypoints of your machines.</p>
            <a
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              href="https://docs.valyent.cloud/notions/gateway"
              target="_blank"
            >
              <span>Learn more about Valyent Gateways.</span>
              <IconExternalLink className="h-4 w-4" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </ApplicationLayout>
  )
}
