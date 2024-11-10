import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById } from '../../redux/features/studentSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { FaEdit, FaIdCard, FaFileAlt, FaChartLine } from 'react-icons/fa';

const StudentProfile = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { selectedStudent, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    }
  }, [dispatch, studentId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedStudent) return <ErrorMessage message="Student not found" />;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Student Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal and academic information
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/students/${studentId}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaEdit className="mr-2" /> Edit
            </Link>
            <Link
              to={`/students/${studentId}/id-card`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaIdCard className="mr-2" /> ID Card
            </Link>
            <Link
              to={`/students/${studentId}/transfer-certificate`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaFileAlt className="mr-2" /> Transfer Certificate
            </Link>
            <Link
              to={`/students/${studentId}/performance`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaChartLine className="mr-2" /> Performance
            </Link>
          </div>
        </div>

        {/* Basic Information */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedStudent.rollNumber}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedStudent.bloodGroup}</dd>
            </div>
          </dl>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedStudent.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedStudent.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedStudent.address.street}, {selectedStudent.address.city}, {selectedStudent.address.state} {selectedStudent.address.postalCode}, {selectedStudent.address.country}
              </dd>
            </div>
          </dl>
        </div>

        {/* Academic Information */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Academic Information</h4>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Current Class</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedStudent.currentClass?.name} - {selectedStudent.section}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedStudent.academicYear}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Admission Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedStudent.admissionDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${selectedStudent.status === 'active' ? 'bg-green-100 text-green-800' : 
                  selectedStudent.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`}
                >
                  {selectedStudent.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Parent Information */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Parent/Guardian Information</h4>
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {/* Father's Information */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Father's Information</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Name: {selectedStudent.parentInfo.father.name}</p>
                    <p>Occupation: {selectedStudent.parentInfo.father.occupation}</p>
                  </div>
                  <div>
                    <p>Phone: {selectedStudent.parentInfo.father.phone}</p>
                    <p>Email: {selectedStudent.parentInfo.father.email}</p>
                  </div>
                </div>
              </dd>
            </div>

            {/* Mother's Information */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Mother's Information</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Name: {selectedStudent.parentInfo.mother.name}</p>
                    <p>Occupation: {selectedStudent.parentInfo.mother.occupation}</p>
                  </div>
                  <div>
                    <p>Phone: {selectedStudent.parentInfo.mother.phone}</p>
                    <p>Email: {selectedStudent.parentInfo.mother.email}</p>
                  </div>
                </div>
              </dd>
            </div>

            {/* Guardian's Information */}
            {selectedStudent.parentInfo.guardian.name && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Guardian's Information</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Name: {selectedStudent.parentInfo.guardian.name}</p>
                      <p>Relationship: {selectedStudent.parentInfo.guardian.relationship}</p>
                    </div>
                    <div>
                      <p>Phone: {selectedStudent.parentInfo.guardian.phone}</p>
                      <p>Email: {selectedStudent.parentInfo.guardian.email}</p>
                    </div>
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 