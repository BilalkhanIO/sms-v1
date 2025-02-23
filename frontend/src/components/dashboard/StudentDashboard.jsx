import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import { CheckCircle, FileText, Calendar, Clock } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          icon={FileText}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upcoming Exams
            </h3>
            {stats.upcomingExams?.length > 0 ? (
              stats.upcomingExams.map((exam) => (
                <div key={exam._id} className="flex items-start space-x-3 mb-4">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {exam.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(exam.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming exams</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activities
            </h3>
            {stats.activities?.length > 0 ? (
              stats.activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start space-x-3 mb-4"
                >
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
