// src/components/common/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ children }) => {
  return <p className="text-red-500 text-sm mt-1">{children}</p>;
};

export default ErrorMessage;