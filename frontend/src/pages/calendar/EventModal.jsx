import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/common/Modal';
import { useToast } from '../../contexts/ToastContext';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  clearSelectedEvent,
} from '../../redux/features/calendarSlice';

const EventModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const selectedEvent = useSelector((state) => state.calendar.selectedEvent);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'general',
  });

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        start: selectedEvent.start ? new Date(selectedEvent.start).toISOString().slice(0, 16) : '',
        end: selectedEvent.end ? new Date(selectedEvent.end).toISOString().slice(0, 16) : '',
        type: selectedEvent.type || 'general',
      });
    }
  }, [selectedEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent?.id) {
        await dispatch(updateEvent({ id: selectedEvent.id, eventData: formData })).unwrap();
        addToast('Event updated successfully', 'success');
      } else {
        await dispatch(createEvent(formData)).unwrap();
        addToast('Event created successfully', 'success');
      }
      handleClose();
    } catch (error) {
      addToast(error.message || 'Failed to save event', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(selectedEvent.id)).unwrap();
      addToast('Event deleted successfully', 'success');
      handleClose();
    } catch (error) {
      addToast(error.message || 'Failed to delete event', 'error');
    }
  };

  const handleClose = () => {
    dispatch(clearSelectedEvent());
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      type: 'general',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedEvent?.id ? 'Edit Event' : 'Create Event'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start</label>
            <input
              type="datetime-local"
              required
              value={formData.start}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End</label>
            <input
              type="datetime-local"
              required
              value={formData.end}
              onChange={(e) => setFormData({ ...formData, end: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="general">General</option>
            <option value="meeting">Meeting</option>
            <option value="exam">Exam</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          {selectedEvent?.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            {selectedEvent?.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal; 