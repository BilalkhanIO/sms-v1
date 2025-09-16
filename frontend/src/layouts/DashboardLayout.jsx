import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLogoutMutation } from "../api/authApi";
import {
  Menu,
  X,
  User,
  Users,
  UserPlus,
  Home,
  School,
  GraduationCap,
  LogOut,
  BookOpen,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
} from "lucide-react"; // Added icons

const UserWelcome = ({ user }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm text-gray-600">
      Welcome, {user.firstName} {user.lastName}
    </span>
    <span className="text-xs text-gray-400">({user.role})</span>
  </div>
);

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [logout, { isLoading }] = useLogoutMutation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname.startsWith(`/dashboard${path}`);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navLinks = [
    { to: "/dashboard/profile", label: "Profile", icon: User },
    ...(user?.role === "SUPER_ADMIN" || user?.role === "SCHOOL_ADMIN"
      ? [
          { to: "/dashboard/users", label: "Users", icon: Users },
          { to: "/dashboard/users/create", label: "Create User", icon: UserPlus },
          { to: "/dashboard/admin-dashboard", label: "Admin Dashboard", icon: Home },
        ]
      : []),
    ...(user?.role === "TEACHER"
      ? [{ to: "/dashboard/teacher-dashboard", label: "Teacher Dashboard", icon: Home }]
      : []),
    ...(user?.role === "STUDENT"
      ? [{ to: "/dashboard/student-dashboard", label: "Student Dashboard", icon: Home }]
      : []),
    { to: "/dashboard/teachers", label: "Teachers", icon: Users },
    { to: "/dashboard/students", label: "Students", icon: GraduationCap },
    { to: "/dashboard/classes", label: "Classes", icon: School },
    { to: "/dashboard/subjects", label: "Subjects", icon: BookOpen },
    { to: "/dashboard/attendance", label: "Attendance", icon: CheckCircle },
    { to: "/dashboard/exams", label: "Exams", icon: FileText },
    { to: "/dashboard/fees", label: "Fees", icon: DollarSign },
    { to: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar - Top */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 focus:outline-none hover:bg-gray-700 rounded"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/dashboard" className="text-xl font-bold">
            School Management
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && <UserWelcome user={user} />}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-sm font-medium flex items-center space-x-2 ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <LogOut size={16} />
            <span>{isLoading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Left */}
        <aside
          className={`bg-gray-800 text-white w-64 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static fixed inset-y-0 left-0 z-50 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Navigation</h3>
          </div>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block p-3 rounded text-sm font-medium transition-colors flex items-center space-x-3 ${
                  isActive(link.to.replace("/dashboard", ""))
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}