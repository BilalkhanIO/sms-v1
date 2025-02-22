import React from 'react';
import { XCircle } from 'lucide-react';

const FormError = ({ error }) => {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Form Error</h3>
          <div className="mt-2 text-sm text-red-700">
            {typeof error === 'string' ? (
              <p>{error}</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(error).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormError; 