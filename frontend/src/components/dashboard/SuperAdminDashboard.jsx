import React, { useState } from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import { 
  Users, 
  GraduationCap, 
  School, 
  BookOpen, 
  AlertCircle, 
  Calendar, 
  Clock,
  Settings,
  Shield,
  Database,
  BarChart3,
  Activity,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Server,
  HardDrive,
  Mail,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, trend, color = "blue", subtitle, onClick }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value ?? "N/A"}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`mt-2 text-sm ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"}`}>
              {trend > 0 ? <TrendingUp className="inline w-4 h-4 mr-1" /> : trend < 0 ? <TrendingDown className="inline w-4 h-4 mr-1" /> : null}
              <span className="font-medium">{trend > 0 ? "+" : ""}{trend}%</span>
              <span className="ml-1">from last month</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const SystemStatusCard = ({ title, status, details, icon: Icon, color }) => {
  const statusColors = {
    online: "text-green-600 bg-green-100",
    offline: "text-red-600 bg-red-100",
    warning: "text-yellow-600 bg-yellow-100",
    pending: "text-blue-600 bg-blue-100"
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-8 h-8 ${statusColors[status]?.split(' ')[0] || 'text-gray-400'}`} />
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{details}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

const SuperAdminDashboard = () => {
  const { data: stats, isLoading, error, refetch } = useGetDashboardStatsQuery();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) return <Spinner size="large" />;
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <p className="mt-2 text-sm text-red-700">{error.message}</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const recentExams = stats?.recentExams || [];
  const activities = stats?.activities || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={overview.totalUsers || 0} 
          icon={Users} 
          color="blue" 
          trend={12}
          subtitle="Active users in system"
        />
        <StatCard 
          title="Total Students" 
          value={overview.totalStudents || 0} 
          icon={GraduationCap} 
          color="green" 
          trend={8}
          subtitle="Enrolled students"
        />
        <StatCard 
          title="Total Teachers" 
          value={overview.totalTeachers || 0} 
          icon={School} 
          color="purple" 
          trend={5}
          subtitle="Active teachers"
        />
        <StatCard 
          title="Total Classes" 
          value={overview.totalClasses || 0} 
          icon={BookOpen} 
          color="orange" 
          trend={3}
          subtitle="Active classes"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`$${overview.feeSummary?.totalAmount || 0}`} 
          icon={DollarSign} 
          color="green" 
          trend={15}
          subtitle="This academic year"
        />
        <StatCard 
          title="Collected Fees" 
          value={`$${overview.feeSummary?.totalPaid || 0}`} 
          icon={CheckCircle} 
          color="blue" 
          trend={18}
          subtitle="Paid by students"
        />
        <StatCard 
          title="Pending Fees" 
          value={`$${overview.feeSummary?.pending || 0}`} 
          icon={AlertTriangle} 
          color="red" 
          trend={-5}
          subtitle="Outstanding payments"
        />
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SystemStatusCard
              title="Database"
              status="online"
              details="MongoDB Atlas"
              icon={Database}
            />
            <SystemStatusCard
              title="File Storage"
              status="online"
              details="Cloudinary CDN"
              icon={HardDrive}
            />
            <SystemStatusCard
              title="Email Service"
              status="warning"
              details="SMTP Configuration"
              icon={Mail}
            />
            <SystemStatusCard
              title="Backup System"
              status="online"
              details="Daily automated"
              icon={Server}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent System Activity</h3>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-3">
                    <Activity className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activities</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Exams</h3>
            <div className="space-y-4">
              {recentExams.length > 0 ? (
                recentExams.slice(0, 5).map((exam) => (
                  <div key={exam._id} className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{exam.title}</p>
                      <p className="text-sm text-gray-500">{exam.type} - {new Date(exam.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent exams</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* User Management Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/users/create"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Create User</span>
            </Link>
            <Link
              to="/dashboard/user-management"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              <span>User Management</span>
            </Link>
            <Link
              to="/dashboard/teachers/create"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <School className="w-5 h-5 mr-2" />
              <span>Add Teacher</span>
            </Link>
            <Link
              to="/dashboard/students/create"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>Add Student</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Role Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Super Admins</p>
                  <p className="text-2xl font-bold text-blue-600">{overview.superAdmins || 0}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">School Admins</p>
                  <p className="text-2xl font-bold text-green-600">{overview.schoolAdmins || 0}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900">Teachers</p>
                  <p className="text-2xl font-bold text-purple-600">{overview.totalTeachers || 0}</p>
                </div>
                <School className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-900">Students</p>
                  <p className="text-2xl font-bold text-orange-600">{overview.totalStudents || 0}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemManagement = () => (
    <div className="space-y-6">
      {/* System Configuration */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/dashboard/system-settings"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Settings className="w-5 h-5 mr-2" />
              <span>System Settings</span>
            </Link>
            <Link
              to="/dashboard/audit-logs"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Activity className="w-5 h-5 mr-2" />
              <span>Audit Logs</span>
            </Link>
            <Link
              to="/dashboard/backup-management"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Database className="w-5 h-5 mr-2" />
              <span>Backup & Restore</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:text-green-500 transition-colors">
              <Download className="w-5 h-5 mr-2" />
              <span>Export Data</span>
            </button>
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              <span>Import Data</span>
            </button>
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-colors">
              <RefreshCw className="w-5 h-5 mr-2" />
              <span>Backup Now</span>
            </button>
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:text-red-500 transition-colors">
              <Trash2 className="w-5 h-5 mr-2" />
              <span>Cleanup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/dashboard/reports"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>Generate Reports</span>
            </Link>
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <BarChart3 className="w-5 h-5 mr-2" />
              <span>Analytics Dashboard</span>
            </button>
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <Activity className="w-5 h-5 mr-2" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">Active Sessions</p>
                  <p className="text-2xl font-bold text-green-600">{overview.activeSessions || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-900">Failed Logins</p>
                  <p className="text-2xl font-bold text-yellow-600">{overview.failedLogins || 0}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">Security Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{overview.securityAlerts || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:text-red-500 transition-colors">
              <Shield className="w-5 h-5 mr-2" />
              <span>Force Logout All</span>
            </button>
            <button className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-500 hover:text-yellow-500 transition-colors">
              <RefreshCw className="w-5 h-5 mr-2" />
              <span>Reset Passwords</span>
            </button>
            <Link
              to="/dashboard/audit-logs"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Eye className="w-5 h-5 mr-2" />
              <span>Audit Logs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUserManagement();
      case 'system':
        return renderSystemManagement();
      case 'reports':
        return renderReports();
      case 'security':
        return renderSecurity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;