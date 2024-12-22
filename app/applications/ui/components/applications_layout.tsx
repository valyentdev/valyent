import DashboardLayout, { DashboardLayoutProps } from '#common/ui/components/dashboard_layout'
import useParams from '#common/ui/hooks/use_params'
import usePath from '#common/ui/hooks/use_path'
import { cn } from '#common/ui/lib/cn'
import { Link } from '@inertiajs/react'
import React from 'react'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { BreadcrumbsProps } from '#common/ui/components/breadcrumb'

export interface ApplicationsLayoutProps extends DashboardLayoutProps {
  breadcrumbs: BreadcrumbsProps
}

export default function ApplicationsLayout({ breadcrumbs, children }: ApplicationsLayoutProps) {
  const { currentOrganization } = useOrganizations()
  const basePath = `/organizations/${currentOrganization?.slug}`

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
      label: 'Applications',
      href: basePath + '/applications',
    },
  ]
  const layoutBreadcrumbs = [...initialBreadcrumbs, ...breadcrumbs]

  return (
    <DashboardLayout breadcrumbs={layoutBreadcrumbs} title="Applications">
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
          path === `/organizations/${params.organizationSlug}/applications/api_keys` &&
            'font-semibold text-primary'
        )}
        href={`/organizations/${params.organizationSlug}/applications/api_keys`}
      >
        API Keys
      </Link>
    </nav>
  )
}
