import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scheduleExam } from '../../redux/features/examSlice';
import { Dialog } from '@headlessui/react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ExamSchedule = ({ examId }) => {
  const dispatch = useDispatch();
  const { selectedExam, loading, error } = useSelector((state) => state.exam);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    subjects: []
  });

  useEffect(() => {
    if (selectedExam) {
      setScheduleData({
        subjects: selectedExam.subjects.map(subject => ({
          subjectId: subject.id,
          date: '',
          startTime: '',
          endTime: '',
          venue: '',
          invigilators: []
        }))
      });
    }
  }, [selectedExam]);

  const handleScheduleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await dispatch(scheduleExam({ examId, scheduleData })).unwrap();
      setShowScheduleModal(false);
    } catch (error) {
      console.error('Failed to schedule exam:', error);
    }
  }, [dispatch, examId, scheduleData]);

  const updateSubjectSchedule = (index, field, value) => {
    const updatedSubjects = [...scheduleData.subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    setScheduleData({ ...scheduleData, subjects: updatedSubjects });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Exam Schedule</h2>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Schedule Exam
          </button>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invigilators
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedExam?.subjects.map((subject, index) => (
                <tr key={subject.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.subjectName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.date ? new Date(subject.date).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.startTime && subject.endTime
                        ? `${subject.startTime} - ${subject.endTime}`
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.venue || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.invigilators?.join(', ') || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      <Dialog
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-3xl w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Schedule Exam
            </Dialog.Title>

            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              {selectedExam?.subjects.map((subject, index) => (
                <div key={subject.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">
                    {subject.subjectName}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduleData.subjects[index]?.date || ''}
                        onChange={(e) => updateSubjectSchedule(index, 'date', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={scheduleData.subjects[index]?.startTime || ''}
                        onChange={(e) => updateSubjectSchedule(index, 'startTime', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={scheduleData.subjects[index]?.endTime || ''}
                        onChange={(e) => updateSubjectSchedule(index, 'endTime', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={scheduleData.subjects[index]?.venue || ''}
                        onChange={(e) => updateSubjectSchedule(index, 'venue', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Invigilators
                      </label>
                      <input
                        type="text"
                        value={scheduleData.subjects[index]?.invigilators?.join(', ') || ''}
                        onChange={(e) => updateSubjectSchedule(
                          index,
                          'invigilators',
                          e.target.value.split(',').map(s => s.trim())
                        )}
                        placeholder="Enter invigilator names separated by commas"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ExamSchedule;
