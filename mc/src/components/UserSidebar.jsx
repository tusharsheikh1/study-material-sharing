import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUpload, FiLogOut, FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import { motion } from 'framer-motion';

const UserSidebar = () => {
  const [logoUrl, setLogoUrl] = useState('');

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/user/dashboard' },
    { name: 'Upload', icon: <FiUpload />, path: '/user/upload' },
    { name: 'Find Materials', icon: <FiFilter />, path: '/user/find' },
  ];

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
      className="hidden sm:flex w-16 sm:w-52 bg-white border-r h-screen sticky top-0 z-40 flex-col justify-between"
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
          <div className="w-[180px] h-[50px] bg-gray-200 rounded mb-6" />
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
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
          className="flex items-center gap-3 w-full text-sm text-red-500 hover:bg-red-50 p-2 rounded transition"
        >
          <FiLogOut />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default UserSidebar;
