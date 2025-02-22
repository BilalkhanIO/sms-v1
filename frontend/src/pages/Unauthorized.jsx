import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
        <p className="text-gray-700 mt-4">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
