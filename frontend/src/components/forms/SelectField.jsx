// src/components/forms/SelectField.jsx
import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { AlertCircle } from 'lucide-react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

const SelectField = ({
  label,
  name,
  options,
  isMulti = false,
  isAsync = false,
  loadOptions,
  placeholder,
  className = '',
  required = false,
  disabled = false,
  description,
  isClearable = true,
  defaultValue,
  ...props
}) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3B82F6' : '#9CA3AF',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#3B82F6'
        : state.isFocused
        ? '#E5E7EB'
        : 'white',
      color: state.isSelected ? 'white' : '#111827',
      '&:active': {
        backgroundColor: '#2563EB',
      },
    }),
  };

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
          {({ field, form }) => {
            const handleChange = (option) => {
              form.setFieldValue(
                name,
                isMulti
                  ? option
                    ? option.map((item) => item.value)
                    : []
                  : option
                  ? option.value
                  : ''
              );
            };

            const handleBlur = () => {
              form.setFieldTouched(name, true);
            };

            const SelectComponent = isAsync ? AsyncSelect : Select;
            const selectProps = {
              inputId: name,
              name: name,
              isMulti,
              isClearable,
              isDisabled: disabled,
              placeholder,
              className: `react-select ${className}`,
              classNamePrefix: "react-select",
              styles: customStyles,
              onChange: handleChange,
              onBlur: handleBlur,
              defaultValue,
              ...props,
            };

            if (isAsync) {
              selectProps.loadOptions = loadOptions;
              selectProps.cacheOptions = true;
              selectProps.defaultOptions = true;
            } else {
              selectProps.options = options;
            }

            return <SelectComponent {...selectProps} />;
          }}
        </Field>

        <ErrorMessage name={name}>
          {(error) => (
            <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
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

export default SelectField;
