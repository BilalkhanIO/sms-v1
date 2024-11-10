import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentById } from '../../redux/features/studentSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StudentProfileForm from '../../components/student/StudentProfileForm';

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { selectedStudent, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    if (studentId) {
      dispatch(getStudentById(studentId));
    }
  }, [dispatch, studentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedStudent) {
    return <ErrorMessage message="Student not found" />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Student Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal and academic information
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              {/* Basic Information */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Admission Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.admissionNumber}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Class</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.class?.name} - {selectedStudent.section}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.rollNumber}
                </dd>
              </div>

              {/* Parent Information */}
              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <h4 className="text-md font-medium text-gray-900">Parent Information</h4>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Father's Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.parentInfo?.fatherName}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Mother's Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.parentInfo?.motherName}
                </dd>
              </div>

              {/* Contact Information */}
              <div className="bg-white px-4 py-5 sm:px-6">
                <h4 className="text-md font-medium text-gray-900">Contact Information</h4>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.address?.street}, {selectedStudent.address?.city}
                  <br />
                  {selectedStudent.address?.state}, {selectedStudent.address?.country}
                  <br />
                  {selectedStudent.address?.postalCode}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Contact Numbers</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>Father: {selectedStudent.parentInfo?.fatherContact}</p>
                  <p>Mother: {selectedStudent.parentInfo?.motherContact}</p>
                  {selectedStudent.parentInfo?.guardianContact && (
                    <p>Guardian: {selectedStudent.parentInfo.guardianContact}</p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage; 