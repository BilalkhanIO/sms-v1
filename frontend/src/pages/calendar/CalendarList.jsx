import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetEventsQuery } from '../../api/calendarApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Calendar, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const CalendarList = () => {
  const { can } = useAuth();
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: eventsRaw, isLoading, error } = useGetEventsQuery({
    ...filters,
    search: searchTerm
  });
  const events = eventsRaw?.data || eventsRaw || [];

  if (isLoading) return <Spinner size="large" />;
  if (error) return <div className="text-red-500">Error loading events.</div>;

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'GENERAL', label: 'General' },
    { value: 'EXAM', label: 'Exam' },
    { value: 'HOLIDAY', label: 'Holiday' },
    { value: 'MEETING', label: 'Meeting' },
    { value: 'SPORTS', label: 'Sports' },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'EXAM': return 'bg-purple-100 text-purple-800';
      case 'HOLIDAY': return 'bg-green-100 text-green-800';
      case 'MEETING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Calendar Events" backUrl="/dashboard/calendar">
        {can('calendar', 'edit') && (
          <Link to="/dashboard/calendar/events/create">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </Link>
        )}
      </PageHeader>

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
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <input
          type="month"
          value={`${filters.year}-${filters.month.toString().padStart(2, '0')}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split('-');
            setFilters(prev => ({ ...prev, year: parseInt(year), month: parseInt(month) }));
          }}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/dashboard/calendar/events/${event._id}`} className="hover:text-blue-600">
                      {event.title}
                    </Link>
                  </h3>
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {event.start ? new Date(event.start).toLocaleDateString() : '—'}
                      {event.end && ` — ${new Date(event.end).toLocaleDateString()}`}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
                {can('calendar', 'edit') && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard/calendar/events/${event._id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          {events.length === 0 && (
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
