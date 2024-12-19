import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import Spinner from './spinner'
import { cn } from '../lib/cn'

export const buttonVariants = cva('', {
  variants: {
    variant: {
      default: 'btn-primary',
      purple: 'btn-purple',
      emerald: 'btn-emerald',
      destructive: 'btn-red',
      outline: 'btn-secondary',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  className?: string
  icon?: React.ReactNode
}

export const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = ({
  children,
  disabled,
  loading,
  variant,
  className,
  icon,
  ...props
}) => {
  return (
    <button
      disabled={loading || disabled}
      {...props}
      className={cn(buttonVariants({ variant }), className)}
    >
      {loading ? <Spinner className="h-4 w-4 animate-spin" /> : icon}
      <div>{children}</div>
    </button>
  )
}

export default Button
