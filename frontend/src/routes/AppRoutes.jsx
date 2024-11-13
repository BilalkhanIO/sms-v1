import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import FeeDashboardPage from '../pages/fee/FeeDashboardPage';
import CalendarPage from '../pages/calendar/CalendarPage';
import ProfilePage from '../pages/ProfilePage';
import TeacherStudentsPage from '../pages/teacher/TeacherStudentsPage';
import StudentGradesPage from '../pages/student/StudentGradesPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

const AppRoutes = () => {
  return (
    <Routes
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
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
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Calendar Routes */}
        <Route path="calendar" element={<CalendarPage />} />

        {/* Admin Routes */}
        <Route path="admin">
          <Route 
            path="users" 
            element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
                <UserManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="fees" 
            element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
                <FeeDashboardPage />
              </ProtectedRoute>
            } 
          />
          {/* Add admin calendar route */}
          <Route 
            path="calendar" 
            element={
              <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
                <CalendarPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Teacher Routes */}
        <Route path="teacher">
          <Route 
            path="students" 
            element={
              <ProtectedRoute roles={['TEACHER']}>
                <TeacherStudentsPage />
              </ProtectedRoute>
            } 
          />
          {/* Add teacher calendar route */}
          <Route 
            path="calendar" 
            element={
              <ProtectedRoute roles={['TEACHER']}>
                <CalendarPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Student Routes */}
        <Route path="student">
          <Route 
            path="grades" 
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <StudentGradesPage />
              </ProtectedRoute>
            } 
          />
          {/* Add student calendar route */}
          <Route 
            path="calendar" 
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <CalendarPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Route>

      {/* Redirect login to auth/login */}
      <Route path="login" element={<Navigate to="/auth/login" replace />} />
      <Route path="register" element={<Navigate to="/auth/register" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 