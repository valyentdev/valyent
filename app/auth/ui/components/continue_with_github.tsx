import * as React from 'react'
import clsx from 'clsx'
import { IconBrandGithub } from '@tabler/icons-react'
import { buttonVariants } from '#common/ui/components/button'
import Spinner from '#common/ui/components/spinner'

interface ContinueWithGithubProps {}

const ContinueWithGithub: React.FunctionComponent<ContinueWithGithubProps> = () => {
  const [continuingWithGithub, setcontinuingWithGithub] = React.useState<boolean>(false)
  return (
    <>
      <a
        className={clsx(
          'w-full mb-6',
          buttonVariants({ variant: 'outline' }),
          continuingWithGithub && 'pointer-events-none opacity-50'
        )}
        href="/auth/github/redirect"
        onClick={() => setcontinuingWithGithub(true)}
      >
        {continuingWithGithub ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <IconBrandGithub className="w-5 h-5" />
        )}

        <span>Continue with GitHub</span>
      </a>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-50/80 px-2 text-muted-foreground">OR</span>
        </div>
      </div>
    </>
  )
}

export default ContinueWithGithub
