import React from "react";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../api/usersApi";
import { useGetSchoolStatsQuery } from "../../api/dashboardApi";
import { useGetActivityLogsQuery } from "../../api/activityLogsApi";
import LoadingSpinner from "../LoadingSpinner";
import UserRoleDistributionChart from "./charts/UserRoleDistributionChart";
import UserStatusDistributionChart from "./charts/UserStatusDistributionChart";
import SchoolStatusDistributionChart from "./charts/SchoolStatusDistributionChart";
import UserRegistrationTrendsChart from "./charts/UserRegistrationTrendsChart";
import {
  Users,
  School,
  GraduationCap,
  UserCheck,
  AlertTriangle,
  Activity,
  UserPlus,
  Settings,
} from "lucide-react";

// shadcn/ui components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="flex flex-col">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={cn("h-4 w-4 text-muted-foreground", color)} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const getIconForActivityType = (type) => {
  switch (type) {
    case "USER_CREATED":
      return <UserCheck className="w-4 h-4 text-green-600" />;
    case "SCHOOL_CREATED":
      return <School className="w-4 h-4 text-blue-600" />;
    // Add more cases for other activity types relevant to SuperAdmin
    // e.g., "USER_LOGIN", "SETTING_UPDATED", "SCHOOL_UPDATED", etc.
    default:
      return <Activity className="w-4 h-4 text-gray-600" />; // Generic icon
  }
};

const RecentActivity = ({ activities }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Activity className="w-5 h-5 mr-2" />
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {(activities || []).map((activity) => (
        <div
          key={activity._id} // Use backend _id for key
          className="flex items-start space-x-3 border-b pb-3 last:border-b-0"
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {getIconForActivityType(activity.type)} {/* Use dynamic icon */}
            </div>
          </div>
          <div>
            <CardDescription>{activity.description}</CardDescription>
            <p className="text-xs text-muted-foreground">
              {new Date(activity.createdAt).toLocaleString()} {/* Use createdAt */}
            </p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AlertsList = ({ alerts }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        System Alerts
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {(alerts || []).map((alert, index) => (
        <div
          key={index}
          className={cn(
            "p-3 rounded-md flex items-start",
            alert.type === "warning" ? "bg-yellow-50" : "bg-red-50"
          )}
        >
          <AlertTriangle
            className={cn(
              "w-5 h-5 mt-0.5",
              alert.type === "warning" ? "text-yellow-400" : "text-red-400"
            )}
          />
          <div className="ml-3">
            <h4 className="text-sm font-medium">{alert.title}</h4>
            <CardDescription className="text-sm">
              {alert.message}
            </CardDescription>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const SuperAdminDashboard = () => {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: stats, isLoading: statsLoading } = useGetSchoolStatsQuery();
  const { data: activityLogs, isLoading: activityLogsLoading } = useGetActivityLogsQuery({ limit: 5 }); // Fetch top 5 recent activities

  if (usersLoading || statsLoading || activityLogsLoading) {
    return <LoadingSpinner />;
  }

  const mockActivities = [
    {
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      description: 'New school "International Academy" registered',
      timestamp: "2 hours ago",
    },
    {
      icon: <Users className="w-4 h-4 text-green-600" />,
      description: "Added 3 new administrators",
      timestamp: "5 hours ago",
    },
    // Add more activities as needed
  ];

  const mockAlerts = [
    {
      type: "warning",
      title: "System Update Required",
      message: "A new system update is available. Please schedule maintenance.",
    },
    {
      type: "error",
      title: "Failed Login Attempts",
      message: "Multiple failed login attempts detected from IP 192.168.1.1",
    },
  ];

  const statistics = {
    totalSchools: stats?.totalSchools || 0,
    activeUsers: stats?.activeUsers || 0,
    totalStudents: stats?.totalStudents || 0,
    pendingApprovals: stats?.pendingApprovals || 0,
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Schools"
          value={statistics.totalSchools}
          icon={School}
          color="text-blue-500" // Use shadcn/ui color variables if possible, or adjust
        />
        <StatCard
          title="Active Users"
          value={statistics.activeUsers}
          icon={Users}
          color="text-green-500"
        />
        <StatCard
          title="Total Students"
          value={statistics.totalStudents}
          icon={GraduationCap}
          color="text-purple-500"
        />
        <StatCard
          title="Pending Approvals"
          value={statistics.pendingApprovals}
          icon={UserCheck}
          color="text-yellow-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={activityLogs?.data || []} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsList alerts={mockAlerts} />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UserRoleDistributionChart />
        <UserStatusDistributionChart />
        <SchoolStatusDistributionChart />
        <UserRegistrationTrendsChart />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col items-start text-left"
              >
                <Link to="/dashboard/schools/create">
                  <School className="w-6 h-6 text-blue-500 mb-2" />
                  <h4 className="font-medium">Add New School</h4>
                  <p className="text-sm text-muted-foreground">
                    Register a new school in the system
                  </p>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col items-start text-left"
              >
                <Link to="/dashboard/users/create">
                  {" "}
                  {/* Link to create user */}
                  <UserPlus className="w-6 h-6 text-green-500 mb-2" />
                  <h4 className="font-medium">Create User</h4>{" "}
                  {/* Changed from Create Admin */}
                  <p className="text-sm text-muted-foreground">
                    Add a new user to the system
                  </p>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex-col items-start text-left"
              >
                <Link to="/dashboard/settings">
                  {" "}
                  {/* Link to settings */}
                  <Settings className="w-6 h-6 text-purple-500 mb-2" />
                  <h4 className="font-medium">System Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure system-wide settings
                  </p>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
};

export default SuperAdminDashboard;
