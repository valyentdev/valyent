import Application from '#applications/database/models/application'
import { CardTitle } from '#common/ui/components/card'
import DashboardLayout, { DashboardLayoutProps } from '#common/ui/components/dashboard_layout'
import usePageProps from '#common/ui/hooks/use_page_props'
import useParams from '#common/ui/hooks/use_params'
import usePath from '#common/ui/hooks/use_path'
import { cn } from '#common/ui/lib/cn'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Link } from '@inertiajs/react'
import { IconRocket } from '@tabler/icons-react'
import {
  CpuIcon,
  InfoIcon,
  LogsIcon,
  NetworkIcon,
  PlaneIcon,
  Settings2Icon,
  SparkleIcon,
} from 'lucide-react'
import React from 'react'
import { Fleet } from 'valyent.ts'

export interface ApplicationLayoutProps extends DashboardLayoutProps {
  breadcrumbs: Array<{
    label: string | React.ReactNode
    href?: string
    isCurrent?: boolean
  }>
}

export default function ApplicationLayout({
  children,
  breadcrumbs,
  title,
}: ApplicationLayoutProps) {
  const { currentOrganization } = useOrganizations()
  const basePath = `/organizations/${currentOrganization?.slug}`
  const { application } = usePageProps<{ application: Application }>()
  const initialBreadcrumbs = [
    {
      href: basePath + '/applications',
      label: 'Applications',
    },
    {
      href: basePath + '/applications/' + application.id,
      label: (
        <div className="flex items-center space-x-2">
          <SparkleIcon className="h-4 w-4 text-zinc-600" />
          <span>{application.name}</span>
        </div>
      ),
    },
  ]
  const layoutBreadcrumbs = [...initialBreadcrumbs, ...breadcrumbs]

  return (
    <DashboardLayout breadcrumbs={layoutBreadcrumbs}>
      <div className="grid sm:grid-cols-4 lg:grid-cols-9 gap-x-8">
        <div className="lg:col-span-2">
          <ApplicationLayoutNav />
        </div>

        <div className="sm:col-span-3 lg:col-span-7">
          {title ? <CardTitle className="mb-4">{title}</CardTitle> : null}
          {children}
        </div>
      </div>
    </DashboardLayout>
  )
}

function ApplicationLayoutNav() {
  const params = useParams()
  const { application } = usePageProps<{ application: Application }>()
  return (
    <nav className="grid gap-2 text-sm text-muted-foreground">
      <NavItem
        href={`/organizations/${params.organizationSlug}/applications/${application.id}`}
        label="Overview"
        Icon={InfoIcon}
      />
      <NavItem
        href={`/organizations/${params.organizationSlug}/applications/${application.id}/env`}
        label="Environment Variables"
        Icon={IconRocket}
      />
      {/* <NavItem
        href={`/organizations/${params.organizationSlug}/applications/${application.id}/deployments`}
        label="Deployments"
        Icon={IconRocket}
      /> */}
      <NavItem
        href={`/organizations/${params.organizationSlug}/applications/${application.id}/machines`}
        label="Machines"
        Icon={CpuIcon}
      />
      <NavItem
        href={`/organizations/${params.organizationSlug}/applications/${application.id}/gateways`}
        label="Gateways"
        Icon={NetworkIcon}
      />
      <NavItem
        href={`/organizations/${params.organizationSlug}/applications/${application.id}/logs`}
        label="Logs"
        Icon={LogsIcon}
      />
      <NavItem
        href={`/organizations/${params.organizationSlug}/applications/${application.id}/edit`}
        label="Settings"
        Icon={Settings2Icon}
      />
    </nav>
  )
}

function NavItem({
  href,
  label,
  Icon,
}: {
  href: string
  label: string
  Icon?: React.FC<{ className?: string }>
}) {
  const path = usePath()

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-x-3 p-2 rounded-lg',
        path === href ? 'font-bold text-blue-800 bg-blue-100/50' : 'text-zinc-900'
      )}
    >
      <span className="lg:w-6 lg:h-6 flex items-center justify-center lg:bg-gradient-to-b from-white/75 to-blue-100/75 lg:rounded-md lg:shadow-sm shadow-blue-800/10 lg:ring-1 ring-blue-800/10">
        {Icon ? <Icon className="h-4 w-4 text-blue-800" /> : null}
      </span>
      <span className="group-hover:text-blue-800 transition-colors font-medium">{label}</span>
    </Link>
  )
}
