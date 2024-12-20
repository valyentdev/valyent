import { Machine } from 'valyent.ts'
import ApplicationLayout from '../components/application_layout'
import React from 'react'

export default function MachinesPage({ machine }: { machine: Machine }) {
  return (
    <ApplicationLayout breadcrumbs={[{ label: machine.id }]}>
      <div className="sm:col-span-3 lg:col-span-4"></div>
    </ApplicationLayout>
  )
}
