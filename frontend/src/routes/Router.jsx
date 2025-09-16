import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoute, PrivateRoute } from "./ProtectedRoutes";

// Core Pages
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../pages/auth/Login";
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
import Users from "../pages/Users";
import UserDetail from "../components/user/UserDetail";
import UserProfile from "../components/user/UserProfile";

// School Management
import SchoolList from "../pages/schools/SchoolList";
import CreateSchool from "../pages/schools/CreateSchool";
import UpdateSchool from "../pages/schools/UpdateSchool";
import SchoolDetails from "../pages/schools/SchoolDetails";

// Teacher Management
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

// Subject Management
import SubjectList from "../pages/subjects/SubjectList";
import CreateSubject from "../pages/subjects/CreateSubject";
import UpdateSubject from "../pages/subjects/UpdateSubject";
import SubjectDetails from "../pages/subjects/SubjectDetails";

// Calendar Management
import CalendarView from "../pages/calendar/CalendarView";

// Fee Management
import FeesList from "../pages/fees/FeesList";
import CreateFee from "../pages/fees/CreateFee";
import UpdateFee from "../pages/fees/UpdateFee";
import PaymentHistory from "../pages/fees/PaymentHistory";

// Attendance Management
import AttendanceList from "../pages/attendance/AttendanceList";
import AttendanceEntry from "../pages/attendance/AttendanceEntry";
import AttendanceReport from "../pages/attendance/AttendanceReport";

// System Settings
import Settings from "../pages/settings/Settings";
import ActivityLogs from "../pages/settings/ActivityLogs";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        {/* Role-based Dashboard Routes */}
        <Route index element={<Dashboard />} />
        <Route path="super-admin" element={<PrivateRoute roles={["SUPER_ADMIN"]}><SuperAdminDashboard /></PrivateRoute>} />
        <Route path="admin" element={<PrivateRoute roles={["SCHOOL_ADMIN"]}><AdminDashboard /></PrivateRoute>} />
        <Route path="teacher" element={<PrivateRoute roles={["TEACHER"]}><TeacherDashboard /></PrivateRoute>} />
        <Route path="student" element={<PrivateRoute roles={["STUDENT"]}><StudentDashboard /></PrivateRoute>} />
        <Route path="parent" element={<PrivateRoute roles={["PARENT"]}><ParentDashboard /></PrivateRoute>} />

        {/* Super Admin Routes */}
        <Route path="schools">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN"]}><SchoolList /></PrivateRoute>} />
          <Route path="create" element={<PrivateRoute roles={["SUPER_ADMIN"]}><CreateSchool /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute roles={["SUPER_ADMIN"]}><SchoolDetails /></PrivateRoute>} />
          <Route path="edit/:id" element={<PrivateRoute roles={["SUPER_ADMIN"]}><UpdateSchool /></PrivateRoute>} />
        </Route>

        {/* Settings Routes */}
        <Route path="settings" element={<PrivateRoute roles={["SUPER_ADMIN"]}><Settings /></PrivateRoute>} />
        <Route path="activity-logs" element={<PrivateRoute roles={["SUPER_ADMIN"]}><ActivityLogs /></PrivateRoute>} />

        {/* User Management Routes */}
        <Route path="users">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><Users /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UserDetail /></PrivateRoute>} />
        </Route>

        {/* Teacher Routes */}
        <Route path="teachers">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><TeacherList /></PrivateRoute>} />
          <Route path="create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateTeacher /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><TeacherDetails /></PrivateRoute>} />
          <Route path="edit/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateTeacher /></PrivateRoute>} />
        </Route>

        {/* Student Routes */}
        <Route path="students">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><StudentList /></PrivateRoute>} />
          <Route path="create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateStudent /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><StudentDetails /></PrivateRoute>} />
          <Route path="edit/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateStudent /></PrivateRoute>} />
        </Route>

        {/* Class Routes */}
        <Route path="classes">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ClassList /></PrivateRoute>} />
          <Route path="create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateClass /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ClassDetails /></PrivateRoute>} />
          <Route path="edit/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateClass /></PrivateRoute>} />
        </Route>

        {/* Subject Routes */}
        <Route path="subjects">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><SubjectList /></PrivateRoute>} />
          <Route path="create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateSubject /></PrivateRoute>} />
          <Route path=":id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><SubjectDetails /></PrivateRoute>} />
          <Route path="edit/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateSubject /></PrivateRoute>} />
        </Route>

        {/* Calendar Routes */}
        <Route path="calendar" element={<PrivateRoute><CalendarView /></PrivateRoute>} />

        {/* Fee Routes */}
        <Route path="fees">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><FeesList /></PrivateRoute>} />
          <Route path="create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateFee /></PrivateRoute>} />
          <Route path="edit/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateFee /></PrivateRoute>} />
          <Route path="history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
        </Route>

        {/* Attendance Routes */}
        <Route path="attendance">
          <Route index element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><AttendanceList /></PrivateRoute>} />
          <Route path="entry" element={<PrivateRoute roles={["TEACHER"]}><AttendanceEntry /></PrivateRoute>} />
          <Route path="report" element={<PrivateRoute><AttendanceReport /></PrivateRoute>} />
        </Route>

        {/* Profile Routes */}
        <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;