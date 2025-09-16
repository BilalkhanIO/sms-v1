import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import TeacherDashboard from "../../components/dashboard/TeacherDashboard";
import StudentDashboard from "../../components/dashboard/StudentDashboard";
import ParentDashboard from "../../components/dashboard/ParentDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("Dashboard - User:", user); // Debug log

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = (user) => {
    console.log("Rendering dashboard for role:", user.role); // Debug log
    switch (user.role) {
      case "SUPER_ADMIN":
      case "SCHOOL_ADMIN":
        return <AdminDashboard />;
      case "TEACHER":
        return <TeacherDashboard />;
      case "STUDENT":
        return <StudentDashboard />;
      case "PARENT":
        return <ParentDashboard />;
      default:
        return (
          <div className="text-center text-red-600">
            Unauthorized Role: {user.role}
          </div>
        );
    }
  };

  return <div className="container mx-auto p-4">{renderDashboard(user)}</div>;
};

export default Dashboard;
