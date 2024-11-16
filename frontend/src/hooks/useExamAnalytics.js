import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchExamResults } from '../redux/features/examSlice';

export const useExamAnalytics = (examId) => {
  const dispatch = useDispatch();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (examId) {
      loadAnalytics();
    }
  }, [examId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const results = await dispatch(fetchExamResults(examId)).unwrap();
      const processedAnalytics = processResults(results);
      setAnalytics(processedAnalytics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processResults = (results) => {
    // Calculate various statistics
    const totalStudents = results.length;
    const passedStudents = results.filter(r => r.grade !== 'F').length;
    const averageScore = results.reduce((acc, r) => acc + r.percentage, 0) / totalStudents;

    // Process subject-wise performance
    const subjectPerformance = {};
    results.forEach(result => {
      result.subjects.forEach(subject => {
        if (!subjectPerformance[subject.subjectId]) {
          subjectPerformance[subject.subjectId] = {
            scores: [],
            total: subject.totalMarks
          };
        }
        subjectPerformance[subject.subjectId].scores.push(subject.obtainedMarks);
      });
    });

    return {
      summary: {
        totalStudents,
        passRate: (passedStudents / totalStudents) * 100,
        averageScore,
        highestScore: Math.max(...results.map(r => r.percentage)),
        lowestScore: Math.min(...results.map(r => r.percentage))
      },
      subjectPerformance: Object.entries(subjectPerformance).map(([id, data]) => ({
        subjectId: id,
        average: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        highest: Math.max(...data.scores),
        lowest: Math.min(...data.scores),
        passRate: (data.scores.filter(score => score >= (data.total * 0.4)).length / data.scores.length) * 100
      })),
      gradeDistribution: calculateGradeDistribution(results)
    };
  };

  const calculateGradeDistribution = (results) => {
    const distribution = {};
    results.forEach(result => {
      distribution[result.grade] = (distribution[result.grade] || 0) + 1;
    });
    return distribution;
  };

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: loadAnalytics
  };
};
