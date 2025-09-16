import React from 'react';
import { useGetUsersQuery } from '../../api/usersApi';
import { useGetSchoolStatsQuery } from '../../api/dashboardApi';
import LoadingSpinner from '../LoadingSpinner';
import {
  Users,
  School,
  GraduationCap,
  UserCheck,
  AlertTriangle,
  Activity
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Activity className="w-5 h-5 mr-2" />
      Recent Activity
    </h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3 border-b border-gray-100 pb-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {activity.icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-gray-500">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AlertsList = ({ alerts }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <AlertTriangle className="w-5 h-5 mr-2" />
      System Alerts
    </h3>
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div key={index} className={`p-3 rounded-md ${alert.type === 'warning' ? 'bg-yellow-50' : 'bg-red-50'}`}>
          <div className="flex items-start">
            <AlertTriangle className={`w-5 h-5 ${alert.type === 'warning' ? 'text-yellow-400' : 'text-red-400'} mt-0.5`} />
            <div className="ml-3">
              <h4 className="text-sm font-medium">{alert.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: stats, isLoading: statsLoading } = useGetSchoolStatsQuery();

  if (usersLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  const mockActivities = [
    {
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      description: 'New school "International Academy" registered',
      timestamp: '2 hours ago'
    },
    {
      icon: <Users className="w-4 h-4 text-green-600" />,
      description: 'Added 3 new administrators',
      timestamp: '5 hours ago'
    },
    // Add more activities as needed
  ];

  const mockAlerts = [
    {
      type: 'warning',
      title: 'System Update Required',
      message: 'A new system update is available. Please schedule maintenance.'
    },
    {
      type: 'error',
      title: 'Failed Login Attempts',
      message: 'Multiple failed login attempts detected from IP 192.168.1.1'
    }
  ];

  const statistics = {
    totalSchools: stats?.totalSchools || 0,
    activeUsers: stats?.activeUsers || 0,
    totalStudents: stats?.totalStudents || 0,
    pendingApprovals: stats?.pendingApprovals || 0,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to the super admin dashboard. Monitor and manage your entire system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Schools"
          value={statistics.totalSchools}
          icon={School}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Users"
          value={statistics.activeUsers}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Total Students"
          value={statistics.totalStudents}
          icon={GraduationCap}
          color="bg-purple-500"
        />
        <StatCard
          title="Pending Approvals"
          value={statistics.pendingApprovals}
          icon={UserCheck}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={mockActivities} />
        <AlertsList alerts={mockAlerts} />
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/schools/new'}
              className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <School className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-medium">Add New School</h4>
              <p className="text-sm text-gray-600">Register a new school in the system</p>
            </button>
            <button
              onClick={() => window.location.href = '/users/new'}
              className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <UserPlus className="w-6 h-6 text-green-500 mb-2" />
              <h4 className="font-medium">Create Admin</h4>
              <p className="text-sm text-gray-600">Add a new system administrator</p>
            </button>
            <button
              onClick={() => window.location.href = '/settings'}
              className="p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <Settings className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-medium">System Settings</h4>
              <p className="text-sm text-gray-600">Configure system-wide settings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
