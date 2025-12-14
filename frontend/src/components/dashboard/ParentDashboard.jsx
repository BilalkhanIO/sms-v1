import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import {
  Users,
  CheckCircle,
  FileText,
  MessageCircle,
  Calendar,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, subtitle, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", `text-${color}-500`)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? "N/A"}</div>
        {subtitle && <CardDescription className="text-sm">{subtitle}</CardDescription>}
      </CardContent>
    </Card>
  );
};

const ParentDashboard = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <Spinner size="large" />;
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading dashboard
            </h3>
            <p className="mt-2 text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const parentOverview = stats?.parentOverview || {};

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Wards"
          value={parentOverview.totalWards}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Attendance Rate"
          value={`${parentOverview.attendanceSummary?.PRESENT || 0}%`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pending Fees"
          value={parentOverview.feeStatus?.PENDING?.total || 0}
          icon={FileText}
          color="orange"
        />
        <StatCard
          title="Messages"
          value={0}
          icon={MessageCircle}
          color="purple"
        />{" "}
        {/* Placeholder - backend doesn't provide this */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wards Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {parentOverview.wards?.length > 0 ? (
              parentOverview.wards.map((ward) => (
                <Card key={ward._id} className="p-4 bg-muted">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {ward.user?.firstName} {ward.user?.lastName}
                      </h4>
                      <CardDescription>
                        Admission: {ward.admissionNumber} | Class {ward.class?.name || "N/A"}
                      </CardDescription>
                    </div>
                    <Link
                      to={`/dashboard/students/${ward._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <CardDescription>Attendance</CardDescription>
                      <p className="text-sm font-medium text-green-600">
                        {ward.attendanceRate || 0}%
                      </p>
                    </div>
                    <div>
                      <CardDescription>Average Grade</CardDescription>
                      <p className="text-sm font-medium text-blue-600">
                        {ward.averageGrade || 'N/A'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <CardDescription>No wards assigned</CardDescription>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.upcomingEvents?.length > 0 ? (
              stats.upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <CardDescription className="font-medium">
                      {event.title}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <CardDescription>No upcoming events</CardDescription>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentGrades && stats.recentGrades.length > 0 ? (
              stats.recentGrades.map((grade) => (
                <div key={grade._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardDescription className="font-medium">
                        {grade.exam?.title || 'Exam'}
                      </CardDescription>
                      <CardDescription className="text-sm text-muted-foreground">
                        {grade.subject?.name || 'Subject'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <CardDescription className="text-sm font-bold text-gray-900">
                      {grade.marksObtained}/{grade.totalMarks}
                    </CardDescription>
                    <CardDescription className="text-xs text-muted-foreground">
                      {grade.grade || 'N/A'}
                    </CardDescription>
                  </div>
                </div>
              ))
            ) : (
              <CardDescription>No recent grades</CardDescription>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.activities?.length > 0 ? (
              stats.activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start space-x-3"
                >
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <CardDescription className="font-medium">
                      {activity.description}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <CardDescription>No recent activities</CardDescription>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/messages">
                <MessageCircle className="w-5 h-5 text-blue-500 mb-2" />
                <CardDescription className="text-sm font-medium">Contact Teacher</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/attendance">
                <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                <CardDescription className="text-sm font-medium">View Attendance</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/grades">
                <FileText className="w-5 h-5 text-orange-500 mb-2" />
                <CardDescription className="text-sm font-medium">View Grades</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/calendar">
                <Calendar className="w-5 h-5 text-purple-500 mb-2" />
                <CardDescription className="text-sm font-medium">School Calendar</CardDescription>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;