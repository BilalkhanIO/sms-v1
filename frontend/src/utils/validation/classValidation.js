export const validateClassData = (data) => {
  const errors = {};

  // Basic class information validation
  if (!data.name?.trim()) {
    errors.name = 'Class name is required';
  }

  if (!data.section?.trim()) {
    errors.section = 'Section is required';
  }

  if (!data.grade?.trim()) {
    errors.grade = 'Grade is required';
  }

  if (!data.academicYear) {
    errors.academicYear = 'Academic year is required';
  }

  if (!data.teacherId) {
    errors.teacherId = 'Class teacher is required';
  }

  // Capacity validation
  if (!data.capacity) {
    errors.capacity = 'Class capacity is required';
  } else if (data.capacity < 1) {
    errors.capacity = 'Capacity must be greater than 0';
  }

  // Schedule validation
  if (data.schedule) {
    const scheduleErrors = validateSchedule(data.schedule);
    if (Object.keys(scheduleErrors).length > 0) {
      errors.schedule = scheduleErrors;
    }
  }

  return errors;
};

export const validateSchedule = (schedule) => {
  const errors = [];
  const timeSlotConflicts = new Map();

  schedule.forEach((period, index) => {
    const periodErrors = {};

    // Required fields
    if (!period.day) {
      periodErrors.day = 'Day is required';
    }

    if (!period.startTime) {
      periodErrors.startTime = 'Start time is required';
    }

    if (!period.endTime) {
      periodErrors.endTime = 'End time is required';
    }

    if (!period.subject) {
      periodErrors.subject = 'Subject is required';
    }

    // Time validation
    if (period.startTime && period.endTime) {
      const start = new Date(`1970/01/01 ${period.startTime}`);
      const end = new Date(`1970/01/01 ${period.endTime}`);

      if (end <= start) {
        periodErrors.time = 'End time must be after start time';
      }

      // Check for time slot conflicts
      const timeSlotKey = `${period.day}-${period.startTime}-${period.endTime}`;
      if (timeSlotConflicts.has(timeSlotKey)) {
        periodErrors.conflict = 'Time slot conflict with another period';
      }
      timeSlotConflicts.set(timeSlotKey, true);
    }

    if (Object.keys(periodErrors).length > 0) {
      errors[index] = periodErrors;
    }
  });

  return errors;
};

export const validateSubjectAssignment = (subject, existingSubjects) => {
  const errors = {};

  if (!subject.teacherId) {
    errors.teacherId = 'Teacher is required';
  }

  // Check for subject code uniqueness
  if (existingSubjects.some(s => s.code === subject.code && s.id !== subject.id)) {
    errors.code = 'Subject code must be unique';
  }

  // Check for teacher schedule conflicts
  const teacherScheduleConflicts = existingSubjects.some(s => 
    s.teacherId === subject.teacherId && 
    hasScheduleConflict(s.schedule, subject.schedule)
  );

  if (teacherScheduleConflicts) {
    errors.schedule = 'Teacher schedule conflict detected';
  }

  return errors;
};

export const validateStudentAssignment = (studentId, classData) => {
  const errors = {};

  // Check if class is at capacity
  if (classData.currentStrength >= classData.capacity) {
    errors.capacity = 'Class has reached maximum capacity';
  }

  // Check if student is already assigned to this class
  if (classData.students.some(s => s.id === studentId)) {
    errors.student = 'Student is already assigned to this class';
  }

  return errors;
};

const hasScheduleConflict = (schedule1, schedule2) => {
  for (const period1 of schedule1) {
    for (const period2 of schedule2) {
      if (period1.day === period2.day) {
        const start1 = new Date(`1970/01/01 ${period1.startTime}`);
        const end1 = new Date(`1970/01/01 ${period1.endTime}`);
        const start2 = new Date(`1970/01/01 ${period2.startTime}`);
        const end2 = new Date(`1970/01/01 ${period2.endTime}`);

        if (
          (start1 >= start2 && start1 < end2) ||
          (end1 > start2 && end1 <= end2) ||
          (start1 <= start2 && end1 >= end2)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
