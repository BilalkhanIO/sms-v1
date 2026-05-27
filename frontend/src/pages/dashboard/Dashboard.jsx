import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../../components/common/Spinner";

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

const roleToComponentMap = {
  SUPER_ADMIN: SuperAdminDashboard,
  SCHOOL_ADMIN: AdminDashboard,
  TEACHER: TeacherDashboard,
  STUDENT: StudentDashboard,
  PARENT: ParentDashboard,
  MULTI_SCHOOL_ADMIN: MultiSchoolAdminDashboard,
};


const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const { isLoading: isUserLoading } = useSelector((state) => state.auth);

  if (isUserLoading || pagesIsLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboard = () => {
    const Component = roleToComponentMap[user.role];

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
