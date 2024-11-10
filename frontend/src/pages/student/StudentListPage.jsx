import StudentList from '../../components/student/StudentList';

const StudentListPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      <StudentList />
    </div>
  );
};

export default StudentListPage; 