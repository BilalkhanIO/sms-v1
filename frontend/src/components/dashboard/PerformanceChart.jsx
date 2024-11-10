import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceChart = () => {
  // Mock data - replace with actual data from API
  const data = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 82 },
    { name: 'Apr', value: 75 },
    { name: 'May', value: 80 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Performance Score" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart; 