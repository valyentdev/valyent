import * as React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

const cardVariants = cva('rounded-md border bg-card text-card-foreground border-zinc-600/20', {
  variants: {
    variant: {
      danger: 'border-red-600/20',
    },
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col p-6 border-b border-zinc-600/20', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-medium font-serif leading-none tracking-tight text-2xl', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

const cardContentVariants = cva('p-6', {
  variants: {
    variant: {
      danger: 'bg-red-500/10 rounded-b-md',
    },
  },
})
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardContentVariants({ variant, className }))} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const cardFooterVariants = cva(
  'flex items-center p-6 border-t border-zinc-600/20 rounded-b-md bg-accent',
  {
    variants: {
      variant: {
        destructive: 'bg-red-500/10',
      },
    },
  }
)

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardFooterVariants({ className, variant }))} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
