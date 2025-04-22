import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUpload, FiFilter, FiUser, FiLogOut, FiLock } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const UserNavbar = () => {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 text-sm font-medium ${
      isActive ? 'text-blue-600' : 'text-gray-700'
    } hover:bg-gray-100`;

  return (
    <>
      <header className="w-full h-16 bg-white/90 backdrop-blur-sm border-b shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        {/* Left: Hamburger Button (Mobile only) */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-blue-600">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Center: Title */}
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-blue-600 hidden sm:block">
          Study Portal
        </h1>

        {/* Right: Profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
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

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 py-2 animate-fade-in-up">
              <div className="px-4 py-3 border-b text-sm text-gray-700">
                <p className="font-semibold">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/user/profile');
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiUser /> Profile
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setProfileOpen(false);
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

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white z-40 shadow-lg transform ${
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
