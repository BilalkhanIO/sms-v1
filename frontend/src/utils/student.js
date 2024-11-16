export const formatStudentData = (data) => {
  return {
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
    age: calculateAge(data.dateOfBirth),
    status: data.status || 'ACTIVE',
    admissionDate: new Date(data.admissionDate).toLocaleDateString(),
  };
};

export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const validateStudentData = (data) => {
  const errors = {};
  
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }
  
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }
  
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }
  
  if (!data.guardianInfo?.name) {
    errors.guardianName = 'Guardian name is required';
  }
  
  if (!data.guardianInfo?.phone) {
    errors.guardianPhone = 'Guardian phone is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateStudentId = (prefix = 'STD', sequence) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const paddedSequence = sequence.toString().padStart(4, '0');
  return `${prefix}${year}${paddedSequence}`;
};

export const calculateGrade = (score, totalMarks) => {
  const percentage = (score / totalMarks) * 100;
  
  for (const [grade, range] of Object.entries(GRADE_SCALE)) {
    if (percentage >= range.min && percentage <= range.max) {
      return grade;
    }
  }
  
  return 'F';
};

export const getPerformanceMetric = (percentage) => {
  for (const [metric, data] of Object.entries(PERFORMANCE_METRICS)) {
    if (percentage >= data.min) {
      return {
        label: data.label,
        color: data.color
      };
    }
  }
  
  return {
    label: 'Poor',
    color: 'red'
  };
}; 