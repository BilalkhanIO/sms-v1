import React from "react";
import { useParams } from "react-router-dom";
import { useGetStudentByIdQuery } from "../api/studentApi";

const StudentDetails = () => {
  const { id } = useParams();
  const { data: student, isLoading, isError } = useGetStudentByIdQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching student details.</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold mb-2">Student Details</h2>
      {student && (
        <div className="bg-white shadow-md rounded p-4">
          <p>
            <strong>Name:</strong> {student.firstName} {student.lastName}
          </p>
          <p>
            <strong>Admission Number:</strong> {student.admissionNumber}
          </p>
          {/* Display other student details */}
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
