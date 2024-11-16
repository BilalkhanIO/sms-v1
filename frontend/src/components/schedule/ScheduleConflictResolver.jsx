import { useState, useEffect } from 'react';
import { detectTimeConflicts, detectTeacherConflicts, detectRoomConflicts } from '../../utils/scheduleUtils';

const ScheduleConflictResolver = ({ period, existingPeriods, onResolve }) => {
  const [conflicts, setConflicts] = useState({
    time: false,
    teacher: false,
    room: false
  });

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const timeConflict = detectTimeConflicts(existingPeriods, period);
    const teacherConflict = detectTeacherConflicts(existingPeriods, period);
    const roomConflict = detectRoomConflicts(existingPeriods, period);

    setConflicts({
      time: timeConflict,
      teacher: teacherConflict,
      room: roomConflict
    });

    // Generate suggestions based on conflicts
    generateSuggestions(timeConflict, teacherConflict, roomConflict);
  }, [period, existingPeriods]);

  const generateSuggestions = (timeConflict, teacherConflict, roomConflict) => {
    const newSuggestions = [];

    if (timeConflict) {
      // Suggest alternative time slots
      const availableSlots = findAvailableTimeSlots(existingPeriods, period);
      newSuggestions.push(...availableSlots.map(slot => ({
        type: 'time',
        ...slot
      })));
    }

    if (teacherConflict) {
      // Suggest alternative teachers
      const availableTeachers = findAvailableTeachers(existingPeriods, period);
      newSuggestions.push(...availableTeachers.map(teacher => ({
        type: 'teacher',
        ...teacher
      })));
    }

    if (roomConflict) {
      // Suggest alternative rooms
      const availableRooms = findAvailableRooms(existingPeriods, period);
      newSuggestions.push(...availableRooms.map(room => ({
        type: 'room',
        ...room
      })));
    }

    setSuggestions(newSuggestions);
  };

  const handleSuggestionSelect = (suggestion) => {
    const resolvedPeriod = {
      ...period,
      ...(suggestion.type === 'time' && {
        startTime: suggestion.startTime,
        endTime: suggestion.endTime
      }),
      ...(suggestion.type === 'teacher' && {
        teacher: suggestion.teacher
      }),
      ...(suggestion.type === 'room' && {
        room: suggestion.room
      })
    };

    onResolve(resolvedPeriod);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Schedule Conflicts Detected
      </h3>

      {/* Conflict Messages */}
      <div className="space-y-2 mb-4">
        {conflicts.time && (
          <p className="text-red-600">
            Time slot conflict detected
          </p>
        )}
        {conflicts.teacher && (
          <p className="text-red-600">
            Teacher is already scheduled for this time
          </p>
        )}
        {conflicts.room && (
          <p className="text-red-600">
            Room is already occupied during this time
          </p>
        )}
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">
          Suggested Resolutions:
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionSelect(suggestion)}
              className="p-4 border rounded-lg hover:bg-gray-50 text-left"
            >
              {suggestion.type === 'time' && (
                <div>
                  <p className="font-medium">Alternative Time Slot</p>
                  <p className="text-sm text-gray-500">
                    {suggestion.startTime} - {suggestion.endTime}
                  </p>
                </div>
              )}
              {suggestion.type === 'teacher' && (
                <div>
                  <p className="font-medium">Alternative Teacher</p>
                  <p className="text-sm text-gray-500">
                    {suggestion.teacher.name}
                  </p>
                </div>
              )}
              {suggestion.type === 'room' && (
                <div>
                  <p className="font-medium">Alternative Room</p>
                  <p className="text-sm text-gray-500">
                    {suggestion.room}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleConflictResolver;
