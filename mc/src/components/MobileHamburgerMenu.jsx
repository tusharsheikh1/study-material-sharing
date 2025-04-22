import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUpload, FiFilter, FiUser } from 'react-icons/fi';

const MobileHamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-4 text-sm font-medium ${
      isActive ? 'text-blue-600' : 'text-gray-700'
    } hover:bg-gray-100`;

  return (
    <div className="sm:hidden">
      {/* Top bar with hamburger */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <button onClick={toggleMenu} className="text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
        <div className="text-lg font-semibold">Menu</div>
        <div></div> {/* Placeholder for spacing */}
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white z-40 shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <nav className="flex flex-col mt-16">
          <NavLink to="/user/dashboard" onClick={closeMenu} className={navLinkClass}>
            <FiHome /> Dashboard
          </NavLink>
          <NavLink to="/user/upload" onClick={closeMenu} className={navLinkClass}>
            <FiUpload /> Upload
          </NavLink>
          <NavLink to="/user/find" onClick={closeMenu} className={navLinkClass}>
            <FiFilter /> Find
          </NavLink>
          <NavLink to="/user/profile" onClick={closeMenu} className={navLinkClass}>
            <FiUser /> Profile
          </NavLink>
        </nav>
      </div>

      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={closeMenu}
        ></div>
      )}
    </div>
  );
};

export default MobileHamburgerMenu;
