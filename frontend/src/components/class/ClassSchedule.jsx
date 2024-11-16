import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSchedule } from '../../redux/features/classSlice';
import { ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00'
];

const ClassSchedule = ({ classId }) => {
  const dispatch = useDispatch();
  const { selectedClass, loading } = useSelector((state) => state.class);
  const [schedule, setSchedule] = useState([]);
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    day: '',
    startTime: '',
    endTime: '',
    subject: '',
    teacher: '',
    room: ''
  });

  useEffect(() => {
    if (selectedClass?.schedule) {
      setSchedule(selectedClass.schedule);
    }
  }, [selectedClass]);

  const handleAddPeriod = () => {
    const updatedSchedule = [...schedule, newPeriod];
    dispatch(updateSchedule({ classId, scheduleData: updatedSchedule }));
    setShowAddPeriod(false);
    setNewPeriod({
      day: '',
      startTime: '',
      endTime: '',
      subject: '',
      teacher: '',
      room: ''
    });
  };

  const handleDeletePeriod = (index) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    dispatch(updateSchedule({ classId, scheduleData: updatedSchedule }));
  };

  return (
    <div className="space-y-6">
      {/* Schedule Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TIME_SLOTS.map((timeSlot) => (
              <tr key={timeSlot}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {timeSlot}
                </td>
                {DAYS.map((day) => {
                  const period = schedule.find(
                    (p) => p.day === day && p.startTime === timeSlot
                  );
                  return (
                    <td key={`${day}-${timeSlot}`} className="px-6 py-4 whitespace-nowrap">
                      {period ? (
                        <div className="bg-indigo-50 p-2 rounded">
                          <div className="text-sm font-medium text-indigo-700">
                            {period.subject}
                          </div>
                          <div className="text-xs text-indigo-500">
                            {period.teacher}
                          </div>
                          <div className="text-xs text-gray-500">
                            Room: {period.room}
                          </div>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Period Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddPeriod(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Period
        </button>
      </div>

      {/* Add Period Modal */}
      {showAddPeriod && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Period</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Day</label>
                <select
                  value={newPeriod.day}
                  onChange={(e) => setNewPeriod({ ...newPeriod, day: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Day</option>
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <select
                    value={newPeriod.startTime}
                    onChange={(e) =>
                      setNewPeriod({ ...newPeriod, startTime: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Time</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <select
                    value={newPeriod.endTime}
                    onChange={(e) =>
                      setNewPeriod({ ...newPeriod, endTime: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Time</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  value={newPeriod.subject}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, subject: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Subject</option>
                  {selectedClass?.subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teacher
                </label>
                <input
                  type="text"
                  value={newPeriod.teacher}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, teacher: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room
                </label>
                <input
                  type="text"
                  value={newPeriod.room}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, room: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddPeriod(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPeriod}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Add Period
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;
