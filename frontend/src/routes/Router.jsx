// src/routes/Router.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  PublicRoute,
  PrivateRoute
} from "../components/routing/ProtectedRoutes";

// Page imports
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import UserDetail from "../components/UserDetail";
import UpdateUserForm from "../components/UpdateUserForm";
import CreateUserForm from "../components/CreateUserForm";
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

      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout><Dashboard /></DashboardLayout></PrivateRoute>}>
        <Route path="admin-dashboard" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><AdminDashboard /></PrivateRoute>} />
        <Route path="teacher-dashboard" element={<PrivateRoute roles={['TEACHER']}><TeacherDashboard /></PrivateRoute>} />
        <Route path="student-dashboard" element={<PrivateRoute roles={['STUDENT']}><StudentDashboard /></PrivateRoute>} />
        <Route path="parent-dashboard" element={<PrivateRoute roles={['PARENT']}><ParentDashboard /></PrivateRoute>} />
        
        {/* Users routes */}
        <Route path="users" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><Users /></PrivateRoute>} />
        <Route path="users/:id" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><UserDetail /></PrivateRoute>} />
        <Route path="users/create" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><CreateUserForm /></PrivateRoute>} />
        <Route path="users/update/:id" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><UpdateUserForm /></PrivateRoute>} />
        
        {/* Teachers routes */}
        <Route path="teachers" element={<PrivateRoute><TeacherList /></PrivateRoute>} />
        <Route path="teachers/:id" element={<PrivateRoute><TeacherDetails /></PrivateRoute>} />
        <Route path="teachers/create" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><CreateTeacher /></PrivateRoute>} />
        <Route path="teachers/update/:id" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><UpdateTeacher /></PrivateRoute>} />
        
        {/* Students routes */}
        <Route path="students" element={<PrivateRoute><StudentList /></PrivateRoute>} />
        <Route path="students/:id" element={<PrivateRoute><StudentDetails /></PrivateRoute>} />
        <Route path="students/create" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']}><CreateStudent /></PrivateRoute>} />
        <Route path="students/update/:id" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']}><UpdateStudent /></PrivateRoute>} />
        
        {/* Classes routes */}
        <Route path="classes" element={<PrivateRoute><ClassList /></PrivateRoute>} />
        <Route path="classes/:id" element={<PrivateRoute><ClassDetails /></PrivateRoute>} />
        <Route path="classes/create" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><CreateClass /></PrivateRoute>} />
        <Route path="classes/update/:id" element={<PrivateRoute roles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}><UpdateClass /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
