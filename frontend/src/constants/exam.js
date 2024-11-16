export const EXAM_TYPES = {
  MIDTERM: 'MIDTERM',
  FINAL: 'FINAL',
  QUIZ: 'QUIZ',
  ASSIGNMENT: 'ASSIGNMENT'
};

export const EXAM_STATUS = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const RESULT_STATUS = {
  PASS: 'PASS',
  FAIL: 'FAIL',
  ABSENT: 'ABSENT',
  PENDING: 'PENDING'
};

export const GRADE_SCALE = {
  'A+': { min: 90, max: 100, gpa: 4.0 },
  'A': { min: 85, max: 89, gpa: 3.7 },
  'A-': { min: 80, max: 84, gpa: 3.5 },
  'B+': { min: 75, max: 79, gpa: 3.3 },
  'B': { min: 70, max: 74, gpa: 3.0 },
  'B-': { min: 65, max: 69, gpa: 2.7 },
  'C+': { min: 60, max: 64, gpa: 2.3 },
  'C': { min: 55, max: 59, gpa: 2.0 },
  'C-': { min: 50, max: 54, gpa: 1.7 },
  'F': { min: 0, max: 49, gpa: 0.0 }
};

export const REPORT_TYPES = {
  RESULT_SHEET: 'RESULT_SHEET',
  GRADE_SHEET: 'GRADE_SHEET',
  PERFORMANCE_ANALYSIS: 'PERFORMANCE_ANALYSIS',
  ATTENDANCE_SHEET: 'ATTENDANCE_SHEET'
};
