import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import { Users, GraduationCap, School, BookOpen, AlertCircle, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
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
          <p className="mt-2 text-3xl font-bold text-gray-900">{value ?? "N/A"}</p>
          {trend !== undefined && (
            <p className={`mt-2 text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              <span className="font-medium">{trend > 0 ? "+" : ""}{trend}%</span>
              <span className="ml-1">from last month</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <Spinner size="large" />;
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <p className="mt-2 text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Adjusted to match backend structure
  const overview = stats?.overview || {};
  const recentExams = stats?.recentExams || [];
  const activities = stats?.activities || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={overview.totalStudents} icon={GraduationCap} color="blue" />
        <StatCard title="Total Teachers" value={overview.totalTeachers} icon={Users} color="green" />
        <StatCard title="Total Classes" value={overview.totalClasses} icon={School} color="purple" />
        <StatCard title="Active Users" value={overview.activeUsers} icon={BookOpen} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activities</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {stats.upcomingEvents?.length > 0 ? (
                stats.upcomingEvents.map((event) => (
                  <div key={event._id} className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{new Date(event.start).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/dashboard/students/create" className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>Add Student</span>
            </Link>
            <Link to="/dashboard/teachers/create" className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <Users className="w-5 h-5 mr-2" />
              <span>Add Teacher</span>
            </Link>
            <Link to="/dashboard/classes/create" className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <School className="w-5 h-5 mr-2" />
              <span>Add Class</span>
            </Link>
            <Link to="/dashboard/users/create" className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <Users className="w-5 h-5 mr-2" />
              <span>Add User</span>
            </Link>
          </div>
        </div>
      </div>

      {overview.feeSummary && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Fees</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">${overview.feeSummary.totalAmount}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">${overview.feeSummary.totalPaid}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">${overview.feeSummary.pending}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;