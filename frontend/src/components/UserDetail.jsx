import { useParams, Link } from "react-router-dom";
import { useGetUserByIdQuery } from "../api/usersApi";
import Spinner from "./common/Spinner";
import ErrorMessage from "./common/ErrorMessage";
import PageHeader from "./common/PageHeader";

const UserDetail = () => {
  const { id: userId } = useParams(); // Get user ID from URL params
  const { data: user, isLoading, isError, error } = useGetUserByIdQuery(userId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error loading user details: {error.data?.message || "Unknown Error"}
      </ErrorMessage>
    );
  }

  if (!user) {
    // Added a check to prevent undefined errors
    return <div>User not found.</div>;
  }

  let roleSpecificDetails = null;

  switch (user.role) {
    case "TEACHER":
      roleSpecificDetails = (
        <div>
          <h4 className="font-semibold mt-4 mb-2">Teacher Details</h4>
          <p>
            <span className="font-semibold">Employee ID:</span>{" "}
            {user.teacherDetails?.employeeId || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Qualification:</span>{" "}
            {user.teacherDetails?.qualification || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Specialization:</span>{" "}
            {user.teacherDetails?.specialization || "N/A"}
          </p>
          {/* Add more teacher-specific fields as needed */}
        </div>
      );
      break;
    case "STUDENT":
      roleSpecificDetails = (
        <div>
          <h4 className="font-semibold mt-4 mb-2">Student Details</h4>
          <p>
            <span className="font-semibold">Admission Number:</span>{" "}
            {user.studentDetails?.admissionNumber || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Roll Number:</span>{" "}
            {user.studentDetails?.rollNumber || "N/A"}
          </p>
          {user.studentDetails?.class && (
            <p>
              <span className="font-semibold">Class:</span>{" "}
              {user.studentDetails.class}
            </p>
          )}{" "}
          {/* Assuming 'class' might be an object or just an ID */}
          <p>
            <span className="font-semibold">Gender:</span>{" "}
            {user.studentDetails?.gender || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Date of Birth:</span>{" "}
            {user.studentDetails?.dateOfBirth
              ? new Date(user.studentDetails.dateOfBirth).toLocaleDateString()
              : "N/A"}
          </p>
          {user.studentDetails?.parentInfo && (
            <div className="mt-2">
              <h5 className="font-semibold">Parent Information:</h5>
              <p>
                <span className="font-semibold">Father's Name:</span>{" "}
                {user.studentDetails.parentInfo.father?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Mother's Name:</span>{" "}
                {user.studentDetails.parentInfo.mother?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Guardian's Name:</span>{" "}
                {user.studentDetails.parentInfo.guardian?.name || "N/A"}
              </p>
            </div>
          )}
          {/* Add more student-specific fields as needed */}
        </div>
      );
      break;
    case "PARENT":
      roleSpecificDetails = (
        <div>
          <h4 className="font-semibold mt-4 mb-2">Parent Details</h4>
          <p>
            <span className="font-semibold">Contact Number:</span>{" "}
            {user.parentDetails?.contactNumber || "N/A"}
          </p>
          {/* Display children - Assuming 'children' is an array of student IDs in Parent model */}
          {user.parentDetails?.children &&
            user.parentDetails.children.length > 0 && (
              <div className="mt-2">
                <h5 className="font-semibold">Children:</h5>
                <ul>
                  {user.parentDetails.children.map(
                    (
                      childId // You might want to fetch child details separately if needed
                    ) => (
                      <li key={childId}>{childId}</li> // Display child IDs for now
                    )
                  )}
                </ul>
                {/* Consider fetching and displaying child names instead of just IDs for better UI */}
              </div>
            )}
          {/* Add more parent-specific fields as needed */}
        </div>
      );
      break;
    default:
      roleSpecificDetails = (
        <p>No specific details to display for the {user.role} role.</p>
      );
  }

  return (
    <>
      <PageHeader title="User Details" />
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              User Details
            </h2>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p>
                <span className="font-semibold">ID:</span> {user._id}
              </p>
              <p>
                <span className="font-semibold">First Name:</span>{" "}
                {user.firstName}
              </p>
              <p>
                <span className="font-semibold">Last Name:</span>{" "}
                {user.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {user.role}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {user.status}
              </p>
              {/* Add more common user fields from User model here */}
            </div>
            {roleSpecificDetails} {/* Render role-specific details */}
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
            <Link
              to="/dashboard/users"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to User List
            </Link>
            <Link
              to={`/dashboard/users/edit/${user._id}`}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit User
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
