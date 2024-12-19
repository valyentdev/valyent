import * as React from 'react'

export default function OrDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-300"></div>
      </div>
      <div className="relative flex justify-center text-sm leading-5">
        <span className="px-2 text-zinc-500 bg-zinc-50 text-xs">OR</span>
      </div>
    </div>
  )
}
