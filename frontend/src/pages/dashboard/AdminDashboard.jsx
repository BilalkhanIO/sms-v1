import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import dashboardService from '../../services/dashboardService';
import StatsCard from '../../components/dashboard/StatsCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import RecentActivities from '../../components/dashboard/RecentActivities';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { loading, error, execute: fetchDashboardData } = useApi(
    dashboardService.getStats
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData('admin'); // Use 'admin' instead of role
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!dashboardData) return null;

  const statsCards = [
    {
      title: 'Total Students',
      value: dashboardData.totalStudents || 0,
      icon: UserGroupIcon,
      trend: dashboardData.studentTrend,
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: dashboardData.totalRevenue ? `$${dashboardData.totalRevenue}` : '$0',
      icon: CurrencyDollarIcon,
      trend: dashboardData.revenueTrend,
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
      title: 'Performance',
      value: `${dashboardData.averagePerformance || 0}%`,
      icon: AcademicCapIcon,
      trend: dashboardData.performanceTrend,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart 
          data={dashboardData.performanceData}
          dataKeys={['students', 'attendance', 'performance']}
          colors={['#60A5FA', '#34D399', '#818CF8']}
        />
        <RecentActivities data={dashboardData.recentActivities} />
      </div>
    </div>
  );
};

export default AdminDashboard;