import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchEvents, setSelectedEvent } from '../../redux/features/calendarSlice';
import EventModal from './EventModal';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);
  const [showEventModal, setShowEventModal] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    dispatch(fetchEvents())
      .unwrap()
      .catch((error) => {
        addToast(error.message || 'Failed to fetch events', 'error');
      });
  }, [dispatch, addToast]);

  const handleSelectSlot = ({ start, end }) => {
    dispatch(setSelectedEvent({ start, end }));
    setShowEventModal(true);
  };

  const handleSelectEvent = (event) => {
    dispatch(setSelectedEvent(event));
    setShowEventModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your schedule and events
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 250px)' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>

      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
    </div>
  );
};

export default CalendarPage; 