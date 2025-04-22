import { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUpload, FiLogOut, FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const UserSidebar = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/user/dashboard', roles: ['student', 'cr'] },
    { name: 'Upload', icon: <FiUpload />, path: '/user/upload', roles: ['student', 'cr', 'faculty'] },
    { name: 'Find Materials', icon: <FiFilter />, path: '/user/find', roles: ['student', 'cr'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get('/logos/logo');
        setLogoUrl(response.data.value);
      } catch (err) {
        console.error('Failed to fetch logo:', err);
      }
    };
    fetchLogo();
  }, []);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden sm:flex w-16 sm:w-52 bg-white dark:bg-gray-900 border-r dark:border-gray-700 h-screen sticky top-0 z-40 flex-col justify-between"
    >
      {/* Logo */}
      <div className="px-4 pt-4">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="mb-6 object-contain"
            style={{ width: '180px', height: '50px' }}
          />
        ) : (
          <div className="w-[180px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 px-4">
        {filteredItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-yellow-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            {item.icon}
            <span className="hidden sm:inline">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 w-full text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded transition"
        >
          <FiLogOut />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default UserSidebar;
