// src/components/StudentList.jsx

import React from "react";
import { useGetStudentsByClassQuery } from "../api/studentApi";
import { useParams, Link } from "react-router-dom";

const StudentList = () => {
  const { classId } = useParams();
  const { data: students, isLoading, isError } = useGetStudentsByClassQuery(classId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching students.</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold mb-2">Student List</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Admission Number</th>
            <th className="px-4 py-2">Roll Number</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students && students.map((student) => (
            <tr key={student._id}>
              <td className="border px-4 py-2">{student.firstName} {student.lastName}</td>
              <td className="border px-4 py-2">{student.admissionNumber}</td>
              <td className="border px-4 py-2">{student.rollNumber}</td>
              <td className="border px-4 py-2">
                <Link to={`/students/${student._id}`} className="text-blue-500 hover:text-blue-700">
                  View
                </Link>
                {/* Add edit and delete buttons with appropriate links */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;


