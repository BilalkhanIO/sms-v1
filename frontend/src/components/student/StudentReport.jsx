import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentById } from '../../redux/features/studentSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const StudentReport = ({ studentId }) => {
  const dispatch = useDispatch();
  const { selectedStudent, loading, error } = useSelector(state => state.student);

  useEffect(() => {
    if (studentId) {
      dispatch(getStudentById(studentId));
    }
  }, [dispatch, studentId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedStudent) return <ErrorMessage message="Student not found" />;

  return (
    <div className="space-y-6">
      {/* Student Report Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Student Report
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {/* Add report content */}
        </div>
      </div>
    </div>
  );
};

export default StudentReport; 