import { useEffect, useState } from 'react';
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
  LineChart,
  Line
} from 'recharts';
import { GRADE_SCALE } from '../../constants/exam';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ExamPerformanceAnalytics = ({ examData }) => {
  const [analytics, setAnalytics] = useState({
    gradeDistribution: [],
    subjectPerformance: [],
    scoreRanges: [],
    passFailRate: []
  });

  useEffect(() => {
    if (examData) {
      processExamData(examData);
    }
  }, [examData]);

  const processExamData = (data) => {
    // Calculate grade distribution
    const gradeCount = Object.keys(GRADE_SCALE).reduce((acc, grade) => {
      acc[grade] = 0;
      return acc;
    }, {});

    data.results.forEach(result => {
      gradeCount[result.grade] = (gradeCount[result.grade] || 0) + 1;
    });

    // Calculate subject performance
    const subjectPerf = data.subjects.map(subject => {
      const scores = data.results.map(r => 
        r.subjects.find(s => s.subjectId === subject.id)?.obtainedMarks || 0
      );
      return {
        subject: subject.subjectName,
        average: scores.reduce((a, b) => a + b, 0) / scores.length,
        highest: Math.max(...scores),
        lowest: Math.min(...scores)
      };
    });

    // Calculate score ranges
    const ranges = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 }
    ];

    data.results.forEach(result => {
      const percentage = (result.obtainedMarks / data.totalMarks) * 100;
      const rangeIndex = Math.min(Math.floor(percentage / 20), 4);
      ranges[rangeIndex].count++;
    });

    // Calculate pass/fail rate
    const totalStudents = data.results.length;
    const passedStudents = data.results.filter(r => r.grade !== 'F').length;

    setAnalytics({
      gradeDistribution: Object.entries(gradeCount).map(([grade, count]) => ({
        grade,
        count
      })),
      subjectPerformance: subjectPerf,
      scoreRanges: ranges,
      passFailRate: [
        { name: 'Pass', value: passedStudents },
        { name: 'Fail', value: totalStudents - passedStudents }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            {((examData.results.reduce((acc, r) => acc + r.obtainedMarks, 0) / 
              examData.results.length) / examData.totalMarks * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pass Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {((analytics.passFailRate[0]?.value || 0) / 
              examData.results.length * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Highest Score</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {Math.max(...examData.results.map(r => r.obtainedMarks))}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Lowest Score</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            {Math.min(...examData.results.map(r => r.obtainedMarks))}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Grade Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.gradeDistribution}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Subject Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8884d8" name="Average" />
                <Bar dataKey="highest" fill="#82ca9d" name="Highest" />
                <Bar dataKey="lowest" fill="#ff8042" name="Lowest" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Score Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.scoreRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pass/Fail Rate */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Pass/Fail Rate
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.passFailRate}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ff8042" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPerformanceAnalytics;
