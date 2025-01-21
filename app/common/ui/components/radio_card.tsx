import React from 'react'

const RadioCard = ({ children, checked, onChange, value, name, disabled = false }) => (
  <label className="inline-flex items-center">
    <input
      type="radio"
      className="peer sr-only"
      checked={checked}
      onChange={onChange}
      value={value}
      name={name}
      disabled={disabled}
    />
    <span
      className="divide-y peer-focus:divide-blue-100 peer-checked:divide-blue-100 text-sm border rounded border-neutral-200 bg-white hover:border-neutral-300 
        peer-focus:ring-2 peer-focus:ring-blue-100 w-44
        children:py-3 children:px-3 children:-mx-4 children:border-neutral-100
        first:children:-mt-2 last:children:-mb-2 cursor-pointer
        peer-checked:border-blue-400 peer-checked:hover:border-blue-500 
        peer-checked:children:border-blue-200
        peer-checked:text-blue-900 peer-checked:[&>*_.text-neutral-600]:text-blue-600
        peer-disabled:cursor-not-allowed
        peer-disabled:bg-neutral-50 peer-disabled:peer-checked:bg-blue-50
        peer-checked:peer-disabled:hover:border-blue-400 peer-disabled:hover:border-neutral-200
        peer-disabled:[&>*_.text-neutral-600]:text-neutral-400 
        peer-disabled:text-neutral-400 
        peer-disabled:peer-checked:text-blue-300 
        peer-disabled:peer-checked:[&>*_.text-neutral-600]:text-blue-300"
    >
      {children}
    </span>
  </label>
)

export default RadioCard
