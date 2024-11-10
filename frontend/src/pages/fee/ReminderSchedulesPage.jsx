import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReminderSchedules, toggleScheduleStatus } from '../../redux/features/feeSlice';
import ReminderScheduleForm from '../../components/fee/ReminderScheduleForm';
import ReminderTemplateForm from '../../components/fee/ReminderTemplateForm';
import Modal from '../../components/common/Modal';
import {
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  DocumentAddIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline';

const ReminderSchedulesPage = () => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });

  const dispatch = useDispatch();
  const { schedules, templates, loading } = useSelector((state) => state.fee);

  useEffect(() => {
    dispatch(fetchReminderSchedules(filters));
  }, [dispatch, filters]);

  const handleToggleStatus = async (scheduleId) => {
    try {
      await dispatch(toggleScheduleStatus(scheduleId)).unwrap();
    } catch (error) {
      console.error('Failed to toggle schedule status:', error);
    }
  };

  const getScheduleDescription = (schedule) => {
    switch (schedule.triggerType) {
      case 'DAYS_BEFORE_DUE':
        return `${schedule.triggerValue} days before due date`;
      case 'DAYS_AFTER_DUE':
        return `${schedule.triggerValue} days after due date`;
      case 'SPECIFIC_DATE':
        return `On ${new Date(schedule.triggerValue).toLocaleDateString()}`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Fee Reminders</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentAddIcon className="h-5 w-5 mr-2 text-gray-500" />
            New Template
          </button>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Schedule
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="DAYS_BEFORE_DUE">Before Due Date</option>
              <option value="DAYS_AFTER_DUE">After Due Date</option>
              <option value="SPECIFIC_DATE">Specific Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No reminder schedules found
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {schedule.template.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {getScheduleDescription(schedule)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Frequency: {schedule.frequency.toLowerCase()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          schedule.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {schedule.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(schedule.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <SwitchHorizontalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Create Reminder Schedule"
      >
        <ReminderScheduleForm onClose={() => setIsScheduleModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Create Reminder Template"
      >
        <ReminderTemplateForm onClose={() => setIsTemplateModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ReminderSchedulesPage; 