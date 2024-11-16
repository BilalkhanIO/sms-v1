export const SUBJECT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED'
};

export const MATERIAL_TYPES = {
  DOCUMENT: 'DOCUMENT',
  VIDEO: 'VIDEO',
  LINK: 'LINK'
};

export const ALLOWED_FILE_TYPES = {
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  VIDEO: ['video/mp4', 'video/webm'],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif']
};

export const PERFORMANCE_TIMEFRAMES = {
  TERM: 'term',
  YEAR: 'year',
  ALL: 'all'
};

export const GRADE_SCALE = {
  'A+': { min: 90, max: 100 },
  'A': { min: 80, max: 89 },
  'B+': { min: 75, max: 79 },
  'B': { min: 70, max: 74 },
  'C+': { min: 65, max: 69 },
  'C': { min: 60, max: 64 },
  'D': { min: 50, max: 59 },
  'F': { min: 0, max: 49 }
};
