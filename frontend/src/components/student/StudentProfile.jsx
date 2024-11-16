import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchStudentById } from '../../redux/features/studentSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { formatStudentData } from '../../utils/student';
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

  const student = formatStudentData(selectedStudent);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaEdit className="mr-2" /> Edit
            </Link>
            <Link
              to={`/students/${studentId}/id-card`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaIdCard className="mr-2" /> ID Card
            </Link>
            <Link
              to={`/students/${studentId}/performance`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
              <dd className="mt-1 text-sm text-gray-900">{student.fullName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.rollNumber}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.dateOfBirth}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.age} years</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.bloodGroup}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.gender}</dd>
            </div>
          </dl>
        </div>

        {/* Academic Information */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Academic Information</h4>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Class</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student.currentClass?.name} - {student.section}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.academicYear}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Admission Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.admissionDate}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {student.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student.address?.street}, {student.address?.city}<br />
                {student.address?.state}, {student.address?.country}<br />
                {student.address?.postalCode}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.phone}</dd>
            </div>
          </dl>
        </div>

        {/* Guardian Information */}
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Guardian Information</h4>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Guardian Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.guardianInfo?.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Relationship</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.guardianInfo?.relationship}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Guardian Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.guardianInfo?.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Guardian Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.guardianInfo?.email}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 