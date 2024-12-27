import Application from '#applications/database/models/application'
import { CardTitle } from '#common/ui/components/card'
import DashboardLayout, { DashboardLayoutProps } from '#common/ui/components/dashboard_layout'
import usePageProps from '#common/ui/hooks/use_page_props'
import useParams from '#common/ui/hooks/use_params'
import usePath from '#common/ui/hooks/use_path'
import { cn } from '#common/ui/lib/cn'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Link } from '@inertiajs/react'
import { CpuIcon, InfoIcon, LogsIcon, NetworkIcon, Settings2Icon, SparkleIcon } from 'lucide-react'
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
      label: (
        <div className="flex items-center space-x-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-zinc-600">
            <g bufferred-rendering="static">
              <path
                d="M10.032 6.499A3.525 3.525 0 006.532 10a3.525 3.525 0 003.5 3.501A3.526 3.526 0 0013.533 10a3.526 3.526 0 00-3.501-3.501z"
                fillOpacity="1"
              ></path>
              <path
                d="M8.582 15.386a2.537 2.537 0 00-1.11 2.084 2.547 2.547 0 002.53 2.53 2.546 2.546 0 002.527-2.53 2.532 2.532 0 00-1.091-2.072c-.45.119-.921.184-1.407.185-.5-.001-.987-.07-1.449-.197zm8.89-7.916a2.538 2.538 0 00-2.057 1.069c.129.466.198.956.199 1.461a5.51 5.51 0 01-.199 1.461 2.538 2.538 0 002.057 1.069A2.546 2.546 0 0020.001 10a2.546 2.546 0 00-2.529-2.53zm-14.943 0A2.547 2.547 0 00-.001 10a2.547 2.547 0 002.53 2.53 2.541 2.541 0 002.103-1.136A5.532 5.532 0 014.451 10c.001-.481.064-.948.181-1.394A2.541 2.541 0 002.529 7.47zM10.002 0a2.547 2.547 0 00-2.53 2.53A2.538 2.538 0 008.58 4.614c.463-.127.95-.196 1.451-.197.486.001.958.066 1.408.185a2.536 2.536 0 001.09-2.072A2.546 2.546 0 0010.002 0z"
                fillOpacity=".45"
              ></path>
            </g>
          </svg>{' '}
          <span>{currentOrganization?.name}</span>
        </div>
      ),
    },
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
      <div className="grid sm:grid-cols-4 lg:grid-cols-5 gap-x-8 my-8">
        <div>
          <ApplicationLayoutNav />
        </div>

        <div className="sm:col-span-3 lg:col-span-4">
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
