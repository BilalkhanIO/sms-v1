// src/components/dashboard/StudentDashboard.jsx

import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import {
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Award
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

const StudentDashboard = () => {
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
          title="Attendance Rate"
          value={`${stats.studentOverview?.attendance || 0}%`}
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.studentOverview?.averageGrade || 0}%`}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Completed Assignments"
          value={stats.studentOverview?.completedAssignments || 0}
          subtitle={`of ${stats.studentOverview?.totalAssignments || 0} total`}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Merit Points"
          value={stats.studentOverview?.meritPoints || 0}
          icon={Award}
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
                      {schedule.subject}
                    </p>
                    <p className="text-sm text-gray-500">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      Teacher: {schedule.teacher} | Room {schedule.room}
                    </p>
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

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Assignments</h3>
            <div className="space-y-4">
              {stats.upcomingAssignments?.map((assignment) => (
                <div key={assignment.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {assignment.subject} - {assignment.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      new Date(assignment.dueDate) < new Date(Date.now() + 86400000)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {new Date(assignment.dueDate) < new Date(Date.now() + 86400000)
                        ? 'Due Soon'
                        : 'Upcoming'}
                    </span>
                  </div>
                </div>
              ))}
              {(!stats.upcomingAssignments || stats.upcomingAssignments.length === 0) && (
                <p className="text-sm text-gray-500">No upcoming assignments</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      {stats.subjectPerformance && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.subjectPerformance.map((subject) => (
                <div key={subject.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {subject.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subject.grade >= 90
                        ? 'bg-green-100 text-green-800'
                        : subject.grade >= 80
                        ? 'bg-blue-100 text-blue-800'
                        : subject.grade >= 70
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Grade: {subject.grade}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Attendance:</span>
                      <span>{subject.attendance}%</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Assignments:</span>
                      <span>{subject.completedAssignments}/{subject.totalAssignments}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${subject.grade}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/assignments"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>View Assignments</span>
            </Link>
            <Link
              to="/dashboard/attendance"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>View Attendance</span>
            </Link>
            <Link
              to="/dashboard/schedule"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>View Schedule</span>
            </Link>
            <Link
              to="/dashboard/grades"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              <span>View Grades</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
