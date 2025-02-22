// src/components/forms/InputField.jsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { AlertCircle } from 'lucide-react';

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  className = '',
  required = false,
  disabled = false,
  description,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Field name={name}>
          {({ field, meta }) => (
            <input
              {...field}
              type={type}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              aria-describedby={`${name}-error ${name}-description`}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm
                ${meta.touched && meta.error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
                }
                focus:outline-none focus:ring-2
                disabled:bg-gray-100 disabled:text-gray-500
                ${className}
              `}
              {...props}
            />
          )}
        </Field>
        
        <ErrorMessage name={name}>
          {(error) => (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </ErrorMessage>
      </div>

      <ErrorMessage name={name}>
        {(error) => (
          <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
            {error}
          </p>
        )}
      </ErrorMessage>

      {description && (
        <p
          className="mt-1 text-sm text-gray-500"
          id={`${name}-description`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default InputField;
