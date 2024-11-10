import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReminderSchedule } from '../../redux/features/feeSlice';
import { CalendarIcon, ClockIcon } from '@heroicons/react/outline';

const ReminderScheduleForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    templateId: '',
    triggerType: 'DAYS_BEFORE_DUE', // DAYS_BEFORE_DUE, DAYS_AFTER_DUE, SPECIFIC_DATE
    triggerValue: 5,
    frequency: 'ONCE', // ONCE, DAILY, WEEKLY
    classes: [],
    active: true,
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.fee.reminderTemplates);
  const classes = useSelector((state) => state.class.classes);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.templateId) newErrors.templateId = 'Template is required';
    if (!formData.triggerValue) newErrors.triggerValue = 'Trigger value is required';
    if (formData.classes.length === 0) newErrors.classes = 'Select at least one class';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(createReminderSchedule(formData)).unwrap();
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reminder Template
          </label>
          <select
            value={formData.templateId}
            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {errors.templateId && (
            <p className="mt-1 text-sm text-red-600">{errors.templateId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trigger Type
          </label>
          <select
            value={formData.triggerType}
            onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="DAYS_BEFORE_DUE">Days Before Due Date</option>
            <option value="DAYS_AFTER_DUE">Days After Due Date</option>
            <option value="SPECIFIC_DATE">Specific Date</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {formData.triggerType === 'SPECIFIC_DATE' ? 'Date' : 'Days'}
          </label>
          {formData.triggerType === 'SPECIFIC_DATE' ? (
            <input
              type="date"
              value={formData.triggerValue}
              onChange={(e) =>
                setFormData({ ...formData, triggerValue: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          ) : (
            <input
              type="number"
              value={formData.triggerValue}
              onChange={(e) =>
                setFormData({ ...formData, triggerValue: parseInt(e.target.value) })
              }
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
          {errors.triggerValue && (
            <p className="mt-1 text-sm text-red-600">{errors.triggerValue}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="ONCE">Once</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apply to Classes
          </label>
          <div className="mt-2 space-y-2">
            {classes.map((cls) => (
              <label key={cls.id} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={formData.classes.includes(cls.id)}
                  onChange={(e) => {
                    const newClasses = e.target.checked
                      ? [...formData.classes, cls.id]
                      : formData.classes.filter((id) => id !== cls.id);
                    setFormData({ ...formData, classes: newClasses });
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {cls.name} - {cls.section}
                </span>
              </label>
            ))}
          </div>
          {errors.classes && (
            <p className="mt-1 text-sm text-red-600">{errors.classes}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Schedule is active
          </label>
        </div>
      </div>

      {errors.submit && (
        <p className="text-sm text-red-600">{errors.submit}</p>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Create Schedule
        </button>
      </div>
    </form>
  );
};

export default ReminderScheduleForm; 