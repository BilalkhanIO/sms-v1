import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import FeeDashboardPage from '../pages/fee/FeeDashboardPage';
import CalendarPage from '../pages/calendar/CalendarPage';
import UserProfilePage from '../pages/profile/UserProfilePage';
import TeacherStudentsPage from '../pages/teacher/TeacherStudentsPage';
import StudentGradesPage from '../pages/student/StudentGradesPage';
import ExamManagementPage from '../pages/exam/ExamManagementPage';
import LeaveManagementPage from '../pages/leave/LeaveManagementPage';
import AttendanceManagementPage from '../pages/attendance/AttendanceManagementPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import { ROLES } from '../utils/constants';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="calendar" element={<CalendarPage />} />

        {/* Admin Routes */}
        <Route path="admin">
          <Route 
            path="users" 
            element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN]}>
                <UserManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="fees" 
            element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN]}>
                <FeeDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="exams" 
            element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN]}>
                <ExamManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="attendance" 
            element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN]}>
                <AttendanceManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="leave" 
            element={
              <ProtectedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN]}>
                <LeaveManagementPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Teacher Routes */}
        <Route path="teacher">
          <Route 
            path="students" 
            element={
              <ProtectedRoute roles={[ROLES.TEACHER]}>
                <TeacherStudentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="attendance" 
            element={
              <ProtectedRoute roles={[ROLES.TEACHER]}>
                <AttendanceManagementPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Student Routes */}
        <Route path="student">
          <Route 
            path="grades" 
            element={
              <ProtectedRoute roles={[ROLES.STUDENT]}>
                <StudentGradesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="attendance" 
            element={
              <ProtectedRoute roles={[ROLES.STUDENT]}>
                <AttendanceManagementPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Route>

      {/* Fallback Routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 