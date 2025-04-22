import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiLogOut,
  FiLock,
  FiMenu,
  FiUpload,
  FiFilter,
  FiHome,
} from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const UserNavbar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Navbar */}
      <header className="w-full h-16 bg-white/90 backdrop-blur-sm border-b shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        {/* Left - Hamburger (mobile only) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl text-gray-700 sm:hidden"
          >
            <FiMenu />
          </button>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-blue-600">
            Study Portal
          </h1>
        </div>

        {/* Right - User avatar */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer flex items-center gap-2"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-9 h-9 rounded-full border object-cover shadow hover:scale-105 transition"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border shadow hover:scale-105 transition">
                {getInitials(user?.fullName)}
              </div>
            )}
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-4 top-16 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 py-2 animate-fade-in-up">
              <div className="px-4 py-3 border-b text-sm text-gray-700">
                <p className="font-semibold">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-blue-600 capitalize">
                  {user?.role}
                </p>
              </div>

              <button
                onClick={() => {
                  navigate('/user/profile');
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiUser /> Profile
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiLock /> Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-4 sm:hidden">
          <h2 className="text-lg font-bold text-blue-600 mb-4">Menu</h2>

          <Link
            to="/user/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded"
          >
            <FiHome /> Dashboard
          </Link>

          <Link
            to="/user/upload"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded"
          >
            <FiUpload /> Upload
          </Link>

          <Link
            to="/user/find"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded"
          >
            <FiFilter /> Find Material
          </Link>

          <Link
            to="/user/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 rounded"
          >
            <FiUser /> Profile
          </Link>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default UserNavbar;
