import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDefaulters, sendReminder } from '../../redux/features/feeSlice';
import { ExclamationIcon, MailIcon } from '@heroicons/react/outline';

const DefaulterManagementPage = () => {
  const [filters, setFilters] = useState({
    class: '',
    daysOverdue: 30,
    minAmount: '',
  });

  const dispatch = useDispatch();
  const { defaulters, loading } = useSelector((state) => state.fee);

  useEffect(() => {
    dispatch(fetchDefaulters(filters));
  }, [dispatch, filters]);

  const handleSendReminder = async (defaulterId) => {
    try {
      await dispatch(sendReminder(defaulterId)).unwrap();
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Fee Defaulters</h1>
        <button
          onClick={() => dispatch(sendReminder('all'))}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <MailIcon className="h-5 w-5 mr-2" />
          Send Mass Reminder
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Classes</option>
              {/* Add class options */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Days Overdue
            </label>
            <select
              value={filters.daysOverdue}
              onChange={(e) =>
                setFilters({ ...filters, daysOverdue: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={30}>30+ Days</option>
              <option value={60}>60+ Days</option>
              <option value={90}>90+ Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Amount
            </label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
              placeholder="Enter amount"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Defaulters List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : defaulters.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No defaulters found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Overdue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Reminder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {defaulters.map((defaulter) => (
                    <tr key={defaulter.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {defaulter.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {defaulter.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {defaulter.class}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">
                          {formatCurrency(defaulter.dueAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {defaulter.daysOverdue} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {defaulter.lastReminder
                            ? new Date(defaulter.lastReminder).toLocaleDateString()
                            : 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleSendReminder(defaulter.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Send Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaulterManagementPage; 