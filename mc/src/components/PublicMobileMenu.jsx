import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiInfo,
  FiLogIn,
  FiUserPlus,
  FiBookOpen, // ✅ added for Resources icon
} from "react-icons/fi";

const PublicMobileMenu = ({
  menuOpen,
  setMenuOpen,
  isLoggedIn,
  userApproved,
  goToDashboard,
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 rounded-b-2xl shadow-2xl px-6 pt-4 pb-6 space-y-4 text-[17px] font-medium text-gray-900 dark:text-white"
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            <FiHome /> Home
          </Link>
          <Link
            to="/faculty"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            <FiUsers /> Faculty
          </Link>
          <Link
            to="/staff"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            <FiUserCheck /> Staff
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            <FiInfo /> About Us
          </Link>
          <Link
            to="/resources"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            <FiBookOpen /> Resources
          </Link>

          <hr className="border-white/20 dark:border-gray-600" />

          {isLoggedIn && userApproved ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                goToDashboard();
              }}
              className="w-full bg-green-600/90 text-white py-2 rounded-full shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
            >
              Go to Dashboard
            </button>
          ) : isLoggedIn && !userApproved ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/waiting-approval");
              }}
              className="w-full bg-yellow-500/90 text-white py-2 rounded-full shadow-lg backdrop-blur-md cursor-not-allowed"
            >
              Waiting for Approval
            </button>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                <FiLogIn /> Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 justify-center w-full bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white py-2 rounded-full shadow-lg hover:scale-105 transition-transform backdrop-blur"
              >
                <FiUserPlus /> Get Started
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PublicMobileMenu;
