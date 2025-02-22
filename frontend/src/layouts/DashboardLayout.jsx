// src/layouts/DashboardLayout.jsx
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLogoutMutation } from "../api/authApi";

export default function DashboardLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [logout] = useLogoutMutation();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate("/login");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (path) => location.pathname.startsWith(`/dashboard${path}`);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <div className="mb-8">
                    <h2 className="text-xl font-bold">School Management</h2>
                    {user && (
                        <div>
                            <p className="text-sm text-gray-400">{user.role}</p>
                            <p className="text-sm text-gray-600">
                                Welcome, {user.firstName} {user.lastName}
                            </p>
                        </div>
                    )}
                </div>

                <nav className="space-y-2">
                    <Link
                        to="/dashboard/profile"
                        className={`block p-2 hover:bg-gray-700 rounded ${isActive("/profile") ? "bg-gray-700" : ""}`}
                    >
                        Profile
                    </Link>

                    {(user?.role === "SUPER_ADMIN" || user?.role === "SCHOOL_ADMIN") && (
                        <>
                            <Link
                                to="/dashboard/users"
                                className={`block p-2 hover:bg-gray-700 rounded ${isActive("/users") ? "bg-gray-700" : ""}`}
                            >
                                Users
                            </Link>
                            <Link
                                to="/dashboard/users/create"
                                className={`block p-2 hover:bg-gray-700 rounded ${isActive("/users/create") ? "bg-gray-700" : ""}`}
                            >
                                Create User
                            </Link>
                        </>
                    )}

                    {(user?.role === "SUPER_ADMIN" || user?.role === "SCHOOL_ADMIN") && (
                        <Link
                            to="/dashboard/admin-dashboard"
                            className={`block p-2 hover:bg-gray-700 rounded ${isActive("/admin-dashboard") ? "bg-gray-700" : ""}`}
                        >
                            Admin Dashboard
                        </Link>
                    )}

                    {user?.role === "TEACHER" && (
                        <Link
                            to="/dashboard/teacher-dashboard"
                            className={`block p-2 hover:bg-gray-700 rounded ${isActive("/teacher-dashboard") ? "bg-gray-700" : ""}`}
                        >
                            Teacher Dashboard
                        </Link>
                    )}

                    {user?.role === "STUDENT" && (
                        <Link
                            to="/dashboard/student-dashboard"
                            className={`block p-2 hover:bg-gray-700 rounded ${isActive("/student-dashboard") ? "bg-gray-700" : ""}`}
                        >
                            Student Dashboard
                        </Link>
                    )}

                    <Link
                        to="/dashboard/teachers"
                        className={`block p-2 hover:bg-gray-700 rounded ${isActive("/teachers") ? "bg-gray-700" : ""}`}
                    >
                        Teachers
                    </Link>

                    <Link
                        to="/dashboard/students"
                        className={`block p-2 hover:bg-gray-700 rounded ${isActive("/students") ? "bg-gray-700" : ""}`}
                    >
                        Students
                    </Link>

                    <Link
                        to="/dashboard/classes"
                        className={`block p-2 hover:bg-gray-700 rounded ${isActive("/classes") ? "bg-gray-700" : ""}`}
                    >
                        Classes
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-4 p-2 text-left hover:bg-gray-700 rounded"
                    >
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    {user && (
                        <div>
                            <p className="text-sm text-gray-400">{user.role}</p>
                            <p className="text-sm text-gray-600">
                                Welcome, {user.firstName} {user.lastName}
                            </p>
                        </div>
                    )}
                </div>
                <Outlet />
            </main>
        </div>
    );
}