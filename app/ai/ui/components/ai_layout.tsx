import { BreadcrumbsProps } from '#common/ui/components/breadcrumb'
import DashboardLayout from '#common/ui/components/dashboard_layout'
import useParams from '#common/ui/hooks/use_params'
import usePath from '#common/ui/hooks/use_path'
import { cn } from '#common/ui/lib/cn'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Link } from '@inertiajs/react'
import React from 'react'

export interface AILayoutProps extends React.PropsWithChildren {
  title: string
  description: string | React.ReactNode
  breadcrumbs: BreadcrumbsProps
}

export default function AILayout({ children, breadcrumbs, description, title }: AILayoutProps) {
  const { currentOrganization } = useOrganizations()
  const basePath = `/organizations/${currentOrganization?.slug}`
  const initialBreadcrumbs = [
    {
      label: 'AI',
      href: basePath + '/ai',
    },
  ]
  const layoutBreadcrumbs = [...initialBreadcrumbs, ...breadcrumbs]

  return (
    <DashboardLayout title={title} description={description} breadcrumbs={layoutBreadcrumbs}>
      {children}
    </DashboardLayout>
  )
}
