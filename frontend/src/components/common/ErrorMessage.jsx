import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  const errorMessage = typeof message === 'object' ? message.message : message;
  
  return (
    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      {errorMessage}
    </div>
  );
};

export default ErrorMessage; 