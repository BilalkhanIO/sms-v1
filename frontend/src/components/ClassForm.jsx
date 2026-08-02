import { useGetClassByIdQuery, useCreateClassMutation, useUpdateClassMutation } from "../api/classesApi";
import { useNavigate, useParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useGetTeachersQuery } from "../api/teacherApi";
import { useGetSubjectsQuery } from "../api/subjectApi";
import { useUIStore } from "../store/zustand/useUIStore";
import Spinner from "./common/Spinner";

const inputClass = 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const selectStyles = { control: (base) => ({ ...base, borderColor: '#d1d5db', '&:hover': { borderColor: '#d1d5db' }, minHeight: '38px', fontSize: '0.875rem' }) };

const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Class name is required"),
  section: Yup.string().required("Section is required"),
  academicYear: Yup.string().required("Academic year is required"),
  classTeacher: Yup.object()
    .nullable()
    .required("Class teacher is required")
    .shape({
      value: Yup.string().required("Class teacher is required"),
      label: Yup.string().required(),
    }),
  subjects: Yup.array().of(
    Yup.object().shape({
      subject: Yup.object()
        .nullable()
        .required("Subject is required")
        .shape({
          value: Yup.string().required("Subject is required"),
          label: Yup.string().required(),
        }),
    })
  ),
  schedule: Yup.array().of(
    Yup.object().shape({
      day: Yup.string().required(),
      periods: Yup.array().of(
        Yup.object().shape({
          subject: Yup.object()
            .nullable()
            .required("Subject is required")
            .shape({ value: Yup.string().required(), label: Yup.string().required() }),
          teacher: Yup.object()
            .nullable()
            .required("Teacher is required")
            .shape({ value: Yup.string().required(), label: Yup.string().required() }),
          startTime: Yup.string().required("Start time is required"),
          endTime: Yup.string().required("End time is required"),
        })
      ),
    })
  ),
});

const ClassForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);

  const { data: classItemRaw, isLoading: isClassLoading, isError: isClassError, error: classError } = useGetClassByIdQuery(id, { skip: !id });
  const [createClassMutation] = useCreateClassMutation();
  const [updateClassMutation] = useUpdateClassMutation();

  const { data: teachersRaw, isLoading: isTeachersLoading } = useGetTeachersQuery();
  const { data: subjectsRaw, isLoading: isSubjectsLoading } = useGetSubjectsQuery();

  const classItem = classItemRaw?.data || classItemRaw;
  const teacherList = teachersRaw?.data || teachersRaw || [];
  const subjectList = subjectsRaw?.data || subjectsRaw || [];

  const initialValues = {
    name: classItem?.name || "",
    section: classItem?.section || "",
    academicYear: classItem?.academicYear || "",
    classTeacher: classItem?.classTeacher
      ? {
          value: classItem.classTeacher._id,
          label: `${classItem.classTeacher.user?.firstName || ''} ${classItem.classTeacher.user?.lastName || ''} (${classItem.classTeacher.employeeId || ''})`.trim(),
        }
      : null,
    subjects:
      classItem?.subjects?.length > 0
        ? classItem.subjects.map((sub) => ({ subject: { value: sub._id, label: sub.name } }))
        : [],
    schedule:
      classItem?.schedule?.length > 0
        ? classItem.schedule.map((daySchedule) => ({
            day: daySchedule.day,
            periods: daySchedule.periods.map((period) => ({
              subject: period.subject?._id
                ? { value: period.subject._id, label: period.subject.name || '' }
                : null,
              teacher: period.teacher?._id
                ? {
                    value: period.teacher._id,
                    label: `${period.teacher.user?.firstName || ''} ${period.teacher.user?.lastName || ''} (${period.teacher.employeeId || ''})`.trim(),
                  }
                : null,
              startTime: period.startTime || '',
              endTime: period.endTime || '',
            })),
          }))
        : daysOfWeek.map((day) => ({ day, periods: [] })),
  };

  const loadTeachers = async () => {
    if (isTeachersLoading || !Array.isArray(teacherList)) return [];
    return teacherList.map((t) => ({
      value: t._id,
      label: `${t.user?.firstName || ''} ${t.user?.lastName || ''} (${t.employeeId || ''})`.trim(),
    }));
  };

  const loadSubjects = async () => {
    if (isSubjectsLoading || !Array.isArray(subjectList)) return [];
    return subjectList.map((s) => ({ value: s._id, label: s.name }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const classData = {
        name: values.name,
        section: values.section,
        academicYear: values.academicYear,
        classTeacher: values.classTeacher?.value,
        subjects: values.subjects.filter((s) => s.subject?.value).map((s) => s.subject.value),
        schedule: values.schedule.map((daySchedule) => ({
          day: daySchedule.day,
          periods: daySchedule.periods
            .filter((p) => p.subject?.value && p.teacher?.value)
            .map((period) => ({
              subject: period.subject.value,
              teacher: period.teacher.value,
              startTime: period.startTime,
              endTime: period.endTime,
            })),
        })),
      };

      if (id) {
        await updateClassMutation({ id, ...classData }).unwrap();
        addToast({ type: 'success', title: 'Class updated successfully' });
      } else {
        await createClassMutation(classData).unwrap();
        addToast({ type: 'success', title: 'Class created successfully' });
      }
      navigate("/dashboard/classes");
    } catch (error) {
      const msg = error.data?.message || error.error || 'Failed to save class';
      addToast({ type: 'error', title: 'Error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (id && isClassLoading) return <Spinner size="large" />;
  if (isClassError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        {classError?.data?.message || classError?.error || 'Failed to load class data.'}
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">

          {/* Basic Info */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Class Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Class Name *</label>
                <Field type="text" name="name" className={inputClass} placeholder="e.g. Grade 10" />
                <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label className={labelClass}>Section *</label>
                <Field type="text" name="section" className={inputClass} placeholder="e.g. A" />
                <ErrorMessage name="section" component="p" className="mt-1 text-sm text-red-600" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Academic Year *</label>
                <Field type="text" name="academicYear" className={inputClass} placeholder="e.g. 2024-2025" />
                <ErrorMessage name="academicYear" component="p" className="mt-1 text-sm text-red-600" />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Class Teacher *</label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadTeachers}
                  onChange={(option) => setFieldValue("classTeacher", option)}
                  value={values.classTeacher}
                  isLoading={isTeachersLoading}
                  placeholder="Select teacher..."
                  isClearable
                  styles={selectStyles}
                />
                <ErrorMessage name="classTeacher" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Subjects</h4>
            <FieldArray name="subjects">
              {({ push, remove }) => (
                <div className="space-y-2">
                  {values.subjects.map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={loadSubjects}
                          onChange={(option) => setFieldValue(`subjects.${index}.subject`, option)}
                          value={values.subjects[index].subject}
                          isLoading={isSubjectsLoading}
                          placeholder="Select subject..."
                          styles={selectStyles}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ subject: null })}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add Subject
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-3">Weekly Schedule</h4>
            <FieldArray name="schedule">
              {() => (
                <div className="space-y-3">
                  {values.schedule.map((daySchedule, dayIndex) => (
                    <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">{daySchedule.day}</h5>
                      <FieldArray name={`schedule.${dayIndex}.periods`}>
                        {({ push: pushPeriod, remove: removePeriod }) => (
                          <div className="space-y-2">
                            {daySchedule.periods.map((period, periodIndex) => (
                              <div key={periodIndex} className="flex items-center gap-2 flex-wrap">
                                <div className="flex-1 min-w-[140px]">
                                  <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadSubjects}
                                    onChange={(option) => setFieldValue(`schedule.${dayIndex}.periods.${periodIndex}.subject`, option)}
                                    value={values.schedule[dayIndex].periods[periodIndex].subject}
                                    isLoading={isSubjectsLoading}
                                    placeholder="Subject..."
                                    styles={selectStyles}
                                  />
                                </div>
                                <div className="flex-1 min-w-[140px]">
                                  <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadTeachers}
                                    onChange={(option) => setFieldValue(`schedule.${dayIndex}.periods.${periodIndex}.teacher`, option)}
                                    value={values.schedule[dayIndex].periods[periodIndex].teacher}
                                    isLoading={isTeachersLoading}
                                    placeholder="Teacher..."
                                    styles={selectStyles}
                                  />
                                </div>
                                <input
                                  type="time"
                                  value={period.startTime}
                                  onChange={(e) => setFieldValue(`schedule.${dayIndex}.periods.${periodIndex}.startTime`, e.target.value)}
                                  className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                                />
                                <input
                                  type="time"
                                  value={period.endTime}
                                  onChange={(e) => setFieldValue(`schedule.${dayIndex}.periods.${periodIndex}.endTime`, e.target.value)}
                                  className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePeriod(periodIndex)}
                                  className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => pushPeriod({ subject: null, teacher: null, startTime: '', endTime: '' })}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              + Add Period
                            </button>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard/classes')}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : id ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ClassForm;
