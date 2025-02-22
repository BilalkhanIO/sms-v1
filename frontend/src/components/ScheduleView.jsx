// src/components/ScheduleView.jsx

import React from "react";

const ScheduleView = ({ schedule }) => {
  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  // Check if schedule is defined and has the expected structure
  if (!schedule || !Array.isArray(schedule)) {
    return <p>No schedule data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Periods
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {daysOfWeek.map((day) => {
            const daySchedule = schedule.find((s) => s.day === day);
            return (
              <tr key={day}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {day}
                </td>
                <td className="px-6 py-4">
                  {daySchedule ? (
                    daySchedule.periods.map((period, index) => (
                      <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                        <div className="text-sm font-medium">
                          {period.subject ? period.subject.label : "N/A"}{" "}
                          {/* Display subject name */}
                        </div>
                        <div className="text-xs text-gray-600">
                          {period.teacher ? period.teacher.label : "N/A"}{" "}
                          {/* Display teacher name */}
                        </div>
                        <div className="text-xs text-gray-500">
                          {period.startTime} - {period.endTime}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No classes scheduled.
                    </p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleView;
