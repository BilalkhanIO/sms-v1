import { useState, useMemo } from 'react';
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

const ExamPerformance = ({ exams, subjects }) => {
  const [selectedView, setSelectedView] = useState('timeline'); // timeline, comparison, radar
  const [selectedExam, setSelectedExam] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderTimelineView = () => (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={exams}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          {subjects.map((subject, index) => (
            <Line
              key={subject.id}
              type="monotone"
              dataKey={`scores.${subject.id}`}
              name={subject.name}
              stroke={`hsl(${(index * 360) / subjects.length}, 70%, 50%)`}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderComparisonView = () => (
    <div className="space-y-6">
      {exams.map((exam) => (
        <div
          key={exam.id}
          className={`bg-white p-4 rounded-lg shadow ${
            selectedExam?.id === exam.id ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setSelectedExam(exam)}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900">{exam.name}</h4>
              <p className="text-sm text-gray-500">{exam.date}</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${getScoreColor(exam.averageScore)}`}>
                {exam.averageScore}%
              </p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const score = exam.scores[subject.id];
              return (
                <div key={subject.id} className="text-center">
                  <p className="text-sm text-gray-500">{subject.name}</p>
                  <p className={`text-lg font-medium ${getScoreColor(score)}`}>
                    {score}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const radarData = useMemo(() => {
    return subjects.map((subject) => ({
      subject: subject.name,
      score: exams.reduce((acc, exam) => acc + exam.scores[subject.id], 0) / exams.length,
    }));
  }, [subjects, exams]);

  const renderRadarView = () => {
    return (
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={150} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar
              name="Average Score"
              dataKey="score"
              stroke="#4F46E5"
              fill="#4F46E5"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        {/* View Selection */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-x-4">
            <button
              onClick={() => setSelectedView('timeline')}
              className={`px-3 py-1.5 rounded ${
                selectedView === 'timeline'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setSelectedView('comparison')}
              className={`px-3 py-1.5 rounded ${
                selectedView === 'comparison'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Comparison
            </button>
            <button
              onClick={() => setSelectedView('radar')}
              className={`px-3 py-1.5 rounded ${
                selectedView === 'radar'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Subject Analysis
            </button>
          </div>
        </div>

        {/* Performance Visualization */}
        {selectedView === 'timeline' && renderTimelineView()}
        {selectedView === 'comparison' && renderComparisonView()}
        {selectedView === 'radar' && renderRadarView()}
      </div>
    </div>
  );
};

export default ExamPerformance;