import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReminderAnalytics = () => {
  const [timeframe, setTimeframe] = useState('MONTH'); // WEEK, MONTH, YEAR
  const [metrics, setMetrics] = useState({
    deliveryStats: [],
    responseRates: [],
    collectionImpact: [],
    channelPerformance: [],
  });

  const { reminderHistory } = useSelector((state) => state.fee);

  useEffect(() => {
    // Calculate analytics based on reminder history and timeframe
    calculateMetrics();
  }, [reminderHistory, timeframe]);

  const calculateMetrics = () => {
    // Calculate delivery statistics
    const deliveryStats = [
      { name: 'Delivered', value: 0 },
      { name: 'Failed', value: 0 },
      { name: 'Pending', value: 0 },
    ];

    // Calculate response rates over time
    const responseRates = [];

    // Calculate collection impact
    const collectionImpact = [];

    // Calculate channel performance
    const channelPerformance = [
      { name: 'Email', sent: 0, delivered: 0, responded: 0 },
      { name: 'SMS', sent: 0, delivered: 0, responded: 0 },
    ];

    // Process reminder history to populate metrics
    reminderHistory.forEach((reminder) => {
      // Update delivery stats
      const statusIndex = deliveryStats.findIndex((s) => s.name === reminder.status);
      if (statusIndex !== -1) {
        deliveryStats[statusIndex].value++;
      }

      // Update channel performance
      const channelIndex = reminder.type === 'EMAIL' ? 0 : 1;
      channelPerformance[channelIndex].sent++;
      if (reminder.status === 'DELIVERED') {
        channelPerformance[channelIndex].delivered++;
      }
      if (reminder.paymentReceived) {
        channelPerformance[channelIndex].responded++;
      }
    });

    setMetrics({
      deliveryStats,
      responseRates,
      collectionImpact,
      channelPerformance,
    });
  };

  return (
    <div className="space-y-8">
      {/* Timeframe Selection */}
      <div className="flex justify-end">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="WEEK">Last Week</option>
          <option value="MONTH">Last Month</option>
          <option value="YEAR">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Statistics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delivery Statistics
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.deliveryStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {metrics.deliveryStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Channel Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.channelPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" fill="#0088FE" name="Sent" />
                <Bar dataKey="delivered" fill="#00C49F" name="Delivered" />
                <Bar dataKey="responded" fill="#FFBB28" name="Responded" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Rates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Response Rates
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.responseRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#8884d8"
                  name="Response Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Collection Impact */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Collection Impact
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.collectionImpact}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#8884d8"
                  name="Collection Amount"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderAnalytics; 