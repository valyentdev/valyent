import clsx from 'clsx'
import * as React from 'react'

interface SpinnerProps {
  className?: string
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({ className }) => {
  return (
    <svg
      className={clsx('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default Spinner
