// src/components/dashboard/ParentDashboard.jsx

import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  MessageCircle
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

const ParentDashboard = () => {
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
          title="Total Wards"
          value={stats.parentOverview?.totalWards || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Average Attendance"
          value={`${stats.parentOverview?.averageAttendance || 0}%`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pending Assignments"
          value={stats.parentOverview?.pendingAssignments || 0}
          icon={FileText}
          color="orange"
        />
        <StatCard
          title="Unread Messages"
          value={stats.parentOverview?.unreadMessages || 0}
          icon={MessageCircle}
          color="purple"
        />
      </div>

      {/* Wards Overview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Wards Overview</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stats.wardsOverview?.map((ward) => (
              <div key={ward.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {ward.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Class {ward.class} - Roll No: {ward.rollNumber}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/wards/${ward.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Attendance</p>
                    <p className="text-lg font-medium text-gray-900">
                      {ward.attendance}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Grade</p>
                    <p className="text-lg font-medium text-gray-900">
                      {ward.averageGrade}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assignments</p>
                    <p className="text-lg font-medium text-gray-900">
                      {ward.completedAssignments}/{ward.totalAssignments}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Behavior</p>
                    <p className="text-lg font-medium text-gray-900">
                      {ward.behaviorPoints} pts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {(!stats.upcomingEvents || stats.upcomingEvents.length === 0) && (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Communications</h3>
            <div className="space-y-4">
              {stats.recentCommunications?.map((comm) => (
                <div key={comm.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {comm.subject}
                    </p>
                    <p className="text-sm text-gray-500">
                      From: {comm.from} | {new Date(comm.timestamp).toLocaleString()}
                    </p>
                    {comm.preview && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {comm.preview}
                      </p>
                    )}
                  </div>
                  {!comm.read && (
                    <div className="flex-shrink-0">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
              {(!stats.recentCommunications || stats.recentCommunications.length === 0) && (
                <p className="text-sm text-gray-500">No recent communications</p>
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
              to="/dashboard/messages/new"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>Contact Teacher</span>
            </Link>
            <Link
              to="/dashboard/attendance"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>View Attendance</span>
            </Link>
            <Link
              to="/dashboard/grades"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              <span>View Grades</span>
            </Link>
            <Link
              to="/dashboard/calendar"
              className="inline-flex items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>School Calendar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;