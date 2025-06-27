import React, { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseInputClasses = `
    block w-full px-4 py-3 text-sm text-gray-900 bg-white border rounded-lg 
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    btn-touch
  `;

  const inputClasses = `
    ${baseInputClasses}
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
    }
    ${icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''}
    ${!fullWidth ? 'w-auto' : ''}
    ${className}
  `.trim();

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-2 high-contrast"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon 
              name={icon} 
              size={18} 
              className={`${error ? 'text-red-400' : 'text-gray-400'}`}
            />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;