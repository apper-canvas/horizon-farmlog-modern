import React, { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({
  label,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  options = [],
  fullWidth = true,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseSelectClasses = `
    block w-full px-4 py-3 text-sm text-gray-900 bg-white border rounded-lg 
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    btn-touch appearance-none cursor-pointer
  `;

  const selectClasses = `
    ${baseSelectClasses}
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
    }
    ${!fullWidth ? 'w-auto' : ''}
    ${className}
  `.trim();

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-auto'}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 mb-2 high-contrast"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="ChevronDown" 
            size={18} 
            className={`${error ? 'text-red-400' : 'text-gray-400'}`}
          />
        </div>
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

Select.displayName = 'Select';

export default Select;