import { useSelector } from 'react-redux';

const UpcomingClasses = () => {
  const classes = useSelector((state) => state.dashboard.upcomingClasses);

  return (
    <div className="space-y-4">
      {classes?.map((classItem) => (
        <div
          key={classItem.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
            <p className="text-sm text-gray-500">{classItem.class}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{classItem.time}</p>
            <p className="text-sm text-gray-500">{classItem.duration}</p>
          </div>
        </div>
      ))}
      {!classes?.length && (
        <p className="text-gray-500 text-center">No upcoming classes</p>
      )}
    </div>
  );
};

export default UpcomingClasses; 