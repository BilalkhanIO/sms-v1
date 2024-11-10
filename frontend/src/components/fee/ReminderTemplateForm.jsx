import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveReminderTemplate } from '../../redux/features/feeSlice';

const ReminderTemplateForm = ({ onClose, initialTemplate = null }) => {
  const [formData, setFormData] = useState({
    name: initialTemplate?.name || '',
    subject: initialTemplate?.subject || '',
    body: initialTemplate?.body || '',
    type: initialTemplate?.type || 'EMAIL', // EMAIL, SMS
    variables: initialTemplate?.variables || [
      '{STUDENT_NAME}',
      '{DUE_AMOUNT}',
      '{DUE_DATE}',
      '{SCHOOL_NAME}',
    ],
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Template name is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.body) newErrors.body = 'Message body is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(saveReminderTemplate(formData)).unwrap();
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const insertVariable = (variable) => {
    const textArea = document.getElementById('messageBody');
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = formData.body;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    setFormData({
      ...formData,
      body: before + variable + after,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Template Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reminder Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject Line
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message Body
          </label>
          <div className="mt-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.variables.map((variable) => (
                <button
                  key={variable}
                  type="button"
                  onClick={() => insertVariable(variable)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {variable}
                </button>
              ))}
            </div>
            <textarea
              id="messageBody"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body}</p>
          )}
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
          Save Template
        </button>
      </div>
    </form>
  );
};

export default ReminderTemplateForm; 