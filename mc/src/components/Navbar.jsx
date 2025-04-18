import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Set logo
  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const response = await api.get("/logos/logo");
        setLogoUrl(response.data.value);
      } catch (error) {
        console.error("Logo fetch error:", error);
      } finally {
        setLoadingLogo(false);
      }
    };
    fetchLogoUrl();
  }, []);

  // Scroll Effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrolled(scrollTop > 10);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* Scroll Progress */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 z-[9999] transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      <nav
        className={`backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-b border-white/20 
          dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-3">
              {loadingLogo ? (
                <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" />
              ) : logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
              ) : (
                <span className="text-2xl font-bold text-blue-700 dark:text-white">Track Mark</span>
              )}
            </Link>
            <div className="hidden md:flex items-center space-x-8 text-base font-medium text-gray-800 dark:text-gray-100">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <Link to="/faculty" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Faculty</Link>
              <Link to="/staff" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Staff</Link>
              <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
            </div>
          </div>

          {/* Right: Auth + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title="Toggle Theme"
            >
              {isDark ? <FiSun className="text-xl text-yellow-400" /> : <FiMoon className="text-xl text-gray-800" />}
            </button>
            <Link to="/login" className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transform transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme}>
              {isDark ? <FiSun className="text-xl text-yellow-400" /> : <FiMoon className="text-xl text-gray-800" />}
            </button>
            <button onClick={toggleMenu} className="text-2xl text-gray-800 dark:text-gray-100">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Slide Menu */}
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
              <Link to="/login" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Sign In</Link>
              <Link
                to="/register"
                className="block bg-blue-600 text-white text-center py-2 rounded-full shadow hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
