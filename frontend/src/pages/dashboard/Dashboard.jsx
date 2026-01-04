import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import SuperAdminDashboard from "../../components/dashboard/SuperAdminDashboard";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import TeacherDashboard from "../../components/dashboard/TeacherDashboard";
import StudentDashboard from "../../components/dashboard/StudentDashboard";
import ParentDashboard from "../../components/dashboard/ParentDashboard";
import MultiSchoolAdminDashboard from "../../components/dashboard/MultiSchoolAdminDashboard";

const Dashboard = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case "SUPER_ADMIN":
      return <SuperAdminDashboard />;
    case "SCHOOL_ADMIN":
      return <AdminDashboard />;
    case "TEACHER":
      return <TeacherDashboard />;
    case "STUDENT":
      return <StudentDashboard />;
    case "PARENT":
      return <ParentDashboard />;
    case "MULTI_SCHOOL_ADMIN":
        return <MultiSchoolAdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default Dashboard;