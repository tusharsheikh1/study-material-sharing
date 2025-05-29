import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PostModal from "../components/PostModal";
import PostCard from "../components/PostCard";
import {
  Plus,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Award,
  Megaphone,
  ChevronRight,
  Image,
  Video,
  Smile,
  Search,
  Filter,
  RefreshCw,
  Heart,
  MessageCircle,
  Share2,
  Bookmark
} from "lucide-react";

const Home = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Static data
  const upcomingEvents = [
    {
      id: 1,
      title: "Marketing Club Meeting",
      date: "Today, 4:00 PM",
      location: "Conference Room A",
      attendees: 28,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Career Fair 2025",
      date: "Next Week",
      location: "Main Auditorium",
      attendees: 150,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Workshop: Social Media Marketing",
      date: "March 15",
      location: "Online",
      attendees: 89,
      color: "bg-purple-500"
    },
  ];

  const trendingTopics = [
    { tag: "#MarketingTrends2025", posts: 45, growth: "+12%" },
    { tag: "#StudentLife", posts: 32, growth: "+5%" },
    { tag: "#CareerTips", posts: 28, growth: "+8%" },
    { tag: "#StudyGroups", posts: 24, growth: "+3%" },
    { tag: "#JUMarketing", posts: 67, growth: "+15%" },
  ];

  const quickStats = [
    {
      label: "Active Students",
      value: "342",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      label: "This Week's Posts",
      value: "89",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      label: "Study Materials",
      value: "156",
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      label: "Upcoming Events",
      value: "8",
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    },
  ];

  const departmentNotices = [
    {
      id: 1,
      department: "Marketing",
      notice: "Guest lecture on 'Digital Marketing Trends' tomorrow at 2 PM, Room 301.",
      date: "Apr 30",
      priority: "high",
      type: "lecture"
    },
    {
      id: 2,
      department: "Finance",
      notice: "Deadline extended for internship applications till May 5.",
      date: "Apr 29",
      priority: "medium",
      type: "deadline"
    },
    {
      id: 3,
      department: "HR",
      notice: "Workshop on Resume Building next Wednesday, Auditorium.",
      date: "May 1",
      priority: "medium",
      type: "workshop"
    },
    {
      id: 4,
      department: "IT",
      notice: "System maintenance scheduled for May 3, expect downtime from 1-3 AM.",
      date: "Apr 28",
      priority: "low",
      type: "maintenance"
    },
  ];

  const postFilters = [
    { id: 'all', label: 'All Posts', count: posts.length },
    { id: 'following', label: 'Following', count: 0 },
    { id: 'trending', label: 'Trending', count: trendingPosts.length },
    { id: 'recent', label: 'Recent', count: 0 }
  ];

  useEffect(() => {
    fetchPosts();
    fetchTrendingPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/posts/trending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTrendingPosts(response.data.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch trending posts:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    await fetchTrendingPosts();
    setRefreshing(false);
  };

  const handleCreatePost = async (postData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // First upload media files if any
      const uploadedMedia = [];
      if (postData.media && postData.media.length > 0) {
        for (const mediaItem of postData.media) {
          const formData = new FormData();
          formData.append('file', mediaItem.file);
          
          const uploadResponse = await axios.post('/api/media/upload', formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          });
          
          uploadedMedia.push(uploadResponse.data.url);
        }
      }

      // Create post with uploaded media URLs
      const response = await axios.post(
        "/api/posts",
        {
          content: postData.content,
          media: uploadedMedia,
          privacy: postData.privacy,
          location: postData.location,
          tags: postData.tags,
          feeling: postData.feeling
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new post to the beginning of posts array
      setPosts([response.data, ...posts]);
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put(
        `/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update post in state
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: response.data.liked 
                ? [...post.likes, currentUser.id] 
                : post.likes.filter(id => id !== currentUser.id)
            }
          : post
      ));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        `/api/posts/${postId}/comment`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update post comments in state
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, comments: [...post.comments, response.data] }
          : post
      ));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleShare = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `/api/posts/${postId}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update shares count in state
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, shares: [...post.shares, currentUser.id] }
          : post
      ));
    } catch (error) {
      console.error("Failed to share post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove post from state
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const getFilteredPosts = () => {
    switch (activeFilter) {
      case 'trending':
        return trendingPosts;
      case 'recent':
        return posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'following':
        // Filter posts from followed users (implement following system)
        return posts;
      default:
        return posts;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-gray-800/95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Marketing Department Social Hub
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jagannath University • Connect, Learn, Grow Together
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Quick Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Link to="/profile" className="flex items-center gap-3 group">
                <img
                  src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=3b82f6&color=ffffff`}
                  alt={currentUser?.fullName}
                  className="w-12 h-12 rounded-full object-cover group-hover:ring-2 group-hover:ring-blue-500 transition-all"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {currentUser?.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {currentUser?.role}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Department Stats</h3>
              <div className="space-y-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors cursor-pointer">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">{topic.tag}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{topic.posts} posts</p>
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">{topic.growth}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Department Notices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-h-[400px] overflow-y-auto"
            >
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-2">
                <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Department Notices
              </h3>
              <div className="space-y-4">
                {departmentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-3 rounded-lg border transition-colors hover:shadow-sm ${
                      notice.priority === 'high' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                        : notice.priority === 'medium'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-semibold ${
                        notice.priority === 'high' ? 'text-red-700 dark:text-red-400' 
                        : notice.priority === 'medium' ? 'text-yellow-700 dark:text-yellow-400'
                        : 'text-blue-700 dark:text-blue-400'
                      }`}>
                        {notice.department} Dept.
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notice.date}</span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white mb-2">{notice.notice}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notice.type === 'lecture' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : notice.type === 'deadline' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : notice.type === 'workshop' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {notice.type}
                      </span>
                      <span className={`text-xs font-medium ${
                        notice.priority === 'high' ? 'text-red-600 dark:text-red-400'
                        : notice.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {notice.priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post Quick Access */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=3b82f6&color=ffffff`}
                  alt={currentUser?.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  What's on your mind, {currentUser?.fullName?.split(' ')[0]}?
                </button>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Image className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Photo</span>
                </button>
                
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Video className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium">Video</span>
                </button>
                
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium">Feeling</span>
                </button>
              </div>
            </motion.div>

            {/* Post Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {postFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        activeFilter === filter.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {filter.label}
                      {filter.count > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">
                          {filter.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                
                <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {getFilteredPosts().length > 0 ? (
                getFilteredPosts().map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard 
                      post={post} 
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      onDelete={handleDeletePost}
                      currentUser={currentUser}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Be the first to share something with your community!
                  </p>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Post
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Posts Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Trending Posts</h3>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                {trendingPosts.slice(0, 3).map((post, index) => (
                  <div key={post._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={post.author.profileImage || `https://ui-avatars.com/api/?name=${post.author.fullName}&background=3b82f6&color=ffffff`}
                        alt={post.author.fullName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.author.fullName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span>{post.likes.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-blue-500" />
                        <span>{post.comments.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-green-500" />
                        <span>{post.shares.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full ${event.color} mt-1 flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {event.date} • {event.location}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                View All Events
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/user/find"
                  className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Find Study Materials</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Browse notes & resources</p>
                  </div>
                </Link>
                
                <Link
                  to="/user/upload"
                  className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Upload Notes</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Share your materials</p>
                  </div>
                </Link>
                
                <Link
                  to="/leaderboard"
                  className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                    <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">View Leaderboard</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">See top contributors</p>
                  </div>
                </Link>
                
                <Link
                  to="/user/dashboard"
                  className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">My Dashboard</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Personal overview</p>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Online Friends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Active Now</h3>
              <div className="space-y-3">
                {/* Placeholder for online friends - implement friend system */}
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                      alt="Friend"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sarah Ahmed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                      alt="Friend"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Rafiq Hassan</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active 2m ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
                      alt="Friend"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Fatima Khan</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active 5m ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Post Creation Modal */}
      <PostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Home;