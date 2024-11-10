import AttendanceTracking from '../../components/student/AttendanceTracking';

const StudentAttendancePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Student Attendance</h1>
      <AttendanceTracking />
    </div>
  );
};

export default StudentAttendancePage; 