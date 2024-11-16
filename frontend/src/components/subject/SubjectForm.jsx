import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createSubject, updateSubject, fetchSubjectById } from '../../redux/features/subjectSlice';
import { fetchTeachers } from '../../redux/features/teacherSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const SubjectForm = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSubject, loading, error } = useSelector((state) => state.subject);
  const { teachers } = useSelector((state) => state.teacher);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 0,
    grade: '',
    teacherId: '',
    syllabus: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    dispatch(fetchTeachers());
    if (subjectId) {
      dispatch(fetchSubjectById(subjectId));
    }
  }, [dispatch, subjectId]);

  useEffect(() => {
    if (selectedSubject && subjectId) {
      setFormData({
        name: selectedSubject.name,
        code: selectedSubject.code,
        description: selectedSubject.description || '',
        credits: selectedSubject.credits,
        grade: selectedSubject.grade,
        teacherId: selectedSubject.teacher.id,
        syllabus: selectedSubject.syllabus || '',
        status: selectedSubject.status
      });
    }
  }, [selectedSubject, subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (subjectId) {
        await dispatch(updateSubject({ id: subjectId, data: formData })).unwrap();
      } else {
        await dispatch(createSubject(formData)).unwrap();
      }
      navigate('/subjects');
    } catch (error) {
      console.error('Failed to save subject:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject Name
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
            Subject Code
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credits
          </label>
          <input
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            min="0"
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Syllabus
          </label>
          <textarea
            value={formData.syllabus}
            onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/subjects')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          {subjectId ? 'Update Subject' : 'Create Subject'}
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
