import { NavLink } from 'react-router-dom';
import { FiHome, FiUpload, FiUser, FiFilter } from 'react-icons/fi';

const MobileBottomNav = () => {
  return (
    // This nav is fixed to the bottom of the screen and always visible
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t shadow-md sm:hidden flex justify-around items-center h-16">
      <NavLink
        to="/user/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-xs ${
            isActive ? 'text-blue-600' : 'text-gray-600'
          }`
        }
      >
        <FiHome size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/user/upload"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-xs ${
            isActive ? 'text-blue-600' : 'text-gray-600'
          }`
        }
      >
        <FiUpload size={20} />
        <span>Upload</span>
      </NavLink>

      <NavLink
        to="/user/find"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-xs ${
            isActive ? 'text-blue-600' : 'text-gray-600'
          }`
        }
      >
        <FiFilter size={20} />
        <span>Find</span>
      </NavLink>

      <NavLink
        to="/user/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-xs ${
            isActive ? 'text-blue-600' : 'text-gray-600'
          }`
        }
      >
        <FiUser size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
