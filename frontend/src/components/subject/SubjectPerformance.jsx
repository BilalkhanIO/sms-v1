import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchSubjectPerformance } from '../../redux/features/subjectSlice';

const SubjectPerformance = ({ subjectId }) => {
  const dispatch = useDispatch();
  const [timeframe, setTimeframe] = useState('term'); // term, year
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        const data = await dispatch(fetchSubjectPerformance({
          subjectId,
          timeframe
        })).unwrap();
        setPerformanceData(data);
      } catch (error) {
        console.error('Failed to load performance data:', error);
      }
    };

    loadPerformanceData();
  }, [dispatch, subjectId, timeframe]);

  if (!performanceData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Performance Analytics
        </h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="term">This Term</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Class Average</h4>
          <p className="mt-2 text-2xl font-semibold text-indigo-600">
            {performanceData.classAverage}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Highest Score</h4>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            {performanceData.highestScore}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Lowest Score</h4>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {performanceData.lowestScore}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Pass Rate</h4>
          <p className="mt-2 text-2xl font-semibold text-blue-600">
            {performanceData.passRate}%
          </p>
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-base font-medium text-gray-900 mb-4">
          Performance Trend
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#4F46E5"
                name="Class Average"
              />
              <Line
                type="monotone"
                dataKey="highest"
                stroke="#10B981"
                name="Highest Score"
              />
              <Line
                type="monotone"
                dataKey="lowest"
                stroke="#EF4444"
                name="Lowest Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grade Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-base font-medium text-gray-900 mb-4">
          Grade Distribution
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData.gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4F46E5" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SubjectPerformance;
