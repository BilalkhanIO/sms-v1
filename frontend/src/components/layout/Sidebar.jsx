import { NavLink } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { hasPermission } = usePermissions();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, permission: null },
    { name: 'Users', path: '/admin/users', icon: UsersIcon, permission: 'manage_users' },
    { name: 'Students', path: '/students', icon: UsersIcon, permission: 'view_students' },
    { name: 'Teachers', path: '/teachers', icon: AcademicCapIcon, permission: 'view_teachers' },
    { name: 'Classes', path: '/classes', icon: BookOpenIcon, permission: 'view_classes' },
    { name: 'Exams', path: '/exams', icon: ClipboardDocumentListIcon, permission: 'view_exams' },
    { name: 'Attendance', path: '/attendance', icon: CalendarIcon, permission: 'view_attendance' },
    { name: 'Reports', path: '/reports', icon: ChartBarIcon, permission: 'view_reports' },
    { name: 'Finance', path: '/finance', icon: CurrencyDollarIcon, permission: 'view_finance' },
    { name: 'Messages', path: '/messages', icon: ChatBubbleLeftRightIcon, permission: 'view_messages' }
  ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                (!item.permission || hasPermission(item.permission)) && (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-indigo-700' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </NavLink>
                )
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 