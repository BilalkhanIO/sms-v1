import React from 'react';

const FormSection = ({
  title,
  description,
  children,
  columns = 1,
  className = '',
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`bg-white shadow-sm rounded-lg ${className}`}>
      {/* Section Header */}
      {(title || description) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          {title && (
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Section Content */}
      <div className="px-4 py-5 sm:p-6">
        <div className={`grid ${gridClasses[columns]} gap-6`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormSection; 