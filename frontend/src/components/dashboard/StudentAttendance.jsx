import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import dashboardService from '../../services/dashboardService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const { loading, error, execute: fetchAttendanceData } = useApi(
    dashboardService.getAttendanceStats
  );

  useEffect(() => {
    const loadAttendanceData = async () => {
      try {
        const data = await fetchAttendanceData();
        setAttendanceData(data);
      } catch (error) {
        console.error('Failed to load attendance data:', error);
      }
    };

    loadAttendanceData();
  }, [fetchAttendanceData]);

  if (loading) return <LoadingSpinner size="small" />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={attendanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="present" fill="#4F46E5" name="Present" />
          <Bar dataKey="absent" fill="#EF4444" name="Absent" />
          <Bar dataKey="late" fill="#F59E0B" name="Late" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentAttendance; 