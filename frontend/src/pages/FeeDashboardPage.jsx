import { 
  ChartBarIcon,          // For statistics
  UserGroupIcon,         // For students
  ClipboardDocumentIcon, // For reports
  Cog6ToothIcon,         // For settings
  BuildingLibraryIcon,   // For institution
  DocumentTextIcon,      // For documents
  ArrowPathIcon         // For transactions
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const FeeDashboardPage = () => {
  const [stats] = useState({
    totalCollected: "₹1,235,000",
    pendingFees: "₹235,000",
    totalStudents: "450",
    defaulters: "45"
  });

  const StatCard = ({ title, value, Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, Icon, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left w-full"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Fee Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Overview of fee collection and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Collected"
            value={stats.totalCollected}
            Icon={ChartBarIcon}
            color="text-green-600"
          />
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            Icon={DocumentTextIcon}
            color="text-yellow-600"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            Icon={UserGroupIcon}
            color="text-blue-600"
          />
          <StatCard
            title="Defaulters"
            value={stats.defaulters}
            Icon={ClipboardDocumentIcon}
            color="text-red-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Collect Fee"
              description="Record new fee payment"
              Icon={BuildingLibraryIcon}
              onClick={() => {/* Handle click */}}
            />
            <QuickActionCard
              title="Generate Report"
              description="Create fee collection report"
              Icon={DocumentTextIcon}
              onClick={() => {/* Handle click */}}
            />
            <QuickActionCard
              title="Fee Structure"
              description="View and modify fee structure"
              Icon={Cog6ToothIcon}
              onClick={() => {/* Handle click */}}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Transactions
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <li key={item}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ArrowPathIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-indigo-600 truncate">
                          Payment #{item}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500">
                          Student Name • Class X-A
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>₹15,000</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDashboardPage; 