import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUpload, FiFilter, FiUser, FiLogOut, FiLock, FiMoon, FiSun } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const UserNavbar = () => {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 text-sm font-medium ${
      isActive ? 'text-blue-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-200'
    } hover:bg-gray-100 dark:hover:bg-gray-700`;

  return (
    <>
      <header className="w-full h-16 bg-white/90 dark:bg-gray-900 dark:text-white backdrop-blur-sm border-b shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        {/* Left: Hamburger Button (Mobile only) */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-blue-600 dark:text-yellow-400">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Right: Theme + Profile */}
        <div className="flex items-center gap-4 ml-auto" ref={dropdownRef}>
          <button onClick={toggleDarkMode} className="text-xl hover:scale-110 transition">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          <div onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 cursor-pointer">
            <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-200">
              Welcome,&nbsp;
              <span className="font-semibold text-gray-900 dark:text-white">
                {user?.fullName || 'User'}
              </span>
            </span>
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-9 h-9 rounded-full border object-cover shadow hover:scale-105 transition"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 dark:bg-yellow-100 dark:text-yellow-800 flex items-center justify-center font-bold border shadow hover:scale-105 transition">
                {getInitials(user?.fullName)}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-4 top-16 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50 py-2 animate-fade-in-up">
              <div className="px-4 py-3 border-b text-sm text-gray-700 dark:text-gray-200">
                <p className="font-semibold">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/user/profile');
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiUser /> Profile
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiLock /> Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 z-40 shadow-lg transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out sm:hidden`}
      >
        <nav className="flex flex-col mt-16">
          <NavLink to="/user/dashboard" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            <FiHome /> Dashboard
          </NavLink>
          <NavLink to="/user/upload" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            <FiUpload /> Upload
          </NavLink>
          <NavLink to="/user/find" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            <FiFilter /> Find
          </NavLink>
          <NavLink to="/user/profile" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            <FiUser /> Profile
          </NavLink>
        </nav>
      </div>

      {/* Overlay for drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default UserNavbar;
