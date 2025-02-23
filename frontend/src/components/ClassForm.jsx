import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  createClass,
  updateClass,
  fetchClassById,
} from "../store/classSlice"; // Import fetchClassById
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../api"; // Your API functions
import AsyncSelect from "react-select/async";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useGetTeachersQuery } from "../api/teacherApi"; // Import useGetTeachersQuery
import { useGetSubjectsQuery } from "../api/subjectApi"; // Import useGetSubjectsQuery

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Class name is required"),
  section: Yup.string().required("Section is required"),
  academicYear: Yup.string().required("Academic year is required"),
  classTeacher: Yup.object()
    .nullable()
    .shape({
      value: Yup.string().required("Class teacher is required"),
      label: Yup.string().required("Class teacher is required"), // Add label
    }),
  subjects: Yup.array().of(
    Yup.object().shape({
      subject: Yup.object().shape({
        // Validate as an object
        value: Yup.string().required("Subject is required"),
        label: Yup.string().required("Subject is required"),
      }),
      // teacher field removed from here
    })
  ),
  schedule: Yup.array().of(
    Yup.object().shape({
      day: Yup.string().required("Day is required"),
      periods: Yup.array().of(
        Yup.object().shape({
          subject: Yup.object().shape({
            value: Yup.string().required("Subject is required"),
            label: Yup.string().required("Subject is required"),
          }),
          teacher: Yup.object().shape({
            value: Yup.string().required("Teacher is required"),
            label: Yup.string().required("Teacher is required"),
          }),
          startTime: Yup.string().required("Start time is required"),
          endTime: Yup.string().required("End time is required"),
        })
      ),
    })
  ),
});

