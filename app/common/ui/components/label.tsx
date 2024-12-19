import clsx from 'clsx'
import * as React from 'react'

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  className?: string
  htmlFor?: string
}

export const Label: React.FunctionComponent<React.PropsWithChildren<LabelProps>> = ({
  children,
  className,
  htmlFor,
}) => {
  return (
    <label className={clsx('text-sm font-medium leading-none', className)} htmlFor={htmlFor}>
      {children}
    </label>
  )
}

export default Label
