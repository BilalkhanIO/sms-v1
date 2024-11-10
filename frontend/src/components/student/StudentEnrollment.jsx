import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStudentById, updateStudent } from '../../redux/features/studentSlice';
import { fetchClasses } from '../../redux/features/classSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const StudentEnrollment = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedStudent, loading, error } = useSelector(state => state.student);
  const { classes, loading: classesLoading } = useSelector(state => state.class);
  
  const [enrollmentData, setEnrollmentData] = useState({
    currentClass: '',
    section: '',
    academicYear: new Date().getFullYear().toString(),
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
      dispatch(fetchClasses());
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (selectedStudent) {
      setEnrollmentData(prev => ({
        ...prev,
        currentClass: selectedStudent.currentClass?._id || '',
        section: selectedStudent.section || '',
        status: selectedStudent.status || 'active'
      }));
    }
  }, [selectedStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateStudent({ 
        id: studentId, 
        data: enrollmentData 
      })).unwrap();
      
      navigate(`/students/${studentId}`);
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
  };

  if (loading || classesLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Student Enrollment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                value={enrollmentData.currentClass}
                onChange={(e) => setEnrollmentData(prev => ({
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

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <input
                type="text"
                value={enrollmentData.section}
                onChange={(e) => setEnrollmentData(prev => ({
                  ...prev,
                  section: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <input
                type="text"
                value={enrollmentData.academicYear}
                onChange={(e) => setEnrollmentData(prev => ({
                  ...prev,
                  academicYear: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enrollment Date
              </label>
              <input
                type="date"
                value={enrollmentData.enrollmentDate}
                onChange={(e) => setEnrollmentData(prev => ({
                  ...prev,
                  enrollmentDate: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={enrollmentData.status}
                onChange={(e) => setEnrollmentData(prev => ({
                  ...prev,
                  status: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="transferred">Transferred</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enroll Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentEnrollment; 