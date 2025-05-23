import { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiUsers,
  FiSettings,
  FiUser,
  FiBook,
  FiClipboard,
} from 'react-icons/fi';
import { FaChalkboardTeacher, FaUserCog } from 'react-icons/fa'; // ✅ NEW ICON ADDED
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const response = await api.get('/logos/logo');
        setLogoUrl(response.data.value);
      } catch (error) {
        console.error('Error fetching logo URL:', error);
      }
    };
    fetchLogoUrl();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/admin/dashboard', roles: ['admin', 'faculty', 'cr'] },
    { name: 'User Approvals', icon: <FiClipboard />, path: '/admin/approvals', roles: ['admin'] },
    { name: 'Role Assignment', icon: <FiUser />, path: '/admin/roles', roles: ['admin'] },
    { name: 'Course Manager', icon: <FiBook />, path: '/admin/courses', roles: ['admin'] },
    { name: 'All Materials', icon: <FiClipboard />, path: '/admin/materials', roles: ['admin'] },
    { name: 'Our Faculty', icon: <FaChalkboardTeacher />, path: '/admin/faculty', roles: ['admin'] },
    { name: 'Office & Staff', icon: <FaUserCog />, path: '/admin/staff', roles: ['admin'] }, // ✅ NEWLY ADDED
    {
      name: 'Settings',
      icon: <FiSettings />,
      roles: ['admin'],
      submenus: [
        { name: 'Logo', path: '/admin/settings/logo' },
        { name: 'Favicon', path: '/admin/settings/favicon' },
      ],
    },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-screen transition-all duration-300 sticky top-0 flex flex-col shadow-lg`}
    >
      <div className="flex items-center justify-between px-6 py-6">
        {isOpen && (
          <img
            src={logoUrl || 'https://via.placeholder.com/150'}
            alt="Logo"
            className="h-12 w-auto object-contain"
          />
        )}
        <button onClick={toggleSidebar} className="text-gray-700 dark:text-gray-300 hover:text-gray-500 focus:outline-none">
          {isOpen ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
        </button>
      </div>

      <ul className="flex-1 space-y-1 mt-4">
        {menuItems.map((item) => {
          if (!item.roles.includes(user?.role)) return null;

          return item.submenus ? (
            <li key={item.name}>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="flex items-center gap-4 px-4 py-3 mx-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300 w-full text-left"
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span className="text-md font-medium">{item.name}</span>}
              </button>
              {settingsOpen && (
                <ul className="ml-8 space-y-1">
                  {item.submenus.map((submenu) => (
                    <li key={submenu.name}>
                      <NavLink
                        to={submenu.path}
                        className={({ isActive }) =>
                          `flex items-center gap-4 px-4 py-2 rounded-lg transition duration-200 ease-in-out ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 dark:from-blue-900 dark:to-blue-800 dark:text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300'
                          }`
                        }
                      >
                        {isOpen && <span className="text-md">{submenu.name}</span>}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 mx-2 rounded-lg transition duration-200 ease-in-out ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 dark:from-blue-900 dark:to-blue-800 dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300'
                  }`
                }
                title={!isOpen ? item.name : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span className="text-md font-medium">{item.name}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
        {isOpen ? 'Admin Panel © 2025' : '©'}
      </div>
    </aside>
  );
};

export default AdminSidebar;
