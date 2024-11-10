import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import StudentList from '../components/student/StudentList';
import StudentRegistrationForm from '../components/student/StudentRegistrationForm';
import StudentProfile from '../components/student/StudentProfile';
import StudentEnrollment from '../components/student/StudentEnrollment';
import AttendanceTracking from '../components/student/AttendanceTracking';
import { PERMISSIONS } from '../utils/permissions';

export const studentRoutes = [
  <Route 
    path="/students" 
    element={
      <ProtectedRoute permissions={[PERMISSIONS.VIEW_STUDENTS]}>
        <StudentList />
      </ProtectedRoute>
    } 
  />,
  <Route 
    path="/students/register" 
    element={
      <ProtectedRoute permissions={[PERMISSIONS.CREATE_STUDENT]}>
        <StudentRegistrationForm />
      </ProtectedRoute>
    } 
  />,
  <Route 
    path="/students/:id" 
    element={
      <ProtectedRoute permissions={[PERMISSIONS.VIEW_STUDENTS]}>
        <StudentProfile />
      </ProtectedRoute>
    } 
  />,
  <Route 
    path="/students/:id/enroll" 
    element={
      <ProtectedRoute permissions={[PERMISSIONS.MANAGE_ENROLLMENT]}>
        <StudentEnrollment />
      </ProtectedRoute>
    } 
  />,
  <Route 
    path="/students/:id/attendance" 
    element={
      <ProtectedRoute permissions={[PERMISSIONS.MANAGE_ATTENDANCE]}>
        <AttendanceTracking />
      </ProtectedRoute>
    } 
  />,
]; 