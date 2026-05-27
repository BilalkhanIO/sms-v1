import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import { useGetAvailableSuperAdminPagesQuery } from "../../api/pagesApi";

// Lazy load all potential dashboard components
const SuperAdminDashboard = lazy(() =>
  import("../../components/dashboard/SuperAdminDashboard")
);
const AdminDashboard = lazy(() =>
  import("../../components/dashboard/AdminDashboard")
);
const TeacherDashboard = lazy(() =>
  import("../../components/dashboard/TeacherDashboard")
);
const StudentDashboard = lazy(() =>
  import("../../components/dashboard/StudentDashboard")
);
const ParentDashboard = lazy(() =>
  import("../../components/dashboard/ParentDashboard")
);
const MultiSchoolAdminDashboard = lazy(() =>
  import("../../components/dashboard/MultiSchoolAdminDashboard")
);
const UserManagement = lazy(() => import("../admin/UserManagement"));
const SystemSettings = lazy(() => import("../admin/SystemSettings"));
const Reports = lazy(() => import("../admin/Reports"));
const AuditLogs = lazy(() => import("../admin/AuditLogs"));
const BackupManagement = lazy(() => import("../admin/BackupManagement"));
const SchoolList = lazy(() => import("../schools/SchoolList"));

const componentMap = {
  SuperAdminDashboard,
  AdminDashboard,
  TeacherDashboard,
  StudentDashboard,
  ParentDashboard,
  MultiSchoolAdminDashboard,
  UserManagement,
  SystemSettings,
  Reports,
  AuditLogs,
  BackupManagement,
  SchoolList,
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const {
    data: superAdminPages,
    isLoading: pagesIsLoading,
    error: pagesError,
  } = useGetAvailableSuperAdminPagesQuery(undefined, {
    skip: user?.role !== "SUPER_ADMIN",
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = () => {
    if (user.role === "SUPER_ADMIN") {
      if (pagesIsLoading) return <Spinner />;
      if (pagesError) return <div>Error loading pages.</div>;

      const currentPage = location.pathname;
      const pageConfig = superAdminPages?.find((p) => p.path === currentPage);
      const Component = pageConfig
        ? componentMap[pageConfig.component]
        : componentMap["SuperAdminDashboard"]; // Default to SuperAdminDashboard
      return Component ? <Component /> : <div>Component not found</div>;
    }

    // Correctly handle other roles
    const roleToComponentMap = {
      SCHOOL_ADMIN: "AdminDashboard",
      TEACHER: "TeacherDashboard",
      STUDENT: "StudentDashboard",
      PARENT: "ParentDashboard",
      MULTI_SCHOOL_ADMIN: "MultiSchoolAdminDashboard",
    };
    const componentName = roleToComponentMap[user.role];
    const Component = componentName ? componentMap[componentName] : null;

    return Component ? (
      <Component />
    ) : (
      <div>Dashboard not found for your role.</div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<Spinner />}>{renderDashboard()}</Suspense>
    </div>
  );
};

export default Dashboard;
