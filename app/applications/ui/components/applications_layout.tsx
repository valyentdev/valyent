import Button from '#common/ui/components/button'
import DashboardLayout, { DashboardLayoutProps } from '#common/ui/components/dashboard_layout'
import useParams from '#common/ui/hooks/use_params'
import usePath from '#common/ui/hooks/use_path'
import { cn } from '#common/ui/lib/cn'
import { Link } from '@inertiajs/react'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'

export interface ApplicationsLayoutProps extends DashboardLayoutProps {}

export default function ApplicationsLayout({ children }: ApplicationsLayoutProps) {
  return (
    <DashboardLayout
      title="Applications"
      actionButton={
        <Button icon={<PlusCircleIcon className="h-4 w-4" />}>Create Application</Button>
      }
    >
      <div className="grid sm:grid-cols-4 lg:grid-cols-5 my-8">
        <div>
          <ApplicationsLayoutNav />
        </div>
        <div className="sm:col-span-3 lg:col-span-4">{children}</div>
      </div>
    </DashboardLayout>
  )
}

function ApplicationsLayoutNav() {
  const params = useParams()
  const path = usePath()
  return (
    <nav className="grid gap-5 text-sm text-muted-foreground">
      <Link
        href={`/organizations/${params.organizationSlug}/applications/overview`}
        className={cn(
          path === `/organizations/${params.organizationSlug}/applications/overview` &&
            'font-semibold text-primary'
        )}
      >
        Overview
      </Link>
      <Link
        className={cn(
          path === `/organizations/${params.organizationSlug}/applications` &&
            'font-semibold text-primary'
        )}
        href={`/organizations/${params.organizationSlug}/applications`}
      >
        Applications
      </Link>
      <Link
        className={cn(
          path === `/organizations/${params.organizationSlug}/api_keys` &&
            'font-semibold text-primary'
        )}
        href={`/organizations/${params.organizationSlug}/api_keys`}
      >
        API Keys
      </Link>
    </nav>
  )
}
