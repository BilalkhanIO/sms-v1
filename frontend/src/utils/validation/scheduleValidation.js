import { DAYS_OF_WEEK, DEFAULT_TIME_SLOTS } from '../../constants/schedule';

export const validateSchedule = (scheduleData) => {
  const errors = {};

  // Basic validation
  if (!scheduleData.classId) {
    errors.classId = 'Class is required';
  }

  if (!scheduleData.academicYear) {
    errors.academicYear = 'Academic year is required';
  }

  if (!scheduleData.term) {
    errors.term = 'Term is required';
  }

  // Validate periods if present
  if (scheduleData.periods && scheduleData.periods.length > 0) {
    const periodErrors = validatePeriods(scheduleData.periods);
    if (Object.keys(periodErrors).length > 0) {
      errors.periods = periodErrors;
    }
  }

  return errors;
};

export const validatePeriod = (periodData) => {
  const errors = {};

  // Basic validation
  if (!periodData.day || !DAYS_OF_WEEK.includes(periodData.day)) {
    errors.day = 'Valid day is required';
  }

  if (!periodData.startTime) {
    errors.startTime = 'Start time is required';
  }

  if (!periodData.endTime) {
    errors.endTime = 'End time is required';
  }

  // Validate time format and range
  if (periodData.startTime && periodData.endTime) {
    const start = new Date(`1970-01-01T${periodData.startTime}`);
    const end = new Date(`1970-01-01T${periodData.endTime}`);

    if (end <= start) {
      errors.time = 'End time must be after start time';
    }

    // Check if time slot is valid
    const isValidTimeSlot = DEFAULT_TIME_SLOTS.some(
      slot => slot.startTime === periodData.startTime && slot.endTime === periodData.endTime
    );

    if (!isValidTimeSlot) {
      errors.time = 'Invalid time slot';
    }
  }

  if (!periodData.subjectId) {
    errors.subjectId = 'Subject is required';
  }

  if (!periodData.teacherId) {
    errors.teacherId = 'Teacher is required';
  }

  if (!periodData.room) {
    errors.room = 'Room is required';
  }

  return errors;
};

export const validatePeriods = (periods) => {
  const errors = {};
  const timeSlotMap = new Map();

  periods.forEach((period, index) => {
    // Validate individual period
    const periodErrors = validatePeriod(period);
    if (Object.keys(periodErrors).length > 0) {
      errors[index] = periodErrors;
    }

    // Check for conflicts
    const timeKey = `${period.day}-${period.startTime}`;
    if (timeSlotMap.has(timeKey)) {
      if (!errors[index]) errors[index] = {};
      errors[index].conflict = 'Time slot conflict with another period';
    }
    timeSlotMap.set(timeKey, true);
  });

  return errors;
};
