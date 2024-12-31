import * as React from 'react'
import getInitials from '../lib/initials'

interface AvatarProps {
  text: string
}

const Avatar: React.FunctionComponent<AvatarProps> = ({ text }) => {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-zinc-800 to-zinc-600 text-zinc-200 shadow-sm">
      <span className="font-medium">{getInitials(text)}</span>
    </div>
  )
}

export default Avatar
