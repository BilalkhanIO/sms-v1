import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';

const PeriodModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  period,
  timeSlot,
  day
}) => {
  const { subjects } = useSelector((state) => state.subject);
  const { teachers } = useSelector((state) => state.teacher);

  const [formData, setFormData] = useState({
    subjectId: '',
    teacherId: '',
    room: ''
  });

  useEffect(() => {
    if (period) {
      setFormData({
        subjectId: period.subject.id,
        teacherId: period.teacher.id,
        room: period.room
      });
    }
  }, [period]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            {period ? 'Edit Period' : 'Add Period'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <p className="mt-1 text-sm text-gray-500">
                {day}, {timeSlot?.startTime} - {timeSlot?.endTime}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
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
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                {period && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                )}
              </div>
              <div className="space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {period ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default PeriodModal;
