import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetStudentByIdQuery } from "../api/studentApi";
import Spinner from "./common/Spinner";

const StudentDetails = () => {
  const { id } = useParams();
  const { data: studentRaw, isLoading, isError } = useGetStudentByIdQuery(id);
  const student = studentRaw?.data || studentRaw;

  if (isLoading) return <Spinner size="large" />;
  if (isError || !student) return <div className="text-red-500 p-4">Student not found.</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Student Details</h2>
      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <p><strong>Name:</strong> {student.user?.firstName} {student.user?.lastName}</p>
        <p><strong>Email:</strong> {student.user?.email || '—'}</p>
        <p><strong>Admission No:</strong> {student.admissionNumber}</p>
        <p><strong>Roll No:</strong> {student.rollNumber}</p>
        <p><strong>Class:</strong> {student.class?.name} {student.class?.section}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>Date of Birth:</strong> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '—'}</p>
        <p><strong>Status:</strong> {student.status}</p>
        {student.address && (
          <p><strong>Address:</strong> {[student.address.street, student.address.city, student.address.state, student.address.country].filter(Boolean).join(', ')}</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
