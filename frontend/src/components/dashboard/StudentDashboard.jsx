import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import { CheckCircle, FileText, Calendar, Clock, BookOpen, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value ?? "N/A"}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <Spinner size="large" />;
  if (error) {
    return (
      <div className="text-red-600 text-center">
        Error: {error.message || "Failed to load dashboard"}
      </div>
    );
  }

  const studentOverview = stats?.studentOverview || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${studentOverview.attendanceSummary?.PRESENT || 0}%`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pending Fees"
          value={studentOverview.feeStatus?.PENDING?.total || 0}
          icon={FileText}
          color="orange"
        />
        <StatCard
          title="Class"
          value={studentOverview.class?.name || "N/A"}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Average Grade"
          value={studentOverview.averageGrade || "N/A"}
          icon={Award}
          color="purple"
        />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {stats?.schedule?.map((daySchedule) => {
              const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
              if (daySchedule._id === today) {
                return (
                  <div key={daySchedule._id} className="space-y-3">
                    {daySchedule.periods?.map((period, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {period.startTime} - {period.endTime}
                            </p>
                            <p className="text-sm text-gray-500">
                              {period.subject?.label || 'Subject'} with {period.teacher?.label || 'Teacher'}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Period {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
            {(!stats?.schedule || stats.schedule.length === 0) && (
              <p className="text-sm text-gray-500">No classes scheduled for today</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upcoming Exams
            </h3>
            <div className="space-y-4">
              {stats.upcomingExams?.length > 0 ? (
                stats.upcomingExams.map((exam) => (
                  <div key={exam._id} className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {exam.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {exam.type} - {new Date(exam.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Duration: {exam.duration} minutes
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No upcoming exams</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Grades
            </h3>
            <div className="space-y-4">
              {stats.recentGrades?.length > 0 ? (
                stats.recentGrades.map((grade) => (
                  <div key={grade._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {grade.exam?.title || 'Exam'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {grade.subject?.name || 'Subject'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {grade.marksObtained}/{grade.totalMarks}
                      </p>
                      <p className="text-xs text-gray-500">
                        {grade.grade || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent grades available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              <span>View Profile</span>
            </Link>
            <Link
              to="/dashboard/attendance"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Attendance</span>
            </Link>
            <Link
              to="/dashboard/fees"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>Fee Status</span>
            </Link>
            <Link
              to="/dashboard/exams"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              <span>Exam Results</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
