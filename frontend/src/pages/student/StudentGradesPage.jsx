import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchStudentById } from '../../redux/features/studentSlice';
import StudentPerformance from '../../components/student/StudentPerformance';
import ExamPerformance from '../../components/student/ExamPerformance';
import SubjectPerformance from '../../components/student/SubjectPerformance';
import PerformanceOverview from '../../components/student/PerformanceOverview';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const StudentGradesPage = () => {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const { selectedStudent, loading, error } = useSelector((state) => state.student);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    }
  }, [dispatch, studentId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedStudent) return <ErrorMessage message="Student not found" />;

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'exams', name: 'Exam Performance' },
    { id: 'subjects', name: 'Subject Performance' },
    { id: 'detailed', name: 'Detailed Analysis' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Academic Performance
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {selectedStudent.firstName} {selectedStudent.lastName} - {selectedStudent.rollNumber}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <PerformanceOverview data={{
                overallGrade: selectedStudent.academicInfo?.overallGrade || 'N/A',
                gradePercentage: selectedStudent.academicInfo?.gradePercentage || 0,
                attendanceRate: selectedStudent.academicInfo?.attendanceRate || 0,
                classRank: selectedStudent.academicInfo?.rank || 'N/A',
                totalStudents: selectedStudent.academicInfo?.totalStudents || 0,
                completedAssignments: selectedStudent.academicInfo?.completedAssignments || 0,
                totalAssignments: selectedStudent.academicInfo?.totalAssignments || 0,
                upcomingExams: selectedStudent.academicInfo?.upcomingExams || []
              }} />
            </>
          )}

          {activeTab === 'exams' && (
            <ExamPerformance 
              exams={selectedStudent.academicInfo?.exams || []}
              subjects={selectedStudent.academicInfo?.subjects || []}
            />
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-6">
              {selectedStudent.academicInfo?.subjects?.map((subject) => (
                <SubjectPerformance 
                  key={subject.id} 
                  subject={subject}
                />
              ))}
            </div>
          )}

          {activeTab === 'detailed' && (
            <StudentPerformance 
              studentId={studentId}
            />
          )}
        </div>

        {/* Academic Summary */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Academic Summary
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Current Grade</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.academicInfo?.currentGrade || 'N/A'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Class Rank</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.academicInfo?.rank || 'N/A'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Attendance Rate</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.academicInfo?.attendanceRate || 0}%
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedStudent.academicInfo?.academicYear || 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGradesPage;
