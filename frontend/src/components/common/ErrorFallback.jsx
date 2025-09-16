import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ error, retry, title = "Something went wrong" }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;