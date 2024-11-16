import { useMemo } from 'react';
import { DAYS_OF_WEEK } from '../../constants/schedule';

const ScheduleListView = ({ schedule }) => {
  const organizedPeriods = useMemo(() => {
    return DAYS_OF_WEEK.map(day => ({
      day,
      periods: schedule.periods
        .filter(p => p.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    }));
  }, [schedule.periods]);

  return (
    <div className="space-y-8">
      {organizedPeriods.map(({ day, periods }) => (
        <div key={day} className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{day}</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {periods.map((period) => (
                <li key={period.id} className="px-4 py-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {period.startTime} - {period.endTime}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-900">{period.subject.name}</p>
                        <p className="text-sm text-gray-500">
                          Teacher: {period.teacher.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Room: {period.room}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {periods.length === 0 && (
                <li className="px-4 py-4 text-sm text-gray-500 italic">
                  No periods scheduled
                </li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleListView;
