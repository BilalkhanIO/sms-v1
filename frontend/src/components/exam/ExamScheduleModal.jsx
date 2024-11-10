import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { scheduleExam } from '../../redux/features/examSlice';

const ExamScheduleModal = ({ exam, onClose }) => {
  const [scheduleData, setScheduleData] = useState({
    examId: exam?.id,
    schedules: exam?.subjects.map(subject => ({
      subjectId: subject.id,
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      invigilators: [],
    })) || [],
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(scheduleExam(scheduleData)).unwrap();
      onClose();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {scheduleData.schedules.map((schedule, index) => (
          <div
            key={schedule.subjectId}
            className="bg-gray-50 p-4 rounded-lg mb-4"
          >
            <h4 className="font-medium text-gray-900 mb-4">
              {exam.subjects[index].name}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={schedule.date}
                  onChange={(e) => {
                    const newSchedules = [...scheduleData.schedules];
                    newSchedules[index].date = e.target.value;
                    setScheduleData({ ...scheduleData, schedules: newSchedules });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => {
                    const newSchedules = [...scheduleData.schedules];
                    newSchedules[index].startTime = e.target.value;
                    setScheduleData({ ...scheduleData, schedules: newSchedules });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => {
                    const newSchedules = [...scheduleData.schedules];
                    newSchedules[index].endTime = e.target.value;
                    setScheduleData({ ...scheduleData, schedules: newSchedules });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venue
                </label>
                <input
                  type="text"
                  value={schedule.venue}
                  onChange={(e) => {
                    const newSchedules = [...scheduleData.schedules];
                    newSchedules[index].venue = e.target.value;
                    setScheduleData({ ...scheduleData, schedules: newSchedules });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Schedule Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamScheduleModal; 