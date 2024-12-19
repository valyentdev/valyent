import * as React from 'react'
import Spinner from './spinner'

export interface LinkWithSpinnerProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode
  label: string
}

export default function LinkWithSpinner({ icon, label, ...props }: LinkWithSpinnerProps) {
  /**
   * Create a redirecting state, in order to show a spinner when the user clicks on the link.
   */
  const [redirecting, setRedirecting] = React.useState(false)

  return (
    <a onClick={() => setRedirecting(true)} {...props}>
      {redirecting ? <Spinner className="h-4 w-4 animate-spin" /> : icon}
      <span>{label}</span>
    </a>
  )
}
