import * as React from 'react'
import Tab from './tab'
import useParams from '../hooks/use_params'
import Logo from './logo'
import AccountDropdown from './account_dropdown'
import { IconExclamationCircle, IconExternalLink } from '@tabler/icons-react'
import OrganizationsSelector from '#organizations/ui/components/organizations_selector'
import { Toaster } from './toaster'
import useError from '../hooks/use_error'
import { useToast } from '../hooks/use_toast'
import usePath from '../hooks/use_path'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './breadcrumb'

export interface DashboardLayoutProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode
  title?: string | React.ReactNode
  description?: string
  breadcrumbs?: Array<{
    label: string | React.ReactNode
    href?: string
    isCurrent?: boolean
  }>
}

const DashboardLayout: React.FunctionComponent<DashboardLayoutProps> = ({
  actionButton,
  children,
  title,
  description,
  breadcrumbs,
}) => {
  const params = useParams()
  const [loaded, setLoaded] = React.useState(false)
  const error = useError('global')
  const { toast: errorToast } = useToast()
  const path = usePath()

  React.useEffect(() => {
    setLoaded(true)
  }, [])

  React.useEffect(() => {
    if (error) {
      errorToast({
        title: (
          <div className="flex items-start space-x-2">
            <IconExclamationCircle className="h-5 w-5 text-red-600" />
            <p>{error}</p>
          </div>
        ),
      })
    }
  }, [error])

  return (
    <main className="min-h-screen w-full">
      {loaded && <Toaster />}
      <div className="-top-16 z-20 border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
          <div className="flex h-16 items-center justify-between mx-4">
            <div className="flex items-center">
              <a className="hidden transition-all sm:block" href="/organizations">
                <div className="max-w-fit">
                  <Logo className="w-10" width={64} height={64} />
                </div>
              </a>
              <svg
                fill="none"
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                className="hidden h-8 w-8 text-zinc-200 sm:block"
              >
                <path d="M16.88 3.549L7.12 20.451"></path>
              </svg>
              <OrganizationsSelector />
            </div>
            <div className="flex items-center space-x-6">
              <a
                className="flex items-center space-x-1 transition-all duration-75 active:scale-95"
                href="https://docs.valyent.cloud"
              >
                <span className="text-sm text-zinc-600 font-medium hover:text-black">
                  Documentation
                </span>
                <IconExternalLink className="h-4 w-4 text-zinc-600 hover:text-black" />
              </a>
              <div className="relative inline-block">
                <AccountDropdown />
              </div>
            </div>
          </div>
          <div className="scrollbar-hide relative flex gap-x-2 overflow-x-auto transition-all">
            <Tab
              href={`/organizations/${params.organizationSlug}/applications/overview`}
              label="Applications"
              active={
                path.startsWith(`/organizations/${params.organizationSlug}/applications`) ||
                `/organizations/${params.organizationSlug}/api_keys` === path
              }
            />
            <Tab
              href={`/organizations/${params.organizationSlug}/ai/overview`}
              active={path.startsWith(`/organizations/${params.organizationSlug}/ai`)}
              label="AI"
            />
            <Tab
              href={`/organizations/${params.organizationSlug}/settings`}
              active={
                path.startsWith(`/organizations/${params.organizationSlug}/settings`) ||
                path.endsWith('billing')
              }
              label="Settings"
            />
          </div>
        </div>
      </div>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="border-b">
          <div className="mx-auto w-full max-w-screen-xl px-5 py-4.5 lg:px-24">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {breadcrumb.href ? (
                        <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage
                          className={
                            breadcrumbs[breadcrumbs.length - 1].label !== breadcrumb.label
                              ? 'text-muted-foreground'
                              : ''
                          }
                        >
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}
      {(title || description) && (
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-24 flex flex-col-reverse py-8">
            <div className="pb-2 flex items-center space-x-4">
              {title && (
                <h1 className="text-2xl sm:text-3xl tracking-tight font-serif text-black">
                  {title}
                </h1>
              )}
              {actionButton}
            </div>
            {description && <h2 className="text-sm text-zinc-600 font-normal">{description}</h2>}
          </div>
        </div>
      )}
      <div className="flex w-full items-center">
        <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-24 flex flex-col gap-y-3">
          {children}
        </div>
      </div>
    </main>
  )
}

export default DashboardLayout
