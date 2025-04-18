import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiLock, FiHome } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal'; // Make sure this component exists

const UserNavbar = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
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
    <header className="w-full h-16 bg-white/90 backdrop-blur-sm border-b shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/">
          <FiHome className="text-blue-600 text-xl hover:scale-110 transition" />
        </Link>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-blue-600">
          Study Portal
        </h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <span className="hidden sm:inline text-sm text-gray-700">
            Welcome,&nbsp;
            <span className="font-semibold text-gray-900">
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
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border shadow hover:scale-105 transition">
              {getInitials(user?.fullName)}
            </div>
          )}
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 py-2 animate-fade-in-up">
            <div className="px-4 py-3 border-b text-sm text-gray-700">
              <p className="font-semibold">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
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

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </header>
  );
};

export default UserNavbar;
