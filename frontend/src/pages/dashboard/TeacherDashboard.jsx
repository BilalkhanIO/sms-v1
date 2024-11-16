import { useDashboard } from '../../hooks/useDashboard';
import StatsCard from '../../components/dashboard/StatsCard';
import StudentAttendance from '../../components/dashboard/StudentAttendance';
import UpcomingClasses from '../../components/dashboard/UpcomingClasses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const { dashboardData, loading, error } = useDashboard('TEACHER');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboardData) return null;

  const statsCards = [
    {
      title: 'My Students',
      value: dashboardData.totalStudents || 0,
      icon: UserGroupIcon,
      trend: dashboardData.studentTrend,
      color: 'blue'
    },
    {
      title: 'Classes Today',
      value: dashboardData.todayClasses || 0,
      icon: BookOpenIcon,
      color: 'green'
    },
    {
      title: 'Attendance Rate',
      value: `${dashboardData.attendanceRate || 0}%`,
      icon: ChartBarIcon,
      trend: dashboardData.attendanceTrend,
      color: 'indigo'
    },
    {
      title: 'Pending Tasks',
      value: dashboardData.pendingTasks || 0,
      icon: ClipboardDocumentListIcon,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Class Attendance
          </h3>
          <StudentAttendance data={dashboardData.attendanceData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Upcoming Classes
          </h3>
          <UpcomingClasses data={dashboardData.upcomingClasses} />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 