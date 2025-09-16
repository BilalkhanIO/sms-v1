// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Users, BookOpen, Calendar } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            School Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your school operations with our comprehensive management platform. 
            Manage students, teachers, classes, attendance, and more all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg border-2 border-blue-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Student Management</h3>
            <p className="text-gray-600">
              Complete student profiles, enrollment, and academic tracking.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Teacher Portal</h3>
            <p className="text-gray-600">
              Manage classes, assignments, and student progress efficiently.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
            <p className="text-gray-600">
              Real-time attendance monitoring and reporting system.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <GraduationCap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Academic Records</h3>
            <p className="text-gray-600">
              Comprehensive exam management and grade tracking.
            </p>
          </div>
        </div>

        {/* Role-based Access */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Role-Based Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">A</span>
              </div>
              <h3 className="font-semibold mb-2">Administrators</h3>
              <p className="text-sm text-gray-600">
                Full system access and user management capabilities.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">T</span>
              </div>
              <h3 className="font-semibold mb-2">Teachers</h3>
              <p className="text-sm text-gray-600">
                Class management, attendance, and student progress tracking.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">S</span>
              </div>
              <h3 className="font-semibold mb-2">Students</h3>
              <p className="text-sm text-gray-600">
                View grades, attendance, and academic information.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold text-xl">P</span>
              </div>
              <h3 className="font-semibold mb-2">Parents</h3>
              <p className="text-sm text-gray-600">
                Monitor child's progress and school activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
