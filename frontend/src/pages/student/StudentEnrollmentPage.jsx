import StudentEnrollmentForm from '../../components/student/StudentEnrollmentForm';

const StudentEnrollmentPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Student Enrollment</h1>
      <StudentEnrollmentForm />
    </div>
  );
};

export default StudentEnrollmentPage; 