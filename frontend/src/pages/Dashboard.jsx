//src/pages/Dashboard.jsx
import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import ParentDashboard from "../components/dashboard/ParentDashboard.jsx";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const renderDashboard = () => {
    switch (user?.role) {
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
        return <div>Unauthorized</div>;
    }
  };

  return <div className="container mx-auto p-4">{renderDashboard()}</div>;
};

export default Dashboard;
