// src/pages/classes/ClassDetails.jsx
import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassById, addStudentToClass, removeStudentFromClass } from '../../store/classSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScheduleView from '../../components/ScheduleView';
import StudentList from '../../components/StudentList';
import API from '../../api';
import AsyncSelect from 'react-select/async';

export default function ClassDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { item: classDetails, status, error } = useSelector((state) => state.classes);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [studentToAdd, setStudentToAdd] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    dispatch(fetchClassById(id));
  }, [id, dispatch]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await API.get('/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleEnrollStudents = async () => {
    setServerError(null);
    if (!studentToAdd) return;

    setIsEnrolling(true);
    try {
      await dispatch(addStudentToClass({ classId: id, studentId: studentToAdd.value }));
      setStudentToAdd(null);
    } catch (error) {
      console.error("Error enrolling student:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("An error occurred while enrolling the student.");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    setServerError(null);
    try {
      await dispatch(removeStudentFromClass({ classId: id, studentId }));
    } catch (error) {
      console.error("Error removing student:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("An error occurred while removing the student.");
      }
    }
  };

  const loadStudents = async (inputValue) => {
    const res = await API.get(`/students?search=${inputValue}`);
    return res.data.map((s) => ({
      value: s._id,
      label: `${s.user?.firstName} ${s.user?.lastName} (${s.rollNumber})`,
    }));
  };

  if (status === 'loading' || !classDetails) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {classDetails?.name} - {classDetails?.section} {/* Optional Chaining */}
            </h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {classDetails?.academicYear} {/* Optional Chaining */}
          </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Class Teacher</h3>
              <p>
                {classDetails?.classTeacher?.user?.firstName}{" "} {/* Optional Chaining */}
                {classDetails?.classTeacher?.user?.lastName} {/* Optional Chaining */}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Total Students</h3>
              <p>{classDetails?.students?.length || 0}</p> {/* Optional Chaining */}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Class Schedule</h2>
          <ScheduleView schedule={classDetails?.schedule} /> {/* Optional Chaining */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Students</h2>
            <Link to={`/classes/${id}/add-students`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Add Students
            </Link>
          </div>
          {serverError && <div className="text-red-500 mb-4">{serverError}</div>}
          <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadStudents}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              onChange={(option) => setStudentToAdd(option)}
              value={studentToAdd}
          />
          <button
              onClick={handleEnrollStudents}
              disabled={isEnrolling || !studentToAdd}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 disabled:bg-gray-400"
          >
            {isEnrolling ? 'Enrolling...' : 'Enroll Student'}
          </button>

          <StudentList
              students={classDetails?.students}
              onRemove={handleRemoveStudent}
          />
        </div>
      </div>
  );
}
