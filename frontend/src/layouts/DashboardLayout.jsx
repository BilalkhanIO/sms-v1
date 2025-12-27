import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useLogoutMutation } from "../api/authApi";
import {
  Menu,
  User,
  Users,
  Home,
  School,
  GraduationCap,
  LogOut,
  Settings,
  FileText
} from "lucide-react";

// shadcn/ui components
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// This component is no longer used but was kept as a remnant, removing it for clarity.
/*
const UserWelcome = ({ user }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm text-gray-600">
      Welcome, {user.firstName} {user.lastName}
    </span>
    <span className="text-xs text-gray-400">({user.role})</span>
  </div>
);
*/

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [logout, { isLoading }] = useLogoutMutation();

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

  const navLinks = [];

  // Common links for all authenticated users
  navLinks.push({ to: "/dashboard", label: "Dashboard", icon: Home });
  // Profile link moved to dropdown and not in sidebar anymore

  // Super Admin specific links
  if (user?.role === "SUPER_ADMIN") {
    navLinks.push({ to: "/dashboard/schools", label: "Schools", icon: School });
    navLinks.push({ to: "/dashboard/users", label: "Users", icon: Users });
    navLinks.push({ to: "/dashboard/teachers", label: "Teachers", icon: Users });
    navLinks.push({ to: "/dashboard/students", label: "Students", icon: GraduationCap });
    navLinks.push({ to: "/dashboard/classes", label: "Classes", icon: School });
    navLinks.push({ to: "/dashboard/settings", label: "Settings", icon: Settings });
    navLinks.push({ to: "/dashboard/activity-logs", label: "Activity Logs", icon: FileText });
  }

  // School Admin specific links
  if (user?.role === "SCHOOL_ADMIN") {
    navLinks.push({ to: "/dashboard/admin-dashboard", label: "Admin Dashboard", icon: Home });
    navLinks.push({ to: "/dashboard/users", label: "Users", icon: Users });
    navLinks.push({ to: "/dashboard/teachers", label: "Teachers", icon: Users });
    navLinks.push({ to: "/dashboard/students", label: "Students", icon: GraduationCap });
    navLinks.push({ to: "/dashboard/classes", label: "Classes", icon: School });
    navLinks.push({ to: "/dashboard/activity-logs", label: "Activity Logs", icon: FileText });
  }

  // Teacher specific links
  if (user?.role === "TEACHER") {
    navLinks.push({ to: "/dashboard/teacher-dashboard", label: "Teacher Dashboard", icon: Home });
    navLinks.push({ to: "/dashboard/students", label: "My Students", icon: GraduationCap });
    navLinks.push({ to: "/dashboard/classes", label: "My Classes", icon: School });
    // Add other teacher-specific links like attendance, exams, subjects
  }

  // Student specific links
  if (user?.role === "STUDENT") {
    navLinks.push({ to: "/dashboard/student-dashboard", label: "Student Dashboard", icon: Home });
    // Add other student-specific links like grades, schedule, fees
  }

  // Parent specific links
  if (user?.role === "PARENT") {
    navLinks.push({ to: "/dashboard/parent-dashboard", label: "Parent Dashboard", icon: Home });
    // Add other parent-specific links like wards' progress, communication
  }

  // Multi-School Admin specific links
  if (user?.role === "MULTI_SCHOOL_ADMIN") {
    navLinks.push({ to: "/dashboard/multi-school-dashboard", label: "Admin Dashboard", icon: Home });
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Navbar - Top */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {/* Mobile sidebar trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Home className="h-6 w-6" />
                <span className="sr-only">School Management</span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                    isActive(link.to) && "text-foreground bg-muted"
                  )}
                  // The Sheet component itself handles closing when a link inside it is clicked
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="lg" className="w-full justify-start">
                    <User className="h-5 w-5 mr-2" /> {user?.firstName} {user?.lastName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.firstName} {user?.lastName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
                    <LogOut className="h-4 w-4 mr-2" /> {isLoading ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetContent>
        </Sheet>
        {/* Desktop Header Content */}
        <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Home className="h-6 w-6" />
          <span className="sr-only">School Management</span>
        </Link>
        <div className="w-full flex-1" /> {/* Spacer */}
        {/* User Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.firstName} {user.lastName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
                <LogOut className="h-4 w-4 mr-2" /> {isLoading ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Left (Desktop) */}
        <aside className="hidden border-r bg-muted/40 md:block w-64">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
                <Home className="h-6 w-6" />
                <span className="">School Management</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive(link.to) && "text-primary bg-muted"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
