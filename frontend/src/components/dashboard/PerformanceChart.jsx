import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import dashboardService from '@/services/dashboardService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const PerformanceChart = ({ dataKeys, colors }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const { loading, error, execute } = useApi(() => dashboardService.getPerformanceStats());

  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        const response = await execute();
        if (response?.success) {
          setPerformanceData(response.data);
        } else {
          throw new Error(response?.message || 'Failed to load performance data');
        }
      } catch (error) {
        console.error('Failed to load performance data:', error);
      }
    };

    loadPerformanceData();
  }, [execute]);

  if (loading) return <LoadingSpinner size="small" />;
  if (error) return <ErrorMessage message={error} />;
  if (!performanceData) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index] || '#8884d8'}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;