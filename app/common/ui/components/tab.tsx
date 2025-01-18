import { Link } from '@inertiajs/react'
import * as React from 'react'
import usePath from '../hooks/use_path'
import { cn } from '../lib/cn'

interface TabProps {
  className?: string
  label: string
  href: string
  active?: boolean
}

const Tab: React.FunctionComponent<TabProps> = ({ className, href, label, active }) => {
  const path = usePath()

  let isActive: boolean = false
  if (active === undefined) {
    isActive = path === href
  } else {
    isActive = active
  }

  return (
    <Link className={cn('relative w-f', className)} href={href}>
      <div className="mx-1 my-1.5 rounded-sm px-3 py-1.5 transition-all duration-75 hover:bg-zinc-100 active:bg-zinc-200">
        <p className="text-sm text-zinc-600 font-medium hover:text-black">{label}</p>
      </div>
      {isActive && (
        <div className="absolute bottom-0 w-full px-1.5">
          <div className="h-0.5 bg-blue-950"></div>
        </div>
      )}
    </Link>
  )
}

export default Tab
