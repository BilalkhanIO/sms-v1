import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStudent } from '../../redux/features/studentSlice';

const StudentAcademicForm = ({ student, onClose }) => {
  const [formData, setFormData] = useState({
    class: student.academicInfo?.class || '',
    section: student.academicInfo?.section || '',
    rollNumber: student.academicInfo?.rollNumber || '',
    previousSchool: student.academicInfo?.previousSchool || '',
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateStudent({
        id: student.id,
        data: { academicInfo: formData }
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update academic info:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Class</label>
        <input
          type="text"
          value={formData.class}
          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Section</label>
        <input
          type="text"
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Roll Number</label>
        <input
          type="text"
          value={formData.rollNumber}
          onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Previous School</label>
        <input
          type="text"
          value={formData.previousSchool}
          onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

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
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default StudentAcademicForm;
