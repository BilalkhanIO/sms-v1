import React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoute, PrivateRoute } from "./ProtectedRoutes";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/Users";
import UserDetail from "../components/user/UserDetail";
import UpdateUserForm from "../components/user/UpdateUserForm";
import UserProfile from "../components/UserProfile";
import TeacherList from "../pages/teachers/TeacherList";
import TeacherDetails from "../pages/teachers/TeacherDetails";
import CreateTeacher from "../pages/teachers/CreateTeacher";
import UpdateTeacher from "../pages/teachers/UpdateTeacher";
import StudentList from "../pages/students/StudentList";
import StudentDetails from "../pages/students/StudentDetails";
import CreateStudent from "../pages/students/CreateStudent";
import UpdateStudent from "../pages/students/UpdateStudent";
import ClassList from "../pages/classes/ClassList";
import ClassDetails from "../pages/classes/ClassDetails";
import CreateClass from "../pages/classes/CreateClass";
import UpdateClass from "../pages/classes/UpdateClass";
import AttendanceList from "../pages/attendance/AttendanceList";
import AttendanceDetails from "../pages/attendance/AttendanceDetails";
import AttendanceForm from "../pages/attendance/AttendanceForm";
import SubjectList from "../pages/subjects/SubjectList";
import SubjectDetails from "../pages/subjects/SubjectDetails";
import SubjectForm from "../pages/subjects/SubjectForm";
import ExamList from "../pages/exams/ExamList";
import ExamDetails from "../pages/exams/ExamDetails";
import ExamForm from "../pages/exams/ExamForm";
import FeesList from "../pages/fees/FeesList";
import FeesDetails from "../pages/fees/FeesDetails";
import FeesForm from "../pages/fees/FeesForm";
import CalendarList from "../pages/calendar/CalendarList";
import CalendarDetails from "../pages/calendar/CalendarDetails";
import CalendarForm from "../pages/calendar/CalendarForm";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import ParentDashboard from "../components/dashboard/ParentDashboard";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} /> {/* Default route for /dashboard */}
        <Route path="admin-dashboard" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><AdminDashboard /></PrivateRoute>} />
        <Route path="teacher-dashboard" element={<PrivateRoute roles={["TEACHER"]}><TeacherDashboard /></PrivateRoute>} />
        <Route path="student-dashboard" element={<PrivateRoute roles={["STUDENT"]}><StudentDashboard /></PrivateRoute>} />
        <Route path="parent-dashboard" element={<PrivateRoute roles={["PARENT"]}><ParentDashboard /></PrivateRoute>} />
        <Route path="users" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><Users /></PrivateRoute>} />
        <Route path="users/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UserDetail /></PrivateRoute>} />
        <Route path="users/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateUserForm /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
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
        <Route path="attendance" element={<PrivateRoute><AttendanceList /></PrivateRoute>} />
        <Route path="attendance/:id" element={<PrivateRoute><AttendanceDetails /></PrivateRoute>} />
        <Route path="attendance/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><AttendanceForm /></PrivateRoute>} />
        <Route path="subjects" element={<PrivateRoute><SubjectList /></PrivateRoute>} />
        <Route path="subjects/:id" element={<PrivateRoute><SubjectDetails /></PrivateRoute>} />
        <Route path="subjects/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><SubjectForm /></PrivateRoute>} />
        <Route path="subjects/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><SubjectForm /></PrivateRoute>} />
        <Route path="exams" element={<PrivateRoute><ExamList /></PrivateRoute>} />
        <Route path="exams/:id" element={<PrivateRoute><ExamDetails /></PrivateRoute>} />
        <Route path="exams/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ExamForm /></PrivateRoute>} />
        <Route path="exams/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ExamForm /></PrivateRoute>} />
        <Route path="fees" element={<PrivateRoute><FeesList /></PrivateRoute>} />
        <Route path="fees/:id" element={<PrivateRoute><FeesDetails /></PrivateRoute>} />
        <Route path="fees/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><FeesForm /></PrivateRoute>} />
        <Route path="fees/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><FeesForm /></PrivateRoute>} />
        <Route path="calendar" element={<PrivateRoute><CalendarList /></PrivateRoute>} />
        <Route path="calendar/:id" element={<PrivateRoute><CalendarDetails /></PrivateRoute>} />
        <Route path="calendar/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><CalendarForm /></PrivateRoute>} />
        <Route path="calendar/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><CalendarForm /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;