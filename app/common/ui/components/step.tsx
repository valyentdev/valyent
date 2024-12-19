import * as React from 'react'

export interface StepProps extends React.PropsWithChildren {
  title: string
  description: string
}

export default function Step({ children, title, description }: StepProps) {
  return (
    <div className="relative pl-6 transition duration-200 ease-in-out mb-6">
      <div className="absolute -left-[9.5px] top-7 z-10 block h-5 w-5 rounded-full">
        <div className="ml-1 mt-1 h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out border-white bg-primary"></div>
      </div>
      <div className="rounded-xl bg-gradient-to-r via-root to-root p-0.5 transition duration-200 ease-in-out">
        <div className="rounded-[10px] bg-root">
          <div className="rounded-[10px] bg-gradient-to-r via-green-1 to-green-1 p-6">
            <h3 className="mb-1 text-xl tracking-[-0.16px] text-zinc-900 font-bold">{title}</h3>
            <p className="mb-6 text-sm text-zinc-600 font-normal">{description}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
