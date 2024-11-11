import { useSelector } from 'react-redux';
import StatsCard from '../../components/dashboard/StatsCard';

const StudentDashboard = () => {
  const studentStats = useSelector((state) => state.dashboard.studentStats);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Attendance"
          value={`${studentStats?.attendance || 0}%`}
          trend={studentStats?.attendanceTrend || 0}
          icon="chart-bar"
        />
        <StatsCard
          title="Performance"
          value={studentStats?.performance || 'N/A'}
          trend={studentStats?.performanceTrend || 0}
          icon="academic-cap"
        />
        <StatsCard
          title="Assignments"
          value={studentStats?.assignments || 0}
          trend={0}
          icon="clipboard-list"
        />
        <StatsCard
          title="Upcoming Exams"
          value={studentStats?.upcomingExams || 0}
          trend={0}
          icon="calendar"
        />
      </div>
    </div>
  );
};

export default StudentDashboard; 