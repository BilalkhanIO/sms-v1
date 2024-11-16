import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const user = useSelector(state => state.auth.user);

  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
      { name: 'Calendar', to: '/calendar', icon: CalendarIcon },
      { name: 'Notifications', to: '/notifications', icon: BellIcon },
    ];

    const adminItems = [
      { name: 'User Management', to: '/admin/users', icon: UserGroupIcon },
      { name: 'Students', to: '/admin/students', icon: AcademicCapIcon },
      { name: 'Teachers', to: '/admin/teachers', icon: UserGroupIcon },
      { name: 'Classes', to: '/admin/classes', icon: BookOpenIcon },
      { name: 'Fee Management', to: '/admin/fees', icon: CurrencyDollarIcon },
      { name: 'Attendance', to: '/admin/attendance', icon: ClipboardDocumentListIcon },
      { name: 'Reports', to: '/admin/reports', icon: ChartBarIcon },
      { name: 'Settings', to: '/admin/settings', icon: Cog6ToothIcon },
    ];

    const teacherItems = [
      { name: 'My Students', to: '/teacher/students', icon: UserGroupIcon },
      { name: 'Attendance', to: '/teacher/attendance', icon: ClipboardDocumentListIcon },
      { name: 'Grades', to: '/teacher/grades', icon: ChartBarIcon },
      { name: 'Classes', to: '/teacher/classes', icon: BookOpenIcon },
    ];

    const studentItems = [
      { name: 'My Grades', to: '/student/grades', icon: ChartBarIcon },
      { name: 'Attendance', to: '/student/attendance', icon: ClipboardDocumentListIcon },
      { name: 'Courses', to: '/student/courses', icon: BookOpenIcon },
      { name: 'Fee Status', to: '/student/fees', icon: CurrencyDollarIcon },
    ];

    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'SCHOOL_ADMIN':
        return [...commonItems, ...adminItems];
      case 'TEACHER':
        return [...commonItems, ...teacherItems];
      case 'STUDENT':
        return [...commonItems, ...studentItems];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="h-screen bg-gray-800 w-64 fixed">
      <div className="flex h-16 items-center justify-center">
        <BuildingLibraryIcon className="h-8 w-8 text-white" />
        <span className="ml-2 text-xl font-bold text-white">School MS</span>
      </div>
      
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <NavLink
          to="/profile"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8 rounded-full"
              src={user?.profilePicture || '/default-avatar.png'}
              alt={user?.name}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar; 