import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#common/ui/components/card'
import DashboardLayout from '#common/ui/components/dashboard_layout'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Button } from '#common/ui/components/button'
import { Input } from '#common/ui/components/input'
import { Label } from '#common/ui/components/label'
import { useForm } from '@inertiajs/react'
import React from 'react'
import { Cpu, MemoryStick } from 'lucide-react'
import CreateApplicationForm from '../components/create_application_form'

export default function () {
  const { currentOrganization } = useOrganizations()

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Applications', href: `/organizations/${currentOrganization?.slug}/applications` },
        { label: 'Create' },
      ]}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <CreateApplicationForm />
      </div>
    </DashboardLayout>
  )
}
