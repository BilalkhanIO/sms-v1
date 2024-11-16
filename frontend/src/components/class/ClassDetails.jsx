import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchClassById } from '../../redux/features/classSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ClassSchedule from './ClassSchedule';
import ClassStudents from './ClassStudents';
import ClassSubjects from './ClassSubjects';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  ClockIcon,
  CalendarIcon 
} from '@heroicons/react/outline';

const ClassDetails = () => {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const { selectedClass, loading, error } = useSelector((state) => state.class);

  useEffect(() => {
    if (classId) {
      dispatch(fetchClassById(classId));
    }
  }, [dispatch, classId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedClass) return <ErrorMessage message="Class not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedClass.name} - {selectedClass.section}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Grade {selectedClass.grade} | Academic Year {selectedClass.academicYear}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              selectedClass.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {selectedClass.status}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Students</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedClass.currentStrength} / {selectedClass.capacity}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Subjects</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedClass.subjects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Class Teacher</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedClass.teacher.name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Schedule</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedClass.schedule.length} Periods
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <a
              href="#schedule"
              className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm"
            >
              Schedule
            </a>
            <a
              href="#students"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm"
            >
              Students
            </a>
            <a
              href="#subjects"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm"
            >
              Subjects
            </a>
          </nav>
        </div>

        <div className="p-6">
          <div id="schedule">
            <ClassSchedule classId={classId} />
          </div>
          <div id="students" className="hidden">
            <ClassStudents classId={classId} />
          </div>
          <div id="subjects" className="hidden">
            <ClassSubjects classId={classId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
