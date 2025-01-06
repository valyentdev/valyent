import * as React from 'react'
import { Head } from '@inertiajs/react'
import Logo from '#common/ui/components/logo'
import { Card, CardContent, CardFooter } from '#common/ui/components/card'

interface AuthLayoutProps extends React.PropsWithChildren {
  title: string
  action?: string | React.ReactNode
}

const AuthLayout: React.FunctionComponent<AuthLayoutProps> = ({ title, action, children }) => {
  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-1 space-y-6 flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <a href="https://www.valyent.cloud" className="flex items-center space-x-4">
            <Logo className="h-12 w-12" width={48} height={48} />
          </a>
        </div>

        <Card>
          <CardContent>
            <header>
              <div className="flex justify-center w-full hover:opacity-85 transition-opacity"></div>
              <h2 className="mt-2 text-center text-3xl italic leading-9 tracking-tight text-neutral-800 font-instrument">
                {title}
              </h2>
            </header>
          </CardContent>
          <CardFooter className="block py-6">{children}</CardFooter>
        </Card>
        {action ? (
          <p className="text-sm text-center font-medium text-neutral-500">{action}</p>
        ) : null}
      </div>
    </>
  )
}

export default AuthLayout
