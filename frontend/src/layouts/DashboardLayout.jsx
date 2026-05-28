import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { useAuthStore } from '../store/zustand/useAuthStore';
import { useUIStore } from '../store/zustand/useUIStore';
import { useLogoutMutation } from '../api/authApi';
import { NAV_CONFIG, NAV_GROUPS } from '../lib/permissions';
import GlobalConfirmDialog from '../components/common/GlobalConfirmDialog';
import ToastContainer from '../components/common/ToastContainer';
import NotificationBell from '../components/common/NotificationBell';
import Spinner from '../components/common/Spinner';

const getIcon = (name, className = 'h-4 w-4') => {
  const Icon = Icons[name];
  return Icon ? <Icon className={className} /> : <Icons.Circle className={className} />;
};

function NavLink({ item, isActive, onClick }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {getIcon(item.icon)}
      <span>{item.label}</span>
    </Link>
  );
}

function Sidebar({ user, navItems, onClose }) {
  const location = useLocation();

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200">
        <Icons.GraduationCap className="h-7 w-7 text-blue-600" />
        <span className="font-bold text-gray-900 text-lg">SchoolMS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {Object.entries(NAV_GROUPS).map(([groupKey, groupLabel]) => {
          const groupItems = navItems.filter((item) => item.group === groupKey);
          if (!groupItems.length) return null;
          return (
            <div key={groupKey} className="mb-2">
              {groupLabel && (
                <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
                  {groupLabel}
                </p>
              )}
              {groupItems.map((item) => (
                <NavLink
                  key={item.to}
                  item={item}
                  isActive={isActive(item.to)}
                  onClick={onClose}
                />
              ))}
            </div>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {user && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const navItems = user
    ? NAV_CONFIG.filter((item) => item.roles.includes(user.role))
    : [];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col border-r border-gray-200 bg-white transition-all duration-200 shrink-0 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {sidebarOpen ? (
          <Sidebar user={user} navItems={navItems} />
        ) : (
          <CollapsedSidebar navItems={navItems} user={user} />
        )}
      </aside>

      {/* Sidebar — mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col lg:hidden transform transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar user={user} navItems={navItems} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 bg-white border-b border-gray-200 z-10">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileOpen(true)}
          >
            <Icons.Menu className="h-5 w-5" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            className="hidden lg:block text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Icons.PanelLeft className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <NotificationBell />

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <span className="hidden sm:block font-medium">{user.firstName}</span>
              <Icons.ChevronDown className="h-4 w-4 hidden sm:block" />
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Icons.User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Icons.LogOut className="h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Global overlays */}
      <GlobalConfirmDialog />
      <ToastContainer />
    </div>
  );
}

function CollapsedSidebar({ navItems, user }) {
  const location = useLocation();
  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <div className="flex flex-col items-center h-full py-4 gap-1">
      <div className="mb-3">
        <Icons.GraduationCap className="h-7 w-7 text-blue-600" />
      </div>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          title={item.label}
          className={`p-2 rounded-lg transition-colors ${
            isActive(item.to)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {getIcon(item.icon)}
        </Link>
      ))}
      {user && (
        <div className="mt-auto pb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
        </div>
      )}
    </div>
  );
}
