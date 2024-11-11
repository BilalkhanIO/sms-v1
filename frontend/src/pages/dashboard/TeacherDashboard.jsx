import { useSelector } from 'react-redux';
import StatsCard from '../../components/dashboard/StatsCard';
import UpcomingClasses from '../../components/dashboard/UpcomingClasses';
import StudentAttendance from '../../components/dashboard/StudentAttendance';

const TeacherDashboard = () => {
  const teacherStats = useSelector((state) => state.dashboard.teacherStats);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Classes"
          value={teacherStats?.totalClasses || 0}
          trend={teacherStats?.classTrend || 0}
          icon="book-open"
        />
        <StatsCard
          title="Total Students"
          value={teacherStats?.totalStudents || 0}
          trend={teacherStats?.studentTrend || 0}
          icon="users"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${teacherStats?.attendanceRate || 0}%`}
          trend={teacherStats?.attendanceTrend || 0}
          icon="chart-bar"
        />
        <StatsCard
          title="Assignments"
          value={teacherStats?.pendingAssignments || 0}
          trend={0}
          icon="clipboard-list"
        />
      </div>

      {/* Schedule and Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
          <UpcomingClasses />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Student Attendance</h3>
          <StudentAttendance />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 