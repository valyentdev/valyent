import DashboardLayout from '#common/ui/components/dashboard_layout'
import useParams from '#common/ui/hooks/use_params'
import usePath from '#common/ui/hooks/use_path'
import { cn } from '#common/ui/lib/cn'
import { Link } from '@inertiajs/react'
import * as React from 'react'
import { BreadcrumbsProps } from '#common/ui/components/breadcrumb'

interface SettingsLayoutProps extends React.PropsWithChildren {
  breadcrumbs: BreadcrumbsProps
}

const SettingsLayout: React.FunctionComponent<SettingsLayoutProps> = ({
  breadcrumbs,
  children,
}) => {
  const initialBreadcrumbs = [{ label: 'Settings' }]
  const layoutBreadcrumbs = [...initialBreadcrumbs, ...breadcrumbs]

  return (
    <DashboardLayout breadcrumbs={layoutBreadcrumbs} title="Settings">
      <div className="grid gap-5 sm:grid-cols-4 lg:grid-cols-5">
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
