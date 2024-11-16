import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchSubjectById } from '../../redux/features/subjectSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SubjectMaterials from './SubjectMaterials';
import SubjectPerformance from './SubjectPerformance';
import { 
  UserGroupIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  DocumentTextIcon 
} from '@heroicons/react/outline';

const SubjectDetails = () => {
  const { subjectId } = useParams();
  const dispatch = useDispatch();
  const { selectedSubject, loading, error } = useSelector((state) => state.subject);

  useEffect(() => {
    if (subjectId) {
      dispatch(fetchSubjectById(subjectId));
    }
  }, [dispatch, subjectId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedSubject) return <ErrorMessage message="Subject not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedSubject.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Code: {selectedSubject.code} | Grade: {selectedSubject.grade}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              selectedSubject.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {selectedSubject.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Teacher</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSubject.teacher.name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpenIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Credits</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSubject.credits}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Classes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSubject.classes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Materials</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedSubject.materials?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Syllabus */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          About the Subject
        </h3>
        <div className="prose max-w-none">
          <h4 className="text-base font-medium text-gray-900">Description</h4>
          <p className="mt-2 text-gray-500">{selectedSubject.description}</p>

          <h4 className="mt-6 text-base font-medium text-gray-900">Syllabus</h4>
          <p className="mt-2 text-gray-500">{selectedSubject.syllabus}</p>
        </div>
      </div>

      {/* Materials Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <SubjectMaterials subjectId={subjectId} />
      </div>

      {/* Performance Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <SubjectPerformance subjectId={subjectId} />
      </div>
    </div>
  );
};

export default SubjectDetails;
