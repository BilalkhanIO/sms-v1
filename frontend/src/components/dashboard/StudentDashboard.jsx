import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import { CheckCircle, FileText, Calendar, Clock, BookOpen, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", `text-${color}-500`)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? "N/A"}</div>
      </CardContent>
    </Card>
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
                              {period.subject?.label || 'Subject'} with {period.teacher?.label || 'Teacher'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Period {index + 1}</Badge>
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

        <div className="grid gap-4">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.upcomingExams?.length > 0 ? (
                stats.upcomingExams.map((exam) => (
                  <div key={exam._id} className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <CardDescription className="font-medium">
                        {exam.title}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        {exam.type} - {new Date(exam.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duration: {exam.duration} minutes
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <CardDescription>No upcoming exams</CardDescription>
              )}
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentGrades?.length > 0 ? (
                stats.recentGrades.map((grade) => (
                  <div key={grade._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <CardDescription className="font-medium">
                        {grade.exam?.title || 'Exam'}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        {grade.subject?.name || 'Subject'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {grade.marksObtained}/{grade.totalMarks}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {grade.grade || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <CardDescription>No recent grades available</CardDescription>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/profile">
                <Users className="w-5 h-5 text-blue-500 mb-2" />
                <CardDescription className="text-sm font-medium">View Profile</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/attendance">
                <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                <CardDescription className="text-sm font-medium">Attendance</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/fees">
                <FileText className="w-5 h-5 text-orange-500 mb-2" />
                <CardDescription className="text-sm font-medium">Fee Status</CardDescription>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
              <Link to="/dashboard/exams">
                <BookOpen className="w-5 h-5 text-purple-500 mb-2" />
                <CardDescription className="text-sm font-medium">Exam Results</CardDescription>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
