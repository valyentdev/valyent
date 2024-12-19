import * as React from 'react'
import useError from '../hooks/use_error'
import { Input } from './input'
import { cn } from '../lib/cn'

interface InputFieldProps {
  className?: string
  divClassName?: string
  label?: string | React.ReactNode
  children?: string | React.ReactNode
  labelRight?: React.ReactNode
  id?: string
  type?: string
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  readOnly?: boolean
  minLength?: number
}

const InputField: React.FC<InputFieldProps> = ({
  children,
  divClassName,
  label,
  labelRight,
  id,
  type,
  placeholder,
  required,
  value,
  onChange,
  readOnly,
  minLength,
}) => {
  const error = useError(id)
  return (
    <div className={divClassName}>
      <div className="flex items-center space-x-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium leading-6 text-zinc-900">
            <span className="mr-2">{label}</span>
            {labelRight}
          </label>
        )}
      </div>
      <div className={cn(label ? 'pt-1 flex w-full' : '')}>
        <Input
          readOnly={readOnly}
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          minLength={minLength}
        />

        {children}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}

export default InputField
