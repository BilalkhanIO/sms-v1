import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExam, scheduleExam } from '../../redux/features/examSlice';
import Modal from '../../components/common/Modal';
import {
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline';

const ExamManagementPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [examData, setExamData] = useState({
    title: '',
    type: 'REGULAR', // REGULAR, MIDTERM, FINAL
    subjects: [],
    totalMarks: 100,
    passingMarks: 40,
    instructions: '',
    duration: 180, // in minutes
  });

  const dispatch = useDispatch();
  const { exams, loading } = useSelector((state) => state.exam);
  const { subjects } = useSelector((state) => state.academic);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createExam(examData)).unwrap();
      setIsCreateModalOpen(false);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Exam Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Exam
          </button>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Schedule Exam
          </button>
        </div>
      </div>

      {/* Exam List */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-lg font-medium text-gray-900">
                        {exam.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{exam.type}</span>
                      <span>•</span>
                      <span>{exam.subjects.length} Subjects</span>
                      <span>•</span>
                      <span>{exam.duration} minutes</span>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {/* Handle edit */}}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Exam Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Exam"
      >
        <form onSubmit={handleCreateExam} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exam Title
            </label>
            <input
              type="text"
              value={examData.title}
              onChange={(e) =>
                setExamData({ ...examData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exam Type
            </label>
            <select
              value={examData.type}
              onChange={(e) =>
                setExamData({ ...examData, type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="REGULAR">Regular</option>
              <option value="MIDTERM">Midterm</option>
              <option value="FINAL">Final</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subjects
            </label>
            <div className="mt-2 space-y-2">
              {subjects.map((subject) => (
                <label key={subject.id} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={examData.subjects.includes(subject.id)}
                    onChange={(e) => {
                      const newSubjects = e.target.checked
                        ? [...examData.subjects, subject.id]
                        : examData.subjects.filter((id) => id !== subject.id);
                      setExamData({ ...examData, subjects: newSubjects });
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {subject.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Marks
              </label>
              <input
                type="number"
                value={examData.totalMarks}
                onChange={(e) =>
                  setExamData({ ...examData, totalMarks: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Passing Marks
              </label>
              <input
                type="number"
                value={examData.passingMarks}
                onChange={(e) =>
                  setExamData({ ...examData, passingMarks: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={examData.duration}
              onChange={(e) =>
                setExamData({ ...examData, duration: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              value={examData.instructions}
              onChange={(e) =>
                setExamData({ ...examData, instructions: e.target.value })
              }
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Create Exam
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamManagementPage; 