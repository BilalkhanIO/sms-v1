import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createClass, updateClass, fetchClassById } from '../../redux/features/classSlice';
import { fetchTeachers } from '../../redux/features/teacherSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ClassForm = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedClass, loading, error } = useSelector((state) => state.class);
  const { teachers } = useSelector((state) => state.teacher);

  const [formData, setFormData] = useState({
    name: '',
    section: '',
    grade: '',
    academicYear: new Date().getFullYear().toString(),
    teacherId: '',
    capacity: 30,
    status: 'ACTIVE'
  });

  useEffect(() => {
    dispatch(fetchTeachers());
    if (classId) {
      dispatch(fetchClassById(classId));
    }
  }, [dispatch, classId]);

  useEffect(() => {
    if (selectedClass && classId) {
      setFormData({
        name: selectedClass.name,
        section: selectedClass.section,
        grade: selectedClass.grade,
        academicYear: selectedClass.academicYear,
        teacherId: selectedClass.teacher.id,
        capacity: selectedClass.capacity,
        status: selectedClass.status
      });
    }
  }, [selectedClass, classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (classId) {
        await dispatch(updateClass({ id: classId, data: formData })).unwrap();
      } else {
        await dispatch(createClass(formData)).unwrap();
      }
      navigate('/classes');
    } catch (error) {
      console.error('Failed to save class:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Section
          </label>
          <input
            type="text"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Grade
          </label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <input
            type="text"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class Teacher
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
            Capacity
          </label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/classes')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          {classId ? 'Update Class' : 'Create Class'}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
