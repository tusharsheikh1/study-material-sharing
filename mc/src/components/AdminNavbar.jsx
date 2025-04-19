import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai'; // <== Home icon from react-icons
import AuthContext from '../context/AuthContext';

const AdminNavbar = () => {
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

  // Close dropdown when clicking outside
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
    <nav className="bg-white text-blue-600 py-3 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        {/* Home Icon Route */}
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-blue-100 transition"
          title="Go to Home"
        >
          <AiFillHome className="w-6 h-6 text-blue-600" />
        </Link>

        {/* Right section */}
        <div className="relative flex items-center" ref={dropdownRef}>
          {/* Avatar Button */}
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

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b font-medium">
                {user?.fullName || 'Admin'}
              </div>
              <ul className="py-1">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Profile
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
