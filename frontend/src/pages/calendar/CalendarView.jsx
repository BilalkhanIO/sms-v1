import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetEventsQuery } from '../../api/calendarApi';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Calendar, Plus } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const TYPE_COLORS = {
  GENERAL: 'bg-gray-100 text-gray-800',
  MEETING: 'bg-blue-100 text-blue-800',
  EXAM: 'bg-red-100 text-red-800',
  HOLIDAY: 'bg-green-100 text-green-800',
  SPORTS: 'bg-yellow-100 text-yellow-800',
};

const CalendarView = () => {
  const { can } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const startOfMonth = new Date(selectedMonth.year, selectedMonth.month - 1, 1).toISOString();
  const endOfMonth = new Date(selectedMonth.year, selectedMonth.month, 0, 23, 59, 59).toISOString();

  const { data: eventsRaw, isLoading, isError } = useGetEventsQuery({ start: startOfMonth, end: endOfMonth });
  const events = eventsRaw?.data || [];

  const prevMonth = () => {
    setSelectedMonth(({ year, month }) => {
      if (month === 1) return { year: year - 1, month: 12 };
      return { year, month: month - 1 };
    });
  };

  const nextMonth = () => {
    setSelectedMonth(({ year, month }) => {
      if (month === 12) return { year: year + 1, month: 1 };
      return { year, month: month + 1 };
    });
  };

  const monthName = new Date(selectedMonth.year, selectedMonth.month - 1, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div>
      <PageHeader
        title="Calendar"
        backUrl="/dashboard"
        action={
          can('calendar', 'edit') && (
            <Link
              to="/dashboard/calendar/events/create"
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Add Event
            </Link>
          )
        }
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={prevMonth} className="px-3 py-1 rounded border text-sm hover:bg-gray-50">← Prev</button>
          <h2 className="text-lg font-semibold text-gray-800">{monthName}</h2>
          <button onClick={nextMonth} className="px-3 py-1 rounded border text-sm hover:bg-gray-50">Next →</button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="p-6 text-center text-red-500 text-sm">Failed to load events.</div>
        )}

        {!isLoading && !isError && (
          <div className="divide-y divide-gray-100">
            {events.length === 0 && (
              <p className="p-6 text-center text-gray-400 text-sm">No events this month.</p>
            )}
            {events.map((event) => (
              <div key={event._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        <Link to={`/dashboard/calendar/events/${event._id}`} className="hover:text-blue-600">
                          {event.title}
                        </Link>
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[event.type] || TYPE_COLORS.GENERAL}`}>
                        {event.type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="mt-1 text-xs text-gray-500">{event.description}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {event.start ? new Date(event.start).toLocaleDateString() : '—'}
                      {event.end && ` — ${new Date(event.end).toLocaleDateString()}`}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                  {can('calendar', 'edit') && (
                    <Link
                      to={`/dashboard/calendar/events/${event._id}/edit`}
                      className="text-xs text-blue-600 hover:underline ml-4"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
