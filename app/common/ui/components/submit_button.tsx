import * as React from 'react'
import Button, { buttonVariants } from './button'
import { VariantProps } from 'class-variance-authority'

interface SubmitButtonProps extends React.PropsWithChildren, VariantProps<typeof buttonVariants> {
  className?: string
  loading?: boolean
}

const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({
  className,
  children,
  loading,
  variant,
}) => {
  return (
    <Button className={className} loading={loading} variant={variant} type="submit">
      {children}
    </Button>
  )
}

export default SubmitButton
