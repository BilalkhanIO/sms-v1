import { GRADE_SCALE } from '../constants/subject';

export const calculateGrade = (score) => {
  for (const [grade, range] of Object.entries(GRADE_SCALE)) {
    if (score >= range.min && score <= range.max) {
      return grade;
    }
  }
  return 'F';
};

export const calculateClassAverage = (scores) => {
  if (!scores.length) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / scores.length) * 100) / 100;
};

export const calculatePassRate = (scores, passingScore = 50) => {
  if (!scores.length) return 0;
  const passedCount = scores.filter(score => score >= passingScore).length;
  return Math.round((passedCount / scores.length) * 100);
};

export const formatSubjectCode = (code) => {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

export const generateSubjectReport = (subject, performanceData) => {
  return {
    subjectInfo: {
      name: subject.name,
      code: subject.code,
      teacher: subject.teacher.name,
      grade: subject.grade,
      credits: subject.credits
    },
    performance: {
      classAverage: performanceData.classAverage,
      highestScore: performanceData.highestScore,
      lowestScore: performanceData.lowestScore,
      passRate: performanceData.passRate,
      gradeDistribution: performanceData.gradeDistribution
    },
    materials: subject.materials.map(material => ({
      title: material.title,
      type: material.type,
      uploadedAt: material.uploadedAt
    }))
  };
};
