import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoute, PrivateRoute } from "./ProtectedRoutes";

// Core Pages
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Dashboard Components
import Dashboard from "../pages/dashboard/Dashboard";
import SuperAdminDashboard from "../components/dashboard/SuperAdminDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import ParentDashboard from "../components/dashboard/ParentDashboard";

// User Management
import UserList from "../pages/users/UserList";
import UserDetail from "../components/user/UserDetail";
import CreateUserForm from "../components/CreateUserForm";
import UpdateUser from "../pages/users/UpdateUser";
import UserProfilePage from "../pages/users/UserProfilePage"; // New import
import TeacherList from "../pages/teachers/TeacherList";
import TeacherDetails from "../pages/teachers/TeacherDetails";
import CreateTeacher from "../pages/teachers/CreateTeacher";
import UpdateTeacher from "../pages/teachers/UpdateTeacher";

// Student Management
import StudentList from "../pages/students/StudentList";
import StudentDetails from "../pages/students/StudentDetails";
import CreateStudent from "../pages/students/CreateStudent";
import UpdateStudent from "../pages/students/UpdateStudent";

// Class Management
import ClassList from "../pages/classes/ClassList";
import ClassDetails from "../pages/classes/ClassDetails";
import CreateClass from "../pages/classes/CreateClass";
import UpdateClass from "../pages/classes/UpdateClass";

// School Management
import SchoolList from "../pages/schools/SchoolList";
import CreateSchool from "../pages/schools/CreateSchool";
import UpdateSchool from "../pages/schools/UpdateSchool";
import SchoolDetails from "../pages/schools/SchoolDetails";
import SchoolDetailsDashboard from "../pages/schools/SchoolDetailsDashboard";
import SystemSettings from "../pages/settings/SystemSettings";
import ActivityLogsList from "../pages/activity-logs/ActivityLogsList";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} /> {/* Default route for /dashboard */}
        <Route path="profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="admin-dashboard" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><AdminDashboard /></PrivateRoute>} />
        <Route path="teacher-dashboard" element={<PrivateRoute roles={["TEACHER"]}><TeacherDashboard /></PrivateRoute>} />
        <Route path="student-dashboard" element={<PrivateRoute roles={["STUDENT"]}><StudentDashboard /></PrivateRoute>} />
        <Route path="parent-dashboard" element={<PrivateRoute roles={["PARENT"]}><ParentDashboard /></PrivateRoute>} />
        <Route path="users" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UserList /></PrivateRoute>} />
        <Route path="users/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateUserForm /></PrivateRoute>} />
        <Route path="users/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UserDetail /></PrivateRoute>} />
        <Route path="users/edit/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateUser /></PrivateRoute>} />
        <Route path="teachers" element={<PrivateRoute><TeacherList /></PrivateRoute>} />
        <Route path="teachers/:id" element={<PrivateRoute><TeacherDetails /></PrivateRoute>} />
        <Route path="teachers/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateTeacher /></PrivateRoute>} />
        <Route path="teachers/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateTeacher /></PrivateRoute>} />
        <Route path="students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
        <Route path="students/:id" element={<PrivateRoute><StudentDetails /></PrivateRoute>} />
        <Route path="students/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><CreateStudent /></PrivateRoute>} />
        <Route path="students/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><UpdateStudent /></PrivateRoute>} />
        <Route path="classes" element={<PrivateRoute><ClassList /></PrivateRoute>} />
        <Route path="classes/:id" element={<PrivateRoute><ClassDetails /></PrivateRoute>} />
        <Route path="classes/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateClass /></PrivateRoute>} />
        <Route path="classes/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateClass /></PrivateRoute>} />

        <Route path="schools" element={<PrivateRoute roles={["SUPER_ADMIN"]}><SchoolList /></PrivateRoute>} />
        <Route path="schools/create" element={<PrivateRoute roles={["SUPER_ADMIN"]}><CreateSchool /></PrivateRoute>} />
        <Route path="schools/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "MULTI_SCHOOL_ADMIN"]}><SchoolDetailsDashboard /></PrivateRoute>} />
        <Route path="schools/:id/edit" element={<PrivateRoute roles={["SUPER_ADMIN"]}><UpdateSchool /></PrivateRoute>} />
        <Route path="settings" element={<PrivateRoute roles={["SUPER_ADMIN"]}><SystemSettings /></PrivateRoute>} />
        <Route path="activity-logs" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><ActivityLogsList /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;