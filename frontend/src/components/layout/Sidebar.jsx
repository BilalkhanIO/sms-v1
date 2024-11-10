import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Students', path: '/students', icon: '👥' },
    { name: 'Teachers', path: '/teachers', icon: '👨‍🏫' },
    { name: 'Classes', path: '/classes', icon: '🏫' },
    { name: 'Attendance', path: '/attendance', icon: '📋' },
    { name: 'Exams', path: '/exams', icon: '📝' },
    { name: 'Fees', path: '/fees', icon: '💰' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4">
        <div className="py-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 py-2 px-4 rounded-md ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 