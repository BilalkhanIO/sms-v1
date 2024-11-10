import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getStudentById } from '../../redux/features/studentSlice';
import { fetchAcademicData } from '../../redux/features/academicSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const AcademicPerformancePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedStudent, loading, error } = useSelector(state => state.student);
  const { exams, subjects } = useSelector(state => state.academic);

  useEffect(() => {
    if (id) {
      dispatch(getStudentById(id));
      dispatch(fetchAcademicData());
    }
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedStudent) return <ErrorMessage message="Student not found" />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Academic Performance</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Overall Grade</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {selectedStudent.overallGrade || 'N/A'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Attendance</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {selectedStudent.attendance?.percentage || '0'}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Class Rank</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {selectedStudent.rank || 'N/A'}
          </p>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Trend</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={selectedStudent.performanceHistory || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="examName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#4F46E5" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Subject-wise Performance</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={selectedStudent.subjectPerformance || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AcademicPerformancePage; 