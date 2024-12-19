import * as React from 'react'
import logo from '../assets/logo.svg'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

const Logo: React.FunctionComponent<LogoProps> = ({ className, width, height }) => (
  <img className={className} src={logo} alt="Logo" width={width} height={height} />
)

export default Logo
