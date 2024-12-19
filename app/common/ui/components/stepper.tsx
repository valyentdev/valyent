import * as React from 'react'

interface StepperProps extends React.PropsWithChildren {}

export default function Stepper({ children }: StepperProps) {
  return (
    <div className="rounded-lg relative sm:col-span-3 lg:col-span-4">
      <div className="z-10 absolute top-0 h-full w-[1px] from-zinc-600/10 via-zinc-600/90 to-zinc-600/10 bg-gradient-to-b"></div>
      <div>{children}</div>
    </div>
  )
}
