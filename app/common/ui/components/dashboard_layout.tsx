import * as React from 'react'
import Tab from './tab'
import useParams from '../hooks/use_params'
import Logo from './logo'
import AccountDropdown from './account_dropdown'
import { IconExclamationCircle, IconExternalLink } from '@tabler/icons-react'
import OrganizationsSelector from '#organizations/ui/components/organizations_selector'
import { Toaster } from './toaster'
import useError from '../hooks/use_error'
import { toast, useToast } from '../hooks/use_toast'
import usePath from '../hooks/use_path'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './breadcrumb'
import useOrganizations from '#organizations/ui/hooks/use_organizations'
import { Info } from 'lucide-react'
import useFlashMessage from '../hooks/use_flash_message'

type Breadcrumb = {
  label: string | React.ReactNode
  href?: string
  isCurrent?: boolean
}

export interface DashboardLayoutProps extends React.PropsWithChildren {
  actionButton?: React.ReactNode
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  breadcrumbs?: Array<Breadcrumb>
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
  const { currentOrganization } = useOrganizations()

  const initialBreadcrumbs: Breadcrumb[] = [
    {
      label: (
        <div className="flex items-center space-x-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-neutral-600">
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
  ]
  const layoutBreadcrumbs = [
    ...initialBreadcrumbs,
    ...(breadcrumbs ? breadcrumbs : ([] as Array<Breadcrumb>)),
  ]

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
      <div className="inline-flex relative w-full justify-center items-center bg-blue-50 p-2 text-sm text-blue-700 border-b border-blue-500">
        <Info className="h-4 w-4 mr-1.5" />

        <span className="font-medium">
          This is a <strong>technical preview</strong>. If you encounter bugs, please report them.
        </span>
      </div>
      <div className="-top-16 z-20 border-b border-neutral-200 bg-white">
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
                className="hidden h-8 w-8 text-neutral-200 sm:block"
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
                <span className="text-sm text-neutral-600 font-medium hover:text-black">
                  Documentation
                </span>
                <IconExternalLink className="h-4 w-4 text-neutral-600 hover:text-black" />
              </a>
              <div className="relative inline-block">
                <AccountDropdown />
              </div>
            </div>
          </div>
          <div className="scrollbar-hide relative flex gap-x-2 overflow-x-auto transition-all">
            <Tab
              href={`/organizations/${params.organizationSlug}/applications`}
              label="Applications"
            />
            <Tab href={`/organizations/${params.organizationSlug}/api_keys`} label="API Keys" />
            <Tab href={`/organizations/${params.organizationSlug}/settings`} label="Settings" />
          </div>
        </div>
      </div>
      {layoutBreadcrumbs && layoutBreadcrumbs.length > 0 && (
        <div className="border-b">
          <div className="mx-auto w-full max-w-screen-xl px-5 py-4.5 lg:px-24">
            <Breadcrumb>
              <BreadcrumbList>
                {layoutBreadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {breadcrumb.href ? (
                        <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage
                          className={
                            layoutBreadcrumbs[layoutBreadcrumbs.length - 1].label !==
                            breadcrumb.label
                              ? 'text-muted-foreground'
                              : ''
                          }
                        >
                          {breadcrumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < layoutBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}
      {(title || description) && (
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-24 flex flex-col py-8">
            <div className="pb-2 flex items-center space-x-4">
              {title && (
                <h1 className="text-2xl sm:text-3xl tracking-tight font-serif text-black">
                  {title}
                </h1>
              )}
              {actionButton}
            </div>
            {description && <h2 className="text-sm text-neutral-600 font-normal">{description}</h2>}
          </div>
        </div>
      )}
      <div className="flex w-full items-center">
        <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-24 flex flex-col gap-y-3 my-8">
          {children}
        </div>
      </div>
    </main>
  )
}

export default DashboardLayout
