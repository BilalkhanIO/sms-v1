import React from 'react';
import { useFormikContext } from 'formik';
import { XCircle } from 'lucide-react';

const FormLayout = ({
  title,
  description,
  children,
  columns = 1,
  spacing = 'normal',
  showErrorSummary = true,
}) => {
  const { errors, touched, isSubmitting } = useFormikContext();

  // Get all field-level errors that have been touched
  const touchedErrors = Object.keys(errors)
    .filter(key => touched[key])
    .map(key => errors[key]);

  const spacingClasses = {
    compact: 'space-y-3',
    normal: 'space-y-6',
    loose: 'space-y-8',
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={spacingClasses[spacing]}>
      {/* Form Header */}
      {(title || description) && (
        <div className="border-b border-gray-200 pb-4">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Error Summary */}
      {showErrorSummary && touchedErrors.length > 0 && !isSubmitting && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                There {touchedErrors.length === 1 ? 'is' : 'are'} {touchedErrors.length} error{touchedErrors.length === 1 ? '' : 's'} in your submission
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {touchedErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className={`grid ${gridClasses[columns]} gap-6`}>
        {children}
      </div>
    </div>
  );
};

export default FormLayout; 