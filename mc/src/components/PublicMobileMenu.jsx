import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PublicMobileMenu = ({ menuOpen, setMenuOpen, isLoggedIn, userApproved, goToDashboard }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/80 dark:bg-gray-900/90 backdrop-blur-md px-6 pb-6 space-y-3 text-base font-medium"
        >
          <Link to="/" className="block hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
          <Link to="/faculty" className="block hover:text-blue-600 dark:hover:text-blue-400">Faculty</Link>
          <Link to="/staff" className="block hover:text-blue-600 dark:hover:text-blue-400">Staff</Link>
          <Link to="/about" className="block hover:text-blue-600 dark:hover:text-blue-400">About Us</Link>

          <hr className="my-2 border-gray-300 dark:border-gray-700" />

          {isLoggedIn && userApproved ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                goToDashboard();
              }}
              className="block w-full bg-green-600 text-white text-center py-2 rounded-full shadow hover:scale-105 transition-all"
            >
              Go to Dashboard
            </button>
          ) : isLoggedIn && !userApproved ? (
            <button
              onClick={() => navigate("/waiting-approval")}
              className="block w-full bg-yellow-500 text-white text-center py-2 rounded-full shadow cursor-not-allowed"
            >
              Waiting for Approval
            </button>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Sign In</Link>
              <Link
                to="/register"
                className="block bg-blue-600 text-white text-center py-2 rounded-full shadow hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PublicMobileMenu;
