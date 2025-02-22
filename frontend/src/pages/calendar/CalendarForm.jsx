import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { calendarEventSchema } from '../../utils/validationSchemas';
import { useCreateEventMutation, useUpdateEventMutation, useGetEventByIdQuery } from '../../api/calendarApi';
import Button from '../../components/common/Button';
import FormSection from '../../components/common/FormSection';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import DateTimeField from '../../components/common/DateTimeField';
import FormError from '../../components/common/FormError';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';

const CalendarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { data: event, isLoading: isLoadingEvent } = useGetEventByIdQuery(id, {
    skip: !isEditing
  });

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const formik = useFormik({
    initialValues: {
      title: event?.title || '',
      description: event?.description || '',
      startDate: event?.startDate || '',
      endDate: event?.endDate || '',
      type: event?.type || 'EVENT',
      location: event?.location || '',
      isAllDay: event?.isAllDay || false,
      participants: event?.participants || [],
      recurrence: event?.recurrence || {
        frequency: 'NONE',
        interval: 1,
        endDate: null
      }
    },
    validationSchema: calendarEventSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateEvent({ id, ...values }).unwrap();
        } else {
          await createEvent(values).unwrap();
        }
        navigate('/dashboard/calendar');
      } catch (error) {
        console.error('Failed to save event:', error);
      }
    }
  });

  if (isEditing && isLoadingEvent) {
    return <Spinner size="large" />;
  }

  const eventTypes = [
    { value: 'EXAM', label: 'Exam' },
    { value: 'HOLIDAY', label: 'Holiday' },
    { value: 'EVENT', label: 'Event' },
    { value: 'MEETING', label: 'Meeting' }
  ];

  const recurrenceFrequencies = [
    { value: 'NONE', label: 'None' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={isEditing ? 'Edit Event' : 'Create Event'}
        backButton
      />

      <form onSubmit={formik.handleSubmit} className="max-w-3xl mx-auto">
        <FormSection title="Event Details">
          <InputField
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title}
            required
          />

          <InputField
            label="Description"
            name="description"
            type="textarea"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
          />

          <SelectField
            label="Event Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.type && formik.errors.type}
            options={eventTypes}
            required
          />

          <InputField
            label="Location"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && formik.errors.location}
          />
        </FormSection>

        <FormSection title="Date and Time">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isAllDay"
              name="isAllDay"
              checked={formik.values.isAllDay}
              onChange={formik.handleChange}
              className="mr-2"
            />
            <label htmlFor="isAllDay">All Day Event</label>
          </div>

          <DateTimeField
            label="Start Date"
            name="startDate"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startDate && formik.errors.startDate}
            type={formik.values.isAllDay ? "date" : "datetime-local"}
            required
          />

          <DateTimeField
            label="End Date"
            name="endDate"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && formik.errors.endDate}
            type={formik.values.isAllDay ? "date" : "datetime-local"}
            required
          />
        </FormSection>

        <FormSection title="Recurrence">
          <SelectField
            label="Frequency"
            name="recurrence.frequency"
            value={formik.values.recurrence.frequency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.recurrence?.frequency &&
              formik.errors.recurrence?.frequency
            }
            options={recurrenceFrequencies}
          />

          {formik.values.recurrence.frequency !== 'NONE' && (
            <>
              <InputField
                label="Interval"
                name="recurrence.interval"
                type="number"
                min="1"
                value={formik.values.recurrence.interval}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.recurrence?.interval &&
                  formik.errors.recurrence?.interval
                }
              />

              <DateTimeField
                label="End Date"
                name="recurrence.endDate"
                value={formik.values.recurrence.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.recurrence?.endDate &&
                  formik.errors.recurrence?.endDate
                }
                type="date"
              />
            </>
          )}
        </FormSection>

        {formik.errors.submit && <FormError error={formik.errors.submit} />}

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/calendar')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isCreating || isUpdating}
            disabled={!formik.isValid || !formik.dirty}
          >
            {isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CalendarForm; 