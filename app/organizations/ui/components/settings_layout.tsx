import DashboardLayout from '#common/ui/components/dashboard_layout'
import useParams from '#common/ui/hooks/use_params'
import usePath from '#common/ui/hooks/use_path'
import { cn } from '#common/ui/lib/cn'
import { Link } from '@inertiajs/react'
import * as React from 'react'
import useOrganizations from '../hooks/use_organizations'
import { BreadcrumbsProps } from '#common/ui/components/breadcrumb'

interface SettingsLayoutProps extends React.PropsWithChildren {
  breadcrumbs: BreadcrumbsProps
}

const SettingsLayout: React.FunctionComponent<SettingsLayoutProps> = ({
  breadcrumbs,
  children,
}) => {
  const { currentOrganization } = useOrganizations()

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
      label: 'Settings',
    },
  ]
  const layoutBreadcrumbs = [...initialBreadcrumbs, ...breadcrumbs]

  return (
    <DashboardLayout breadcrumbs={layoutBreadcrumbs} title="Settings">
      <div className="grid gap-5 sm:grid-cols-4 lg:grid-cols-5 my-8">
        <div>
          <SettingsNav />
        </div>
        <div className="sm:col-span-3 lg:col-span-4">{children}</div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsLayout

function SettingsNav() {
  const params = useParams()
  const path = usePath()
  return (
    <nav className="grid gap-5 text-sm text-muted-foreground">
      <Link
        href={`/organizations/${params.organizationSlug}/settings`}
        className={cn(
          path === `/organizations/${params.organizationSlug}/settings` &&
            'font-semibold text-primary'
        )}
      >
        Organization Settings
      </Link>
      <Link
        className={cn(
          path === `/organizations/${params.organizationSlug}/settings/account` &&
            'font-semibold text-primary'
        )}
        href={`/organizations/${params.organizationSlug}/settings/account`}
      >
        Account Settings
      </Link>
      <Link
        href={`/organizations/${params.organizationSlug}/billing`}
        className={cn(
          path === `/organizations/${params.organizationSlug}/billing` &&
            'font-semibold text-primary'
        )}
      >
        Billing
      </Link>
    </nav>
  )
}
