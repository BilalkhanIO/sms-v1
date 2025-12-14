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

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Today's Schedule */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.schedule?.map((daySchedule) => (
              <div key={daySchedule._id} className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <CardDescription className="text-sm font-medium">
                    {daySchedule._id} - {daySchedule.periods?.length || 0} periods
                  </CardDescription>
                  <p className="text-xs text-muted-foreground">
                    {daySchedule.periods?.map(period =>
                      `${period.startTime}-${period.endTime}`
                    ).join(', ')}
                  </p>
                </div>
              </div>
            ))}
            {(!stats?.schedule || stats.schedule.length === 0) && (
              <CardDescription>No schedule available</CardDescription>
            )}
          </CardContent>
        </Card>

        {/* Recent Submissions (Using Upcoming Exams for now) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.upcomingExams?.map((exam) => (
              <div key={exam._id} className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <CardDescription className="text-sm font-medium">
                    {exam.title}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground">
                    {new Date(exam.date).toLocaleDateString()} - {exam.type}
                  </p>
                </div>
                <Badge variant="outline">{exam.status}</Badge>
              </div>
            ))}
            {(!stats?.upcomingExams || stats.upcomingExams.length === 0) && (
              <CardDescription>No upcoming exams</CardDescription>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats?.schedule?.map((daySchedule) => {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
            if (daySchedule._id === today) {
              return (
                <div key={daySchedule._id} className="space-y-3">
                  {(daySchedule.periods || []).map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardDescription className="font-medium">
                            {period.startTime} - {period.endTime}
                          </CardDescription>
                          <p className="text-sm text-muted-foreground">
                            {period.subject?.label || 'Subject'} - Class {period.class?.label || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <Link to="/dashboard/attendance/create" className="text-sm">
                        <Button variant="outline" size="sm">Attendance</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}
          {(!stats?.schedule || stats.schedule.length === 0) && (
            <CardDescription>No classes scheduled for today</CardDescription>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/attendance/create">
                <CheckCircle className="w-5 h-5 text-blue-500 mb-2" />
                <CardDescription className="text-sm font-medium">Take Attendance</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/exams/create">
                <FileText className="w-5 h-5 text-green-500 mb-2" />
                <CardDescription className="text-sm font-medium">Create Exam</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/students">
                <BookOpen className="w-5 h-5 text-purple-500 mb-2" />
                <CardDescription className="text-sm font-medium">View Students</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/calendar/create">
                <Calendar className="w-5 h-5 text-orange-500 mb-2" />
                <CardDescription className="text-sm font-medium">Add Event</CardDescription>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exams */}
      {stats?.upcomingExams && stats.upcomingExams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.upcomingExams.map((exam) => (
                <Card key={exam._id} className="p-4 bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-sm">{exam.title}</CardTitle>
                    <Badge variant="outline">{exam.type}</Badge>
                  </div>
                  <div className="space-y-1">
                    <CardDescription>
                      Date: {new Date(exam.date).toLocaleDateString()}
                    </CardDescription>
                    <CardDescription>
                      Duration: {exam.duration} minutes
                    </CardDescription>
                    <CardDescription>
                      Total Marks: {exam.totalMarks}
                    </CardDescription>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
