import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({
  type = 'input',
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  placeholder,
  options = [],
  icon,
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, name);
    }
  };

  const fieldProps = {
    label,
    name,
    value,
    onChange: handleChange,
    onBlur,
    error,
    required,
    disabled,
    placeholder,
    icon,
    ...props
  };

  switch (type) {
    case 'select':
      return <Select {...fieldProps} options={options} />;
    case 'textarea':
      return (
        <div className="w-full">
          {label && (
            <label 
              htmlFor={name} 
              className="block text-sm font-medium text-gray-700 mb-2 high-contrast"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={4}
            className={`
              block w-full px-4 py-3 text-sm text-gray-900 bg-white border rounded-lg 
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              btn-touch resize-vertical
              ${error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }
            `}
            {...props}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      );
    default:
      return <Input {...fieldProps} />;
  }
};

export default FormField;