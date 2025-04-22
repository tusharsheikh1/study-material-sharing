import { NavLink } from 'react-router-dom';
import { FiHome, FiUpload, FiUser, FiFilter } from 'react-icons/fi';

const MobileBottomNav = () => {
  const navItems = [
    { to: '/user/dashboard', icon: <FiHome size={22} />, label: 'Dashboard' },
    { to: '/user/upload', icon: <FiUpload size={22} />, label: 'Upload' },
    { to: '/user/find', icon: <FiFilter size={22} />, label: 'Find' },
    { to: '/user/profile', icon: <FiUser size={22} />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-full flex justify-around items-center h-16 sm:hidden px-4 transition-all">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            `group relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-full transition-all duration-300 ease-in-out ${
              isActive
                ? 'text-blue-600 dark:text-yellow-400 bg-blue-50 dark:bg-blue-950'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`
          }
        >
          {icon}
          <span className="absolute bottom-[-20px] text-[10px] font-medium opacity-0 group-hover:opacity-100 transition text-gray-600 dark:text-gray-300">
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
