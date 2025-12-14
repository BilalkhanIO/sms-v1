import React from "react";
import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import Spinner from "../common/Spinner";
import { Users, GraduationCap, School, BookOpen, AlertCircle, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", `text-${color}-500`)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? "N/A"}</div>
        {trend !== undefined && (
          <p className={cn("text-xs text-muted-foreground", trend > 0 ? "text-green-600" : "text-red-600")}>
            <span className="font-medium">{trend > 0 ? "+" : ""}{trend}%</span>
            <span className="ml-1">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  console.log("AdminDashboard - stats:", stats); // Add console log
  console.log("AdminDashboard - overview:", stats?.overview); // Add console log
  console.log("AdminDashboard - recentExams:", stats?.recentExams); // Add console log
  console.log("AdminDashboard - activities:", stats?.activities); // Add console log


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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={overview.totalStudents} icon={GraduationCap} color="blue" />
        <StatCard title="Total Teachers" value={overview.totalTeachers} icon={Users} color="green" />
        <StatCard title="Total Classes" value={overview.totalClasses} icon={School} color="purple" />
        <StatCard title="Active Users" value={overview.activeUsers} icon={BookOpen} color="orange" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity._id} className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <CardDescription>{activity.description}</CardDescription>
                    <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <CardDescription>No recent activities</CardDescription>
            )}
          </CardContent>
        </Card>

        {/* Recent Exams */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Exams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExams.length > 0 ? (
              recentExams.map((exam) => (
                <div key={exam._id} className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <CardDescription>{exam.title}</CardDescription>
                    <p className="text-xs text-muted-foreground">{exam.type} - {new Date(exam.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <CardDescription>No recent exams</CardDescription>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* System Status */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <CardDescription>Database</CardDescription>
              <Badge variant="outline" className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <CardDescription>File Storage</CardDescription>
              <Badge variant="outline" className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <CardDescription>Email Service</CardDescription>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <CardDescription>Backup</CardDescription>
              <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
                <Link to="/dashboard/students/create">
                  <GraduationCap className="w-5 h-5 text-blue-500 mb-2" />
                  <CardDescription className="text-sm font-medium">Add Student</CardDescription>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
                <Link to="/dashboard/teachers/create">
                  <Users className="w-5 h-5 text-green-500 mb-2" />
                  <CardDescription className="text-sm font-medium">Add Teacher</CardDescription>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
                <Link to="/dashboard/classes/create">
                  <School className="w-5 h-5 text-purple-500 mb-2" />
                  <CardDescription className="text-sm font-medium">Add Class</CardDescription>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
                <Link to="/dashboard/users/create">
                  <Users className="w-5 h-5 text-orange-500 mb-2" />
                  <CardDescription className="text-sm font-medium">Add User</CardDescription>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
                <Link to="/dashboard/subjects/create">
                  <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
                  <CardDescription className="text-sm font-medium">Add Subject</CardDescription>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col items-start text-left">
                <Link to="/dashboard/exams/create">
                  <Calendar className="w-5 h-5 text-green-500 mb-2" />
                  <CardDescription className="text-sm font-medium">Schedule Exam</CardDescription>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      {overview.feeSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4">
                <CardDescription>Total Fees</CardDescription>
                <div className="text-2xl font-bold">${overview.feeSummary.totalAmount}</div>
              </Card>
              <Card className="p-4">
                <CardDescription>Total Paid</CardDescription>
                <div className="text-2xl font-bold">${overview.feeSummary.totalPaid}</div>
              </Card>
              <Card className="p-4">
                <CardDescription>Pending</CardDescription>
                <div className="text-2xl font-bold">${overview.feeSummary.pending}</div>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;