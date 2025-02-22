// src/components/dashboard/TeacherDashboard.jsx
import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import {
  Users,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, subtitle, color = 'blue' }) => {
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
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
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
          title="My Classes"
          value={stats.assignedClasses}
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.todayAttendance || 0}%`}
          icon={CheckCircle}
          color="purple"
        />
        <StatCard
          title="Pending Assignments"
          value={stats.pendingAssignments}
          icon={FileText}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {stats.todaySchedule?.map((schedule) => (
                <div key={schedule.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {schedule.subject} - Class {schedule.className}
                    </p>
                    <p className="text-sm text-gray-500">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="text-sm text-gray-500">Room {schedule.room}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      schedule.status === 'ongoing'
                        ? 'bg-green-100 text-green-800'
                        : schedule.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!stats.todaySchedule || stats.todaySchedule.length === 0) && (
                <p className="text-sm text-gray-500">No classes scheduled for today</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Submissions</h3>
            <div className="space-y-4">
              {stats.recentSubmissions?.map((submission) => (
                <div key={submission.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {submission.student} - {submission.assignment}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(submission.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      submission.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!stats.recentSubmissions || stats.recentSubmissions.length === 0) && (
                <p className="text-sm text-gray-500">No recent submissions</p>
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
              to="/dashboard/attendance"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Take Attendance</span>
            </Link>
            <Link
              to="/dashboard/assignments/new"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>Create Assignment</span>
            </Link>
            <Link
              to="/dashboard/grades"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              <span>Enter Grades</span>
            </Link>
            <Link
              to="/dashboard/schedule"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>View Schedule</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Class Overview */}
      {stats.classOverview && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Class Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.classOverview.map((cls) => (
                <div key={cls.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      Class {cls.name}
                    </h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {cls.totalStudents} students
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Attendance: {cls.attendance}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Assignments: {cls.completedAssignments}/{cls.totalAssignments}
                    </p>
                    <p className="text-sm text-gray-500">
                      Average Grade: {cls.averageGrade}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
