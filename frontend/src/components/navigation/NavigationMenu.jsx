import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../utils/permissions';
import { navigationConfig } from '../../config/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const NavigationMenu = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const { user } = useSelector((state) => state.auth);

  const toggleExpand = (path) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const hasAccess = (permissions) => {
    if (!permissions.length) return true;
    return permissions.some(permission => hasPermission(user?.role, permission));
  };

  const renderMenuItem = (item) => {
    if (!hasAccess(item.permissions)) return null;

    const isExpanded = expandedItems[item.path];
    const active = isActive(item.path);

    return (
      <div key={item.path} className="space-y-1">
        <div
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer
            ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          onClick={() => item.children && toggleExpand(item.path)}
        >
          <item.icon
            className={`mr-3 flex-shrink-0 h-6 w-6 
              ${active ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}`}
          />
          <span className="flex-1">{item.title}</span>
          {item.children && (
            <ChevronDownIcon
              className={`ml-3 h-5 w-5 transform transition-transform duration-200 
                ${isExpanded ? 'rotate-180' : ''}`}
            />
          )}
        </div>

        {item.children && isExpanded && (
          <div className="space-y-1 pl-10">
            {item.children.map((child) =>
              hasAccess(child.permissions) && (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive(child.path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {child.title}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-1">
      {navigationConfig.map(renderMenuItem)}
    </nav>
  );
};

export default NavigationMenu; 