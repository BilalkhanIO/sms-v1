import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { format } from 'date-fns';

const UpcomingClasses = () => {
  const [classes, setClasses] = useState([]);
  const { loading, error, execute: fetchClasses } = useApi(
    dashboardService.getUpcomingClasses
  );

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchClasses();
        setClasses(data);
      } catch (error) {
        console.error('Failed to load upcoming classes:', error);
      }
    };

    loadClasses();
  }, [fetchClasses]);

  if (loading) return <LoadingSpinner size="small" />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="space-y-4">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
            <p className="text-sm text-gray-500">{classItem.teacher}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {format(new Date(classItem.startTime), 'h:mm a')}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(classItem.date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      ))}
      {classes.length === 0 && (
        <p className="text-center text-gray-500">No upcoming classes</p>
      )}
    </div>
  );
};

export default UpcomingClasses; 