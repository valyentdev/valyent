import React from 'react'
import ApplicationLayout from '../components/application_layout'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '#common/ui/components/card'
import { IconExternalLink } from '@tabler/icons-react'

export default function MachinesPage() {
  return (
    <ApplicationLayout breadcrumbs={[{ label: 'Machines' }]}>
      <Card className="sm:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle>Machines</CardTitle>
          <CardDescription className="flex flex-wrap">
            <p className="mr-1">View and manage the virtual machines orchestrated by Ravel.</p>
            <a
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              href="https://docs.valyent.cloud/notions/machine"
              target="_blank"
            >
              <span>Learn more about Valyent Machines.</span>
              <IconExternalLink className="h-4 w-4" />
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </ApplicationLayout>
  )
}
