import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import  { useDashboard }  from '../../hooks/useDashboard';
import StatsCard from '../../components/dashboard/StatsCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import UpcomingClasses from '../../components/dashboard/UpcomingClasses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { dashboardData, loading, error, refreshDashboard } = useDashboard('STUDENT');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboardData) return null;

  const statsCards = [
    {
      title: 'Overall Grade',
      value: dashboardData.overallGrade || 'N/A',
      icon: AcademicCapIcon,
      trend: dashboardData.gradeTrend,
      color: 'blue'
    },
    {
      title: 'Attendance',
      value: `${dashboardData.attendance || 0}%`,
      icon: ChartBarIcon,
      trend: dashboardData.attendanceTrend,
      color: 'green'
    },
    {
      title: 'Upcoming Tests',
      value: dashboardData.upcomingTests || 0,
      icon: ClockIcon,
      color: 'yellow'
    },
    {
      title: 'Assignments',
      value: `${dashboardData.completedAssignments || 0}/${dashboardData.totalAssignments || 0}`,
      icon: BookOpenIcon,
      color: 'indigo'
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
            Academic Performance
          </h3>
          <PerformanceChart 
            dataKeys={['grades', 'attendance']}
            colors={['#60A5FA', '#34D399']}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Upcoming Classes
          </h3>
          <UpcomingClasses />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 