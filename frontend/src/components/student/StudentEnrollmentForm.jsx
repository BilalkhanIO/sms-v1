import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchClasses } from '../../redux/features/academicSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const StudentEnrollmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classes, loading, error } = useSelector(state => state.academic);
  
  const [formData, setFormData] = useState({
    currentClass: '',
    section: '',
    academicYear: new Date().getFullYear().toString(),
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle enrollment submission
      navigate('/students');
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <select
            value={formData.currentClass}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              currentClass: e.target.value
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        {/* Add other form fields */}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Enroll Student
        </button>
      </div>
    </form>
  );
};

export default StudentEnrollmentForm; 