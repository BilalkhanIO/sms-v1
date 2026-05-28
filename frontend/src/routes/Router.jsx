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

// Exam Management
import ExamList from "../pages/exams/ExamList";
import ExamForm from "../pages/exams/ExamForm";
import ExamDetails from "../pages/exams/ExamDetails";
import ResultEntry from "../pages/exams/ResultEntry";
import ResultReport from "../pages/exams/ResultReport";

// Fee Management
import FeesList from "../pages/fees/FeesList";
import FeesForm from "../pages/fees/FeesForm";
import FeesDetails from "../pages/fees/FeesDetails";
import PaymentForm from "../pages/fees/PaymentForm";
import PaymentHistory from "../pages/fees/PaymentHistory";

// Attendance Management
import AttendanceList from "../pages/attendance/AttendanceList";
import AttendanceForm from "../pages/attendance/AttendanceForm";
import AttendanceDetails from "../pages/attendance/AttendanceDetails";

// Subject Management
import SubjectList from "../pages/subjects/SubjectList";
import CreateSubject from "../pages/subjects/CreateSubject";
import UpdateSubject from "../pages/subjects/UpdateSubject";
import SubjectDetails from "../pages/subjects/SubjectDetails";

// Calendar Management
import CalendarList from "../pages/calendar/CalendarList";
import CalendarView from "../pages/calendar/CalendarView";
import CalendarForm from "../pages/calendar/CalendarForm";
import CalendarDetails from "../pages/calendar/CalendarDetails";

// School Management
import SchoolList from "../pages/schools/SchoolList";
import CreateSchool from "../pages/schools/CreateSchool";
import UpdateSchool from "../pages/schools/UpdateSchool";
import SchoolDetails from "../pages/schools/SchoolDetails";
import SchoolDetailsDashboard from "../pages/schools/SchoolDetailsDashboard";
import SystemSettings from "../pages/settings/SystemSettings";
import ActivityLogsList from "../pages/activity-logs/ActivityLogsList";

// Super Admin Pages
import UserManagement from "../pages/admin/UserManagement";
import AdminSystemSettings from "../pages/admin/SystemSettings";
import Reports from "../pages/admin/Reports";
import AuditLogs from "../pages/admin/AuditLogs";
import BackupManagement from "../pages/admin/BackupManagement";

