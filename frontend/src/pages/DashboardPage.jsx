import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  WalletIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.status === 'INACTIVE') {
      navigate('/login');
    }
  }, [user, navigate]);

  const DashboardCard = ({ title, description, link, Icon }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="mt-2 text-sm text-gray-900">
                {description}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <button
            onClick={() => navigate(link)}
            className="font-medium text-indigo-600 hover:text-indigo-900"
          >
            View details →
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="User Management"
        description="Manage users, roles, and permissions"
        link="/admin/users"
        Icon={UserGroupIcon}
      />
      <DashboardCard
        title="Reports"
        description="View and generate system reports"
        link="/admin/reports"
        Icon={ChartBarIcon}
      />
      <DashboardCard
        title="Settings"
        description="Configure system settings"
        link="/admin/settings"
        Icon={UserIcon}
      />
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="My Students"
        description="View and manage your students"
        link="/teacher/students"
        Icon={UserGroupIcon}
      />
      <DashboardCard
        title="Grades"
        description="Manage student grades"
        link="/teacher/grades"
        Icon={DocumentTextIcon}
      />
      <DashboardCard
        title="Schedule"
        description="View your teaching schedule"
        link="/teacher/schedule"
        Icon={CalendarIcon}
      />
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="My Grades"
        description="View your academic performance"
        link="/student/grades"
        Icon={AcademicCapIcon}
      />
      <DashboardCard
        title="Schedule"
        description="View your class schedule"
        link="/student/schedule"
        Icon={CalendarIcon}
      />
      <DashboardCard
        title="Courses"
        description="Access your enrolled courses"
        link="/student/courses"
        Icon={DocumentTextIcon}
      />
    </div>
  );

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'SCHOOL_ADMIN':
        return renderAdminDashboard();
      case 'TEACHER':
        return renderTeacherDashboard();
      case 'STUDENT':
        return renderStudentDashboard();
      default:
        return <div>Access Denied</div>;
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    return `${greeting}, ${user?.firstName || 'User'}!`;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {getWelcomeMessage()}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Total Students</div>
              <div className="mt-1 text-2xl font-semibold">1,234</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Active Courses</div>
              <div className="mt-1 text-2xl font-semibold">56</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500">Upcoming Events</div>
              <div className="mt-1 text-2xl font-semibold">8</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          {renderDashboardByRole()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 