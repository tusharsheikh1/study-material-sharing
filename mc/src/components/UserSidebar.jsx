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
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="hidden sm:flex w-16 sm:w-52 bg-white border-r shadow-sm h-screen sticky top-0 z-40 flex-col justify-between"
    >
      <div className="flex flex-col items-center sm:items-start px-2 sm:px-4 pt-4">
        {logoUrl ? (
          <motion.img
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            src={logoUrl}
            alt="Logo"
            className="mb-6 object-contain"
            style={{ width: '200px', height: '60px' }}
          />
        ) : (
          <div className="w-[200px] h-[60px] bg-gray-200 rounded mb-6" />
        )}
      </div>

      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {navItems.map((item) => (
          <motion.div
            key={item.name}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`
              }
            >
              {item.icon}
              <span className="hidden sm:inline">{item.name}</span>
            </NavLink>
          </motion.div>
        ))}
      </motion.div>

      <div className="p-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 w-full text-sm text-red-500 hover:bg-red-50 p-2 rounded transition"
        >
          <FiLogOut />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default UserSidebar;
