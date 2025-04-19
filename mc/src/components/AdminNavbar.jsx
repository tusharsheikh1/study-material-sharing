import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { FiSun, FiMoon } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const AdminNavbar = ({ toggleDarkMode, isDark }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'AD';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 text-blue-600 dark:text-white py-3 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        {/* Home Icon Route */}
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition"
          title="Go to Home"
        >
          <AiFillHome className="w-6 h-6" />
        </Link>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {isDark ? <FiSun className="text-xl text-yellow-400" /> : <FiMoon className="text-xl text-gray-800" />}
          </button>

          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-full shadow hover:scale-105 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
                {getInitials(user?.fullName)}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{user?.fullName || 'Admin'}</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b font-medium border-gray-200 dark:border-gray-700">
                  {user?.fullName || 'Admin'}
                </div>
                <ul className="py-1">
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                      Profile
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                      Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;