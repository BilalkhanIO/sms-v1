import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateEventMutation, useUpdateEventMutation, useGetEventByIdQuery } from '../../api/calendarApi';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const eventSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  type: Yup.string().required('Type is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
});

const EVENT_TYPES = ['EXAM', 'HOLIDAY', 'EVENT', 'MEETING'];

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-sm text-red-600';

const CalendarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: eventRaw, isLoading: isLoadingEvent } = useGetEventByIdQuery(id, { skip: !isEditing });
  const event = eventRaw?.data || eventRaw;

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: event?.title || '',
      description: event?.description || '',
      type: event?.type || 'EVENT',
      startDate: event?.startDate ? event.startDate.split('T')[0] : '',
      endDate: event?.endDate ? event.endDate.split('T')[0] : '',
      location: event?.location || '',
      isAllDay: event?.isAllDay ?? true,
    },
    validationSchema: eventSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateEvent({ id, ...values }).unwrap();
        } else {
          await createEvent(values).unwrap();
        }
        navigate('/dashboard/calendar/events');
      } catch (err) {
        console.error('Failed to save event:', err);
      }
    },
  });

  if (isEditing && isLoadingEvent) return <Spinner />;

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Event' : 'Create Event'}
        backUrl="/dashboard/calendar/events"
      />

      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass}
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && <p className={errorClass}>{formik.errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type *</label>
              <select
                className={inputClass}
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {formik.touched.type && formik.errors.type && <p className={errorClass}>{formik.errors.type}</p>}
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date *</label>
              <input
                type="date"
                className={inputClass}
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.startDate && formik.errors.startDate && <p className={errorClass}>{formik.errors.startDate}</p>}
            </div>
            <div>
              <label className={labelClass}>End Date *</label>
              <input
                type="date"
                className={inputClass}
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.endDate && formik.errors.endDate && <p className={errorClass}>{formik.errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAllDay"
              name="isAllDay"
              checked={formik.values.isAllDay}
              onChange={formik.handleChange}
            />
            <label htmlFor="isAllDay" className="text-sm text-gray-700">All Day Event</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard/calendar/events')}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating || !formik.isValid}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarForm;
