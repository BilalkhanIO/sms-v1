export const detectTimeConflicts = (periods, newPeriod) => {
  return periods.some(period => 
    period.id !== newPeriod.id && // Skip same period
    period.day === newPeriod.day && // Same day
    isTimeOverlapping(
      period.startTime,
      period.endTime,
      newPeriod.startTime,
      newPeriod.endTime
    )
  );
};

export const detectTeacherConflicts = (periods, newPeriod) => {
  return periods.some(period =>
    period.id !== newPeriod.id &&
    period.day === newPeriod.day &&
    period.teacher.id === newPeriod.teacher.id &&
    isTimeOverlapping(
      period.startTime,
      period.endTime,
      newPeriod.startTime,
      newPeriod.endTime
    )
  );
};

export const detectRoomConflicts = (periods, newPeriod) => {
  return periods.some(period =>
    period.id !== newPeriod.id &&
    period.day === newPeriod.day &&
    period.room === newPeriod.room &&
    isTimeOverlapping(
      period.startTime,
      period.endTime,
      newPeriod.startTime,
      newPeriod.endTime
    )
  );
};

const isTimeOverlapping = (start1, end1, start2, end2) => {
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return (start1Min < end2Min && end1Min > start2Min);
};

export const generateTimeSlots = (startTime, endTime, duration = 60) => {
  const slots = [];
  let currentTime = new Date(`1970-01-01T${startTime}`);
  const endDateTime = new Date(`1970-01-01T${endTime}`);

  while (currentTime < endDateTime) {
    const start = currentTime.toTimeString().slice(0, 5);
    currentTime.setMinutes(currentTime.getMinutes() + duration);
    const end = currentTime.toTimeString().slice(0, 5);

    slots.push({
      startTime: start,
      endTime: end
    });
  }

  return slots;
};

export const formatScheduleForExport = (schedule) => {
  const formattedSchedule = {
    class: schedule.className,
    academicYear: schedule.academicYear,
    term: schedule.term,
    periods: {}
  };

  DAYS_OF_WEEK.forEach(day => {
    formattedSchedule.periods[day] = schedule.periods
      .filter(period => period.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map(period => ({
        time: `${period.startTime} - ${period.endTime}`,
        subject: period.subject.name,
        teacher: period.teacher.name,
        room: period.room
      }));
  });

  return formattedSchedule;
};
