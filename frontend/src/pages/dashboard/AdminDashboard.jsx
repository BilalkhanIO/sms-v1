import { useSelector } from 'react-redux';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentActivities from '../../components/dashboard/RecentActivities';
import PerformanceChart from '../../components/dashboard/PerformanceChart';

const AdminDashboard = () => {
  const stats = useSelector((state) => state.dashboard.stats);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          trend={stats?.studentTrend || 0}
          icon="users"
        />
        <StatsCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          trend={stats?.teacherTrend || 0}
          icon="academic-cap"
        />
        <StatsCard
          title="Total Classes"
          value={stats?.totalClasses || 0}
          trend={stats?.classTrend || 0}
          icon="book-open"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate || 0}%`}
          trend={stats?.attendanceTrend || 0}
          icon="chart-bar"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <PerformanceChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 