// New Modules
import TimetableView from "../pages/timetable/TimetableView";
import TimetableManage from "../pages/timetable/TimetableManage";
import AssignmentList from "../pages/assignments/AssignmentList";
import AssignmentDetails from "../pages/assignments/AssignmentDetails";
import LibraryList from "../pages/library/LibraryList";
import TransportList from "../pages/transport/TransportList";
import TransportDetails from "../pages/transport/TransportDetails";
import LeaveList from "../pages/leave/LeaveList";
import MessageList from "../pages/messages/MessageList";
import MessageDetails from "../pages/messages/MessageDetails";
import AcademicYearList from "../pages/academic-years/AcademicYearList";

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
        <Route path="teachers" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><TeacherList /></PrivateRoute>} />
        <Route path="teachers/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><TeacherDetails /></PrivateRoute>} />
        <Route path="teachers/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateTeacher /></PrivateRoute>} />
        <Route path="teachers/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateTeacher /></PrivateRoute>} />
        <Route path="students" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><StudentList /></PrivateRoute>} />
        <Route path="students/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "PARENT"]}><StudentDetails /></PrivateRoute>} />
        <Route path="students/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><CreateStudent /></PrivateRoute>} />
        <Route path="students/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><UpdateStudent /></PrivateRoute>} />
        <Route path="classes" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><ClassList /></PrivateRoute>} />
        <Route path="classes/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><ClassDetails /></PrivateRoute>} />
        <Route path="classes/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateClass /></PrivateRoute>} />
        <Route path="classes/update/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateClass /></PrivateRoute>} />

        {/* Exam Routes */}
        <Route path="exams" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><ExamList /></PrivateRoute>} />
        <Route path="exams/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ExamForm /></PrivateRoute>} />
        <Route path="exams/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><ExamDetails /></PrivateRoute>} />
        <Route path="exams/:id/edit" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ExamForm /></PrivateRoute>} />
        <Route path="exams/:id/results" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ResultEntry /></PrivateRoute>} />
        <Route path="exams/reports" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><ResultReport /></PrivateRoute>} />

        {/* Fee Routes */}
        <Route path="fees" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><FeesList /></PrivateRoute>} />
        <Route path="fees/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><FeesForm /></PrivateRoute>} />
        <Route path="fees/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><FeesDetails /></PrivateRoute>} />
        <Route path="fees/:id/edit" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><FeesForm /></PrivateRoute>} />
        <Route path="fees/:id/pay" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><PaymentForm /></PrivateRoute>} />
        <Route path="fees/history/:studentId" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "PARENT", "STUDENT"]}><PaymentHistory /></PrivateRoute>} />

        {/* Attendance Routes */}
        <Route path="attendance" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><AttendanceList /></PrivateRoute>} />
        <Route path="attendance/mark" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><AttendanceForm /></PrivateRoute>} />
        <Route path="attendance/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><AttendanceDetails /></PrivateRoute>} />

        {/* Subject Routes */}
        <Route path="subjects" element={<PrivateRoute><SubjectList /></PrivateRoute>} />
        <Route path="subjects/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><CreateSubject /></PrivateRoute>} />
        <Route path="subjects/:id" element={<PrivateRoute><SubjectDetails /></PrivateRoute>} />
        <Route path="subjects/:id/edit" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><UpdateSubject /></PrivateRoute>} />

        {/* Calendar Routes */}
        <Route path="calendar" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
        <Route path="calendar/events" element={<PrivateRoute><CalendarList /></PrivateRoute>} />
        <Route path="calendar/events/create" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><CalendarForm /></PrivateRoute>} />
        <Route path="calendar/events/:id" element={<PrivateRoute><CalendarDetails /></PrivateRoute>} />
        <Route path="calendar/events/:id/edit" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"]}><CalendarForm /></PrivateRoute>} />

        <Route path="schools" element={<PrivateRoute roles={["SUPER_ADMIN"]}><SchoolList /></PrivateRoute>} />
        <Route path="schools/create" element={<PrivateRoute roles={["SUPER_ADMIN"]}><CreateSchool /></PrivateRoute>} />
        <Route path="schools/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "MULTI_SCHOOL_ADMIN"]}><SchoolDetailsDashboard /></PrivateRoute>} />
        <Route path="schools/:id/edit" element={<PrivateRoute roles={["SUPER_ADMIN"]}><UpdateSchool /></PrivateRoute>} />
        <Route path="settings" element={<PrivateRoute roles={["SUPER_ADMIN"]}><SystemSettings /></PrivateRoute>} />
        <Route path="activity-logs" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><ActivityLogsList /></PrivateRoute>} />
        <Route path="admin/user-management" element={<PrivateRoute roles={["SUPER_ADMIN"]}><UserManagement /></PrivateRoute>} />
        <Route path="admin/system-settings" element={<PrivateRoute roles={["SUPER_ADMIN"]}><AdminSystemSettings /></PrivateRoute>} />
        <Route path="admin/reports" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><Reports /></PrivateRoute>} />
        <Route path="admin/audit-logs" element={<PrivateRoute roles={["SUPER_ADMIN"]}><AuditLogs /></PrivateRoute>} />
        <Route path="admin/backup-management" element={<PrivateRoute roles={["SUPER_ADMIN"]}><BackupManagement /></PrivateRoute>} />

        {/* Timetable */}
        <Route path="timetable" element={<PrivateRoute><TimetableView /></PrivateRoute>} />
        <Route path="timetable/manage" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><TimetableManage /></PrivateRoute>} />

        {/* Assignments */}
        <Route path="assignments" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><AssignmentList /></PrivateRoute>} />
        <Route path="assignments/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><AssignmentDetails /></PrivateRoute>} />

        {/* Library */}
        <Route path="library" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><LibraryList /></PrivateRoute>} />

        {/* Transport */}
        <Route path="transport" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "STUDENT", "PARENT"]}><TransportList /></PrivateRoute>} />
        <Route path="transport/:id" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><TransportDetails /></PrivateRoute>} />

        {/* Leave */}
        <Route path="leave" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"]}><LeaveList /></PrivateRoute>} />

        {/* Messages */}
        <Route path="messages" element={<PrivateRoute><MessageList /></PrivateRoute>} />
        <Route path="messages/:id" element={<PrivateRoute><MessageDetails /></PrivateRoute>} />

        {/* Academic Years */}
        <Route path="academic-years" element={<PrivateRoute roles={["SUPER_ADMIN", "SCHOOL_ADMIN"]}><AcademicYearList /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;