import { useSelector } from 'react-redux';
import { usePermissions } from '../hooks/usePermissions';
import { DashboardProvider } from '../contexts/DashboardContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { hasRole } = usePermissions();

  if (!user) return <LoadingSpinner />;

  const getDashboardComponent = () => {
    if (hasRole('SUPER_ADMIN') || hasRole('SCHOOL_ADMIN')) {
      return <AdminDashboard />;
    }
    if (hasRole('TEACHER')) {
      return <TeacherDashboard />;
    }
    if (hasRole('STUDENT')) {
      return <StudentDashboard />;
    }
    return null;
  };

  return (
    <DashboardProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's your dashboard overview
          </p>
        </div>
        {getDashboardComponent()}
      </div>
    </DashboardProvider>
  );
};

export default DashboardPage; 