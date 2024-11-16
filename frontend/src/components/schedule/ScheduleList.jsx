import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSchedules } from '../../redux/features/scheduleSlice';
import { 
  CalendarIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/react/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ScheduleList = () => {
  const dispatch = useDispatch();
  const { schedules, loading, error } = useSelector(state => state.schedule);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Class Schedules</h2>
        <Link
          to="/schedules/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <CalendarIcon className="h-5 w-5 mr-2" />
          Create Schedule
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {schedule.className}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {schedule.academicYear} - {schedule.term}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    schedule.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {schedule.status}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {schedule.periods.length} Periods
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Link
                  to={`/schedules/${schedule.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <CalendarIcon className="h-5 w-5" />
                </Link>
                <Link
                  to={`/schedules/${schedule.id}/edit`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => {/* Handle delete */}}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;