const ClassForm = () => {
  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const { id } = useParams(); // Get class ID from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: classItem,
    status,
    isError,
    error,
  } = useSelector((state) => state.classes); // Get the whole class state
  const { data: teachers, isLoading: isTeachersLoading } =
    useGetTeachersQuery(); // Fetch teachers using RTK Query
  const { data: subjects, isLoading: isSubjectsLoading } =
    useGetSubjectsQuery(); // Fetch subjects using RTK Query

  useEffect(() => {
    if (id) {
      dispatch(fetchClassById(id)); // Dispatch the action to fetch class by ID
    }
  }, [id, dispatch]);

  const initialValues = {
    name: classItem?.name || "",
    section: classItem?.section || "",
    academicYear: classItem?.academicYear || "",
    classTeacher: classItem?.classTeacher
      ? {
          value: classItem.classTeacher._id,
          label: `${classItem.classTeacher.firstName} ${classItem.classTeacher.lastName}`,
        }
      : null,
    subjects:
      classItem?.subjects?.length > 0
        ? classItem.subjects.map((sub) => ({
            subject: { value: sub._id, label: sub.name },
          }))
        : [],
    schedule:
      classItem?.schedule?.length > 0
        ? classItem.schedule
        : daysOfWeek.map((day) => ({
            day: day,
            periods: [],
          })),
  };

  // Use RTK Query's data directly for options
  const loadTeachers = async (inputValue) => {
    if (isTeachersLoading) {
      return [];
    }
    return teachers.map((t) => ({
      value: t.user._id, // Use  _id directly
      label: `${t.user.firstName} ${t.user.lastName} (${t.employeeId})`,
    }));
  };

  const loadSubjects = async (inputValue) => {
    if (isSubjectsLoading) {
      return [];
    }
    return subjects.map((s) => ({
      value: s._id, // Use _id directly
      label: s.name,
    }));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const classData = {
        ...values,
        classTeacher: values.classTeacher.value,
        subjects: values.subjects.map((s) => s.subject.value),
        schedule: values.schedule.map((daySchedule) => ({
          day: daySchedule.day,
          periods: daySchedule.periods.map((period) => ({
            subject: period.subject.value,
            teacher: period.teacher.value,
            startTime: period.startTime,
            endTime: period.endTime,
          })),
        })),
      };

      if (id) {
        await dispatch(updateClass({ id, classData })).unwrap(); // Pass id and data
      } else {
        await dispatch(createClass(classData)).unwrap();
      }
      navigate("/dashboard/classes");
    } catch (error) {
      console.error("Error submitting class:", error);
      // Handle error (e.g., show error message)
    } finally {
      setSubmitting(false);
    }
  };

  if (id && status === "loading") {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>; // Display error message
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize // Important for updating form with fetched data
    >
      {({ isSubmitting, values, setFieldValue, errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Class Name
            </label>
            <Field
              type="text"
              name="name"
              id="name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>
          <div>
            <label htmlFor="section">Section</label>
            <Field
              type="text"
              name="section"
              id="section"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <ErrorMessage
              name="section"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>
          <div>
            <label htmlFor="academicYear">Academic Year</label>
            <Field
              type="text"
              name="academicYear"
              id="academicYear"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <ErrorMessage
              name="academicYear"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Class Teacher
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadTeachers}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              onChange={(option) => setFieldValue("classTeacher", option)}
              value={values.classTeacher}
              isLoading={isTeachersLoading} // Show loading indicator
            />
            <ErrorMessage
              name="classTeacher"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subjects</label>
            <FieldArray name="subjects">
              {({ push, remove }) => (
                <div>
                  {values.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadSubjects}
                        getOptionValue={(option) => option.value}
                        getOptionLabel={(option) => option.label}
                        onChange={(option) =>
                          setFieldValue(`subjects.${index}.subject`, option)
                        }
                        value={values.subjects[index].subject}
                        className="flex-grow"
                        name={`subjects.${index}.subject`}
                        isLoading={isSubjectsLoading} // Show loading indicator
                      />
                      {/* Teacher select removed from here */}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ subject: null })}
                    className="text-blue-500"
                  >
                    Add Subject
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Schedule</label>
            <FieldArray name="schedule">
              {({ push, remove }) => (
                <div>
                  {values.schedule.map((daySchedule, dayIndex) => (
                    <div key={dayIndex} className="mb-4 border p-4 rounded-md">
                      <h4 className="font-semibold">{daySchedule.day}</h4>
                      <FieldArray name={`schedule.${dayIndex}.periods`}>
                        {({ push: pushPeriod, remove: removePeriod }) => (
                          <div>
                            {daySchedule.periods.map((period, periodIndex) => (
                              <div
                                key={periodIndex}
                                className="mb-2 flex items-center space-x-2"
                              >
                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions
                                  loadOptions={loadSubjects}
                                  getOptionValue={(option) => option.value}
                                  getOptionLabel={(option) => option.label}
                                  onChange={(option) =>
                                    setFieldValue(
                                      `schedule.${dayIndex}.periods.${periodIndex}.subject`,
                                      option
                                    )
                                  }
                                  value={
                                    values.schedule[dayIndex].periods[
                                      periodIndex
                                    ].subject
                                  }
                                  className="flex-grow"
                                  name={`schedule.${dayIndex}.periods.${periodIndex}.subject`}
                                  isLoading={isSubjectsLoading}
                                />

                                <AsyncSelect
                                  cacheOptions
                                  defaultOptions
                                  loadOptions={loadTeachers}
                                  getOptionValue={(option) => option.value}
                                  getOptionLabel={(option) => option.label}
                                  onChange={(option) =>
                                    setFieldValue(
                                      `schedule.${dayIndex}.periods.${periodIndex}.teacher`,
                                      option
                                    )
                                  }
                                  value={
                                    values.schedule[dayIndex].periods[
                                      periodIndex
                                    ].teacher
                                  }
                                  className="flex-grow"
                                  name={`schedule.${dayIndex}.periods.${periodIndex}.teacher`}
                                  isLoading={isTeachersLoading}
                                />

                                <Field
                                  type="time"
                                  name={`schedule.${dayIndex}.periods.${periodIndex}.startTime`}
                                  className="border rounded p-2"
                                />
                                <Field
                                  type="time"
                                  name={`schedule.${dayIndex}.periods.${periodIndex}.endTime`}
                                  className="border rounded p-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePeriod(periodIndex)}
                                  className="text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                pushPeriod({
                                  subject: null,
                                  teacher: null,
                                  startTime: "",
                                  endTime: "",
                                })
                              }
                              className="text-blue-500"
                            >
                              Add Period
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isSubmitting ? "Saving..." : "Save Class"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ClassForm;
