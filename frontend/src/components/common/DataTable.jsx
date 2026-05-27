import React from 'react';
import Spinner from './Spinner';

/**
 * Reusable data table with empty state, loading, and error states.
 *
 * columns: [{ key, header, render?, className? }]
 * data: array of row objects
 * keyField: string — unique key from row (default '_id')
 */
const DataTable = ({
  columns,
  data = [],
  keyField = '_id',
  isLoading = false,
  error = null,
  emptyMessage = 'No records found.',
  emptyIcon = null,
  className = '',
}) => {
  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        {error?.data?.message || error?.message || 'Failed to load data.'}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        {emptyIcon && <div className="mb-3">{emptyIcon}</div>}
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row[keyField]} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${col.className || 'text-gray-700'}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
