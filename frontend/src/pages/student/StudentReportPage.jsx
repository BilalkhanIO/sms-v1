import { useParams } from 'react-router-dom';
import StudentReport from '../../components/student/StudentReport';

const StudentReportPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Student Report</h1>
      <StudentReport studentId={id} />
    </div>
  );
};

export default StudentReportPage; 