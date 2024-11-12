import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import TeacherDashboard from '../pages/dashboard/TeacherDashboard';

// Admin Pages
import UserManagementPage from '../pages/admin/UserManagementPage';

//others Pages
import ExamManagementPage from '../pages/exam/ExamManagementPage';
import FeeDashboardPage from '../pages/fee/FeeDashboardPage';

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />
      } />
      <Route path="/register" element={
        !isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />
      } />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route path="/" element={
    
          <MainLayout />
        
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Admin Routes */}
        <Route path="admin">
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
              <UserManagementPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Teacher Routes */}
        <Route path="teacher">
          <Route path="dashboard" element={
            <ProtectedRoute roles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
        </Route>

        {/* Add other routes here */}
        {/* <Route path='/exam' element={<ExamManagementPage/>}/> */}
        <Route path='/fee' element ={<FeeDashboardPage/>}/>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 