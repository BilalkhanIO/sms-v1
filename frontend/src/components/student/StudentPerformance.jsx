import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerformanceStats } from '../../redux/features/studentSlice';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const StudentPerformance = ({ studentId }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { performanceStats, loading } = useSelector((state) => state.student);
  const dispatch = useDispatch();

  useEffect(() => {
    if (studentId) {
      dispatch(fetchPerformanceStats({ studentId, subject: selectedSubject }));
    }
  }, [dispatch, studentId, selectedSubject]);

  return (
    <div className="space-y-6">
      {/* Subject Selection */}
      <div className="flex justify-end">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Subjects</option>
          {performanceStats?.subjects?.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Overall Grade</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {performanceStats?.overallGrade || 'N/A'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Class Rank</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {performanceStats?.rank || 'N/A'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Percentile</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {performanceStats?.percentile || 'N/A'}
          </p>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grade Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Grade Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceStats?.gradeTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  name="Score"
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#82ca9d"
                  name="Class Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Subject Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={performanceStats?.subjectPerformance || []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Assessment Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceStats?.assessments?.map((assessment) => (
                  <tr key={assessment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assessment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assessment.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assessment.score}/{assessment.totalScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assessment.grade === 'A'
                            ? 'bg-green-100 text-green-800'
                            : assessment.grade === 'F'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {assessment.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assessment.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;
