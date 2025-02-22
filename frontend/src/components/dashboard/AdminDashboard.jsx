// src/components/dashboard/AdminDashboard.jsx
import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from '../common/Spinner';
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="font-medium">
                {trend > 0 ? '+' : ''}{trend}%
              </span>
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

  if (isLoading) {
    return <Spinner size="large" />;
  }

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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          trend={stats.studentGrowth}
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          trend={stats.teacherGrowth}
          color="green"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={School}
          color="purple"
        />
        <StatCard
          title="Total Subjects"
          value={stats.totalSubjects}
          icon={BookOpen}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {stats.recentActivities?.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {stats.recentActivities?.length === 0 && (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {stats.upcomingEvents?.map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.description && (
                      <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {stats.upcomingEvents?.length === 0 && (
              <p className="text-sm text-gray-500">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/students/new"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              <span>Add Student</span>
            </Link>
            <Link
              to="/dashboard/teachers/new"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              <span>Add Teacher</span>
            </Link>
            <Link
              to="/dashboard/classes/new"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <School className="w-5 h-5 mr-2" />
              <span>Add Class</span>
            </Link>
            <Link
              to="/dashboard/users/create"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              <span>Add User</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {stats.performanceMetrics && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.performanceMetrics.averageAttendance}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Class Pass Rate</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stats.performanceMetrics.passRate}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Teacher-Student Ratio</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  1:{stats.performanceMetrics.teacherStudentRatio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;