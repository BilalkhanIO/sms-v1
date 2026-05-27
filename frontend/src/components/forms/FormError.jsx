import React from 'react';

const FormError = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mt-2 text-sm text-red-600">
      {error}
    </div>
  );
};

export default FormError;
