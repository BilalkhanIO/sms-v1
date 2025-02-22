import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetEventByIdQuery, useDeleteEventMutation } from '../../api/calendarApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Calendar, MapPin, Clock, Users, Repeat, Trash, Edit } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { format } from 'date-fns';
import Modal from '../../components/common/Modal';
import { useState } from 'react';

const CalendarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: event, isLoading, error } = useGetEventByIdQuery(id);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteEvent(id).unwrap();
      navigate('/dashboard/calendar');
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formatDate = (date, isAllDay = false) => {
    return format(new Date(date), isAllDay ? 'PPP' : 'PPP p');
  };

  const getRecurrenceText = (recurrence) => {
    if (!recurrence || recurrence.frequency === 'NONE') return 'No recurrence';
    
    const frequencyText = {
      DAILY: 'Daily',
      WEEKLY: 'Weekly',
      MONTHLY: 'Monthly'
    }[recurrence.frequency];

    return `${frequencyText}, every ${recurrence.interval} ${recurrence.frequency.toLowerCase()}(s)${
      recurrence.endDate ? ` until ${format(new Date(recurrence.endDate), 'PPP')}` : ''
    }`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Event Details"
        backButton
      >
        {isAdmin && (
          <div className="flex space-x-4">
            <Link to={`/dashboard/calendar/${id}/edit`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${event.type === 'EXAM' ? 'bg-purple-100 text-purple-800' :
                event.type === 'HOLIDAY' ? 'bg-green-100 text-green-800' :
                event.type === 'MEETING' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'}
            `}>
              {event.type}
            </span>
          </div>

          {event.description && (
            <p className="mt-4 text-gray-600">{event.description}</p>
          )}

          <div className="mt-6 space-y-4">
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3" />
              <div>
                <div>{formatDate(event.startDate, event.isAllDay)}</div>
                {event.endDate && (
                  <div className="text-gray-500">
                    to {formatDate(event.endDate, event.isAllDay)}
                  </div>
                )}
              </div>
            </div>

            {event.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{event.location}</span>
              </div>
            )}

            {event.recurrence && event.recurrence.frequency !== 'NONE' && (
              <div className="flex items-center text-gray-600">
                <Repeat className="w-5 h-5 mr-3" />
                <span>{getRecurrenceText(event.recurrence)}</span>
              </div>
            )}

            {event.participants && event.participants.length > 0 && (
              <div className="flex items-start text-gray-600">
                <Users className="w-5 h-5 mr-3 mt-1" />
                <div>
                  <div className="font-medium mb-2">Participants</div>
                  <div className="grid grid-cols-2 gap-2">
                    {event.participants.map((participant) => (
                      <div key={participant.value} className="text-sm">
                        {participant.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete this event? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarDetails; 