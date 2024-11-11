import { useSelector } from 'react-redux';
import { usePermissions } from '../../hooks/usePermissions';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { hasRole } = usePermissions();

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
    if (hasRole('PARENT')) {
      return <ParentDashboard />;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h1>
      {getDashboardComponent()}
    </div>
  );
};

export default DashboardPage; 