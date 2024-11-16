import { EXAM_TYPES, EXAM_STATUS } from '../../constants/exam';

export const validateExam = (data) => {
  const errors = {};

  // Basic validation
  if (!data.title?.trim()) {
    errors.title = 'Exam title is required';
  }

  if (!data.type || !Object.values(EXAM_TYPES).includes(data.type)) {
    errors.type = 'Valid exam type is required';
  }

  if (!data.classId) {
    errors.classId = 'Class is required';
  }

  // Date validation
  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required';
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      errors.endDate = 'End date must be after start date';
    }
  }

  // Marks validation
  if (!data.totalMarks || data.totalMarks <= 0) {
    errors.totalMarks = 'Total marks must be greater than 0';
  }

  if (!data.passingMarks || data.passingMarks <= 0) {
    errors.passingMarks = 'Passing marks must be greater than 0';
  }

  if (data.passingMarks > data.totalMarks) {
    errors.passingMarks = 'Passing marks cannot be greater than total marks';
  }

  // Subjects validation
  if (data.subjects && data.subjects.length > 0) {
    const subjectErrors = validateSubjects(data.subjects, data.totalMarks);
    if (Object.keys(subjectErrors).length > 0) {
      errors.subjects = subjectErrors;
    }
  }

  return errors;
};

export const validateSubjects = (subjects, totalMarks) => {
  const errors = {};
  let totalSubjectMarks = 0;

  subjects.forEach((subject, index) => {
    const subjectErrors = {};

    if (!subject.marks || subject.marks <= 0) {
      subjectErrors.marks = 'Subject marks must be greater than 0';
    }

    totalSubjectMarks += subject.marks || 0;

    if (Object.keys(subjectErrors).length > 0) {
      errors[index] = subjectErrors;
    }
  });

  if (totalSubjectMarks !== totalMarks) {
    errors.total = 'Sum of subject marks must equal total marks';
  }

  return errors;
};

export const validateExamSchedule = (scheduleData) => {
  const errors = {};

  if (!scheduleData.subjects || scheduleData.subjects.length === 0) {
    errors.subjects = 'At least one subject must be scheduled';
    return errors;
  }

  scheduleData.subjects.forEach((subject, index) => {
    const subjectErrors = {};

    if (!subject.date) {
      subjectErrors.date = 'Date is required';
    }

    if (!subject.startTime) {
      subjectErrors.startTime = 'Start time is required';
    }

    if (!subject.endTime) {
      subjectErrors.endTime = 'End time is required';
    }

    if (subject.startTime && subject.endTime) {
      const start = new Date(`2000-01-01T${subject.startTime}`);
      const end = new Date(`2000-01-01T${subject.endTime}`);
      if (end <= start) {
        subjectErrors.time = 'End time must be after start time';
      }
    }

    if (!subject.venue) {
      subjectErrors.venue = 'Venue is required';
    }

    if (Object.keys(subjectErrors).length > 0) {
      errors[index] = subjectErrors;
    }
  });

  // Check for schedule conflicts
  const scheduleMap = new Map();
  scheduleData.subjects.forEach((subject, index) => {
    const key = `${subject.date}-${subject.venue}`;
    const timeSlot = {
      start: new Date(`2000-01-01T${subject.startTime}`),
      end: new Date(`2000-01-01T${subject.endTime}`),
      index
    };

    if (scheduleMap.has(key)) {
      const existingSlots = scheduleMap.get(key);
      const hasConflict = existingSlots.some(slot => {
        return (
          (timeSlot.start >= slot.start && timeSlot.start < slot.end) ||
          (timeSlot.end > slot.start && timeSlot.end <= slot.end)
        );
      });

      if (hasConflict) {
        if (!errors[index]) errors[index] = {};
        errors[index].conflict = 'Schedule conflict with another subject';
      }
    } else {
      scheduleMap.set(key, [timeSlot]);
    }
  });

  return errors;
};

export const validateExamResults = (resultsData) => {
  const errors = {};

  if (!resultsData || resultsData.length === 0) {
    errors.general = 'Results data is required';
    return errors;
  }

  resultsData.forEach((result, studentIndex) => {
    const studentErrors = {};

    if (!result.subjects || result.subjects.length === 0) {
      studentErrors.subjects = 'Subject results are required';
    } else {
      result.subjects.forEach((subject, subjectIndex) => {
        const subjectErrors = {};

        if (typeof subject.marks !== 'number' || subject.marks < 0) {
          subjectErrors.marks = 'Valid marks are required';
        }

        if (Object.keys(subjectErrors).length > 0) {
          if (!studentErrors.subjects) studentErrors.subjects = {};
          studentErrors.subjects[subjectIndex] = subjectErrors;
        }
      });
    }

    if (Object.keys(studentErrors).length > 0) {
      errors[studentIndex] = studentErrors;
    }
  });

  return errors;
};
