export const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  TRANSFERRED: 'TRANSFERRED',
  GRADUATED: 'GRADUATED',
  SUSPENDED: 'SUSPENDED',
};

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const DOCUMENT_TYPES = {
  BIRTH_CERTIFICATE: 'BIRTH_CERTIFICATE',
  TRANSFER_CERTIFICATE: 'TRANSFER_CERTIFICATE',
  MEDICAL_RECORD: 'MEDICAL_RECORD',
  PHOTO: 'PHOTO',
  OTHER: 'OTHER',
};

export const STUDENT_TABLE_COLUMNS = [
  { id: 'name', label: 'Name' },
  { id: 'rollNumber', label: 'Roll No' },
  { id: 'class', label: 'Class' },
  { id: 'guardian', label: 'Guardian' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions' },
];

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
};

export const GRADE_SCALE = {
  'A+': { min: 90, max: 100 },
  'A': { min: 80, max: 89 },
  'B+': { min: 75, max: 79 },
  'B': { min: 70, max: 74 },
  'C+': { min: 65, max: 69 },
  'C': { min: 60, max: 64 },
  'D': { min: 50, max: 59 },
  'F': { min: 0, max: 49 },
};

export const PERFORMANCE_METRICS = {
  EXCELLENT: { min: 90, label: 'Excellent', color: 'green' },
  GOOD: { min: 75, label: 'Good', color: 'blue' },
  AVERAGE: { min: 60, label: 'Average', color: 'yellow' },
  POOR: { min: 0, label: 'Needs Improvement', color: 'red' },
}; 