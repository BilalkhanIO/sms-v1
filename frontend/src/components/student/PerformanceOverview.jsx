

const PerformanceOverview = ({ data }) => {
  const {
    overallGrade,
    gradePercentage,
    attendanceRate,
    classRank,
    totalStudents,
    completedAssignments,
    totalAssignments,
    upcomingExams,
  } = data;

  const assignmentCompletionRate = (completedAssignments / totalAssignments) * 100;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Performance Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Overall Grade */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24">
              <CircularProgressbar
                value={gradePercentage}
                text={overallGrade}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: `rgba(79, 70, 229, ${gradePercentage / 100})`,
                  textColor: '#4F46E5',
                  trailColor: '#F3F4F6',
                })}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Overall Grade</p>
              <p className="text-sm text-gray-900">{gradePercentage}%</p>
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24">
              <CircularProgressbar
                value={attendanceRate}
                text={`${attendanceRate}%`}
                styles={buildStyles({
                  textSize: '20px',
                  pathColor: `rgba(16, 185, 129, ${attendanceRate / 100})`,
                  textColor: '#10B981',
                  trailColor: '#F3F4F6',
                })}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Attendance</p>
              <p className="text-sm text-gray-900">Present Days</p>
            </div>
          </div>

          {/* Class Rank */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 flex items-center justify-center bg-indigo-50 rounded-full">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{classRank}</p>
                <p className="text-xs text-indigo-600">of {totalStudents}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Class Rank</p>
              <p className="text-sm text-gray-900">Current Position</p>
            </div>
          </div>

          {/* Assignment Progress */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24">
              <CircularProgressbar
                value={assignmentCompletionRate}
                text={`${completedAssignments}/${totalAssignments}`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: `rgba(245, 158, 11, ${assignmentCompletionRate / 100})`,
                  textColor: '#F59E0B',
                  trailColor: '#F3F4F6',
                })}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assignments</p>
              <p className="text-sm text-gray-900">Completed</p>
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        {upcomingExams?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Upcoming Exams
            </h4>
            <div className="bg-yellow-50 rounded-md p-4">
              <div className="flex space-x-6">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      {exam.subject}
                    </p>
                    <p className="text-xs text-yellow-600">
                      {new Date(exam.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceOverview; 