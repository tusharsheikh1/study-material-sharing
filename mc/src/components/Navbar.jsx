import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Home, 
  Users, 
  BookOpen, 
  Calendar,
  Settings,
  User,
  LogOut,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Heart,
  Share2,
  Bookmark,
  TrendingUp
} from "lucide-react";
import PublicMobileMenu from "./PublicMobileMenu";
import api from "../utils/api";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userApproved, setUserApproved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Mock notifications data
  const [notifications] = useState([
    {
      id: 1,
      type: "like",
      user: "Sarah Ahmed",
      message: "liked your post about Consumer Behavior",
      time: "2m ago",
      unread: true,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40"
    },
    {
      id: 2,
      type: "comment",
      user: "Rafiq Hassan",
      message: "commented on your study group post",
      time: "15m ago",
      unread: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40"
    },
    {
      id: 3,
      type: "event",
      user: "Dept. of Marketing",
      message: "New event: Digital Marketing Workshop",
      time: "1h ago",
      unread: false,
      avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=40"
    },
    {
      id: 4,
      type: "follow",
      user: "Fatima Khan",
      message: "started following you",
      time: "2h ago",
      unread: false,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40"
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Search suggestions
  const [searchSuggestions] = useState([
    { type: "user", name: "Sarah Ahmed", role: "4th Year Student", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40" },
    { type: "hashtag", name: "#MarketingTrends2025", posts: 45 },
    { type: "user", name: "Rafiq Hassan", role: "3rd Year Student", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40" },
    { type: "hashtag", name: "#StudyGroups", posts: 24 },
    { type: "event", name: "Digital Marketing Workshop", date: "March 15" }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
      const parsedUser = JSON.parse(userData);
      setUserApproved(parsedUser?.approved);
      setCurrentUser(parsedUser);
    }
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setNotificationsOpen(false);
        setUserMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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

  const goToDashboard = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/login");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow': return <Users className="w-4 h-4 text-green-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <nav className={`backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo + Search */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                {loadingLogo ? (
                  <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" />
                ) : logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Track Mark</span>
                )}
              </Link>

              {/* Search Bar - Desktop */}
              <div className="hidden md:block relative dropdown-container">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students, posts, events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    className="w-80 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Search Dropdown */}
                {searchOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <div key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3">
                        {suggestion.type === 'user' && (
                          <>
                            <img src={suggestion.avatar} alt="" className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{suggestion.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.role}</p>
                            </div>
                          </>
                        )}
                        {suggestion.type === 'hashtag' && (
                          <>
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-blue-600 dark:text-blue-400">{suggestion.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.posts} posts</p>
                            </div>
                          </>
                        )}
                        {suggestion.type === 'event' && (
                          <>
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{suggestion.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.date}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center: Navigation Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <Home className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </Link>
              <Link to="/faculty" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <Users className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </Link>
              <Link to="/resources" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </Link>
              <Link to="/about" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </Link>
            </div>

            {/* Right: User Actions */}
            <div className="flex items-center space-x-2">
              {isLoggedIn && userApproved ? (
                <>
                  {/* Create Post Button */}
                  <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Create
                  </button>

                  {/* Messages */}
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                    <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                  </button>

                  {/* Notifications */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    >
                      <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {notificationsOpen && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        </div>
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${notification.unread ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent'}`}>
                            <div className="flex items-start gap-3">
                              <img src={notification.avatar} alt="" className="w-8 h-8 rounded-full" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {getNotificationIcon(notification.type)}
                                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                                    {notification.user}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isDark ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-600" />}
                  </button>

                  {/* User Menu */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <img
                        src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {currentUser?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentUser?.email || "user@example.com"}
                          </p>
                        </div>
                        
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">My Profile</span>
                        </Link>
                        
                        <button onClick={goToDashboard} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left">
                          <Home className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">Dashboard</span>
                        </button>
                        
                        <Link to="/user/uploads" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">My Uploads</span>
                        </Link>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left text-red-600 dark:text-red-400"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : isLoggedIn && !userApproved ? (
                <button
                  onClick={() => navigate("/waiting-approval")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium cursor-not-allowed"
                >
                  Pending Approval
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isDark ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-600" />}
                  </button>
                  <Link to="/auth/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium hidden md:block">
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Join Now
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <PublicMobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          isLoggedIn={isLoggedIn}
          userApproved={userApproved}
          goToDashboard={goToDashboard}
        />
      </nav>
    </>
  );
};

export default Navbar;