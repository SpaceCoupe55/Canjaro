import React, { useState } from 'react'

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helpText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  
  const inputClasses = `
    input-field
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim()
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  )
}

export default Input
