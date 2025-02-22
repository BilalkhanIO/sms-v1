import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetEventsQuery } from '../../api/calendarApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Calendar, Filter, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const CalendarList = () => {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: events, isLoading, error } = useGetEventsQuery({
    ...filters,
    search: searchTerm
  });

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'academic', label: 'Academic' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'exam', label: 'Exam' },
    { value: 'activity', label: 'Activity' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Calendar">
        {isAdmin && (
          <Link to="/dashboard/calendar/create">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </Link>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        >
          {eventTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={`${filters.year}-${filters.month.toString().padStart(2, '0')}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split('-');
            setFilters(prev => ({
              ...prev,
              year: parseInt(year),
              month: parseInt(month)
            }));
          }}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      {/* Events List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {events?.map((event) => (
            <div key={event.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/dashboard/calendar/${event.id}`} className="hover:text-blue-600">
                      {event.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </span>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${event.type === 'academic' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'holiday' ? 'bg-green-100 text-green-800' :
                        event.type === 'exam' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'}
                    `}>
                      {event.type}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard/calendar/${event.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          {events?.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No events found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarList; 