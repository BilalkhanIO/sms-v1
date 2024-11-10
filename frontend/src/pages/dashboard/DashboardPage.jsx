import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UsersIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { fetchDashboardStats } from '../../redux/features/dashboardSlice';
import RecentActivityList from '../../components/dashboard/RecentActivityList';
import PerformanceChart from '../../components/dashboard/PerformanceChart';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard || { stats: {} });

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents ?? 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Teachers',
      value: stats?.totalTeachers ?? 0,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Fee Collection',
      value: `$${stats?.feeCollection ?? 0}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate ?? 0}%`,
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Exam Pass Rate',
      value: `${stats?.examPassRate ?? 0}%`,
      icon: ChartBarIcon,
      color: 'bg-red-500',
    },
    {
      title: 'Library Books',
      value: stats?.totalBooks ?? 0,
      icon: BookOpenIcon,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 flex items-center space-x-4"
          >
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Additional Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <RecentActivityList />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Overview
          </h2>
          <PerformanceChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 