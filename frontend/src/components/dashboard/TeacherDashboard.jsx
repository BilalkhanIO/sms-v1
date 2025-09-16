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

  const teacherOverview = stats?.teacherOverview || {};

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Classes"
          value={teacherOverview.totalClasses || 0}
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={teacherOverview.totalStudents || 0}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Subjects"
          value={teacherOverview.totalSubjects || 0}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Upcoming Exams"
          value={stats?.upcomingExams?.length || 0}
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
              {stats?.schedule?.map((daySchedule) => (
                <div key={daySchedule._id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {daySchedule._id} - {daySchedule.periods?.length || 0} periods
                    </p>
                    <p className="text-sm text-gray-500">
                      {daySchedule.periods?.map(period => 
                        `${period.startTime}-${period.endTime}`
                      ).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.schedule || stats.schedule.length === 0) && (
                <p className="text-sm text-gray-500">No schedule available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Submissions</h3>
            <div className="space-y-4">
              {stats?.upcomingExams?.map((exam) => (
                <div key={exam._id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {exam.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(exam.date).toLocaleDateString()} - {exam.type}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {exam.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!stats?.upcomingExams || stats.upcomingExams.length === 0) && (
                <p className="text-sm text-gray-500">No upcoming exams</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Classes</h3>
          <div className="space-y-4">
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
                              {period.subject?.label || 'Subject'} - Class {period.class?.label || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to="/dashboard/attendance/create"
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                          >
                            Attendance
                          </Link>
                        </div>
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/attendance/create"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Take Attendance</span>
            </Link>
            <Link
              to="/dashboard/exams/create"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>Create Exam</span>
            </Link>
            <Link
              to="/dashboard/students"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              <span>View Students</span>
            </Link>
            <Link
              to="/dashboard/calendar/create"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>Add Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      {stats?.upcomingExams && stats.upcomingExams.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Exams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.upcomingExams.map((exam) => (
                <div key={exam._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {exam.title}
                    </h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {exam.type}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Date: {new Date(exam.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {exam.duration} minutes
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Marks: {exam.totalMarks}
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
