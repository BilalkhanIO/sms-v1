import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceTrackingPage from './AttendanceTrackingPage';
import AttendanceAnalytics from '../../components/attendance/AttendanceAnalytics';
import AttendanceReportActions from '../../components/student/AttendanceReportActions';
import {
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const AttendanceManagementPage = () => {
  const [activeView, setActiveView] = useState('tracking');
  const navigate = useNavigate();

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

  const QuickAction = ({ title, description, Icon, onClick }) => (
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Attendance Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Track and manage student attendance
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('tracking')}
                className={`px-4 py-2 rounded-md ${
                  activeView === 'tracking'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                Mark Attendance
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-4 py-2 rounded-md ${
                  activeView === 'analytics'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => navigate('/attendance/reports')}
                className="px-4 py-2 rounded-md bg-white text-gray-700"
              >
                Reports
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Present Today"
            value="85%"
            Icon={UserGroupIcon}
            color="text-green-600"
          />
          <StatCard
            title="Absent Today"
            value="15%"
            Icon={ClipboardDocumentIcon}
            color="text-red-600"
          />
          <StatCard
            title="Late Arrivals"
            value="5"
            Icon={CalendarIcon}
            color="text-yellow-600"
          />
          <StatCard
            title="Average Attendance"
            value="92%"
            Icon={ChartBarIcon}
            color="text-blue-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <QuickAction
            title="Mark Attendance"
            description="Record daily attendance"
            Icon={ClipboardDocumentIcon}
            onClick={() => setActiveView('tracking')}
          />
          <QuickAction
            title="View Analytics"
            description="Analyze attendance patterns"
            Icon={ChartBarIcon}
            onClick={() => setActiveView('analytics')}
          />
          <QuickAction
            title="Generate Report"
            description="Create attendance reports"
            Icon={CalendarIcon}
            onClick={() => navigate('/attendance/reports')}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg">
          {activeView === 'tracking' && <AttendanceTrackingPage />}
          {activeView === 'analytics' && <AttendanceAnalytics />}
        </div>

        {/* Report Actions */}
        <div className="mt-6">
          <AttendanceReportActions
            reportData={null}
            reportType="attendance"
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagementPage;
