import * as React from 'react'
import { Head, Link } from '@inertiajs/react'
import Logo from '#common/ui/components/logo'

interface AuthLayoutProps extends React.PropsWithChildren {
  title: string
  description?: string | React.ReactNode
}

const AuthLayout: React.FunctionComponent<AuthLayoutProps> = ({ title, description, children }) => {
  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-1 flex-col justify-center">
        <div className="space-y-6 rounded-lg sm:mx-auto sm:w-full sm:max-w-sm px-6 py-12 lg:px-8">
          <header>
            <div className="flex justify-center w-full hover:opacity-85 transition-opacity">
              <a href="https://www.valyent.cloud">
                <Logo className="h-16 w-16" width={80} height={80} />
              </a>
            </div>
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-neutral-900">
              {title}
            </h2>
            {description ? (
              <h3 className="text-sm text-center font-medium text-neutral-500">{description}</h3>
            ) : null}
          </header>
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}

export default AuthLayout
