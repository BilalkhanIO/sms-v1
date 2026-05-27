import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, backUrl, action, children }) => {
  const rightContent = action ?? children;
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        {backUrl && (
          <Link to={backUrl} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      {rightContent && (
        <div className="flex items-center gap-3">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 