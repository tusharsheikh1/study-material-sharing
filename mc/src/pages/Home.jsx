import React, { useState, useEffect, useContext } from "react";
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
  Filter,
  RefreshCw,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

// Import API functions
import {
  getPosts,
  getTrendingPosts,
  createPost,
  likePost,
  commentOnPost,
  sharePost,
  deletePost,
  uploadMedia
} from "../utils/api.jsx";

const Home = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Minimal static data - just quick stats
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
      value: Array.isArray(posts) ? posts.length.toString() : "0",
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
      label: "Trending Posts",
      value: Array.isArray(trendingPosts) ? trendingPosts.length.toString() : "0",
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    },
  ];

  // Initialize with safe array
  const postFilters = [
    { id: 'all', label: 'All Posts', count: Array.isArray(posts) ? posts.length : 0 },
    { id: 'following', label: 'Following', count: 0 },
    { id: 'trending', label: 'Trending', count: Array.isArray(trendingPosts) ? trendingPosts.length : 0 },
    { id: 'recent', label: 'Recent', count: 0 }
  ];

  useEffect(() => {
    fetchPosts();
    fetchTrendingPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      
      // Ensure response.data is an array
      const postsData = Array.isArray(response.data) ? response.data : [];
      setPosts(postsData);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingPosts = async () => {
    try {
      const response = await getTrendingPosts();
      
      // Ensure response.data is an array and limit to 3 items
      const trendingData = Array.isArray(response.data) ? response.data.slice(0, 3) : [];
      setTrendingPosts(trendingData);
    } catch (error) {
      console.error("Failed to fetch trending posts:", error);
      setTrendingPosts([]); // Set empty array on error
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
      // First upload media files if any
      const uploadedMedia = [];
      if (postData.media && Array.isArray(postData.media) && postData.media.length > 0) {
        for (const mediaItem of postData.media) {
          const uploadResponse = await uploadMedia(mediaItem.file);
          uploadedMedia.push(uploadResponse.data.url);
        }
      }

      // Create post with uploaded media URLs
      const response = await createPost({
        content: postData.content,
        media: uploadedMedia,
        privacy: postData.privacy,
        location: postData.location,
        tags: postData.tags,
        feeling: postData.feeling
      });

      // Add new post to the beginning of posts array - ensure posts is array
      const currentPosts = Array.isArray(posts) ? posts : [];
      setPosts([response.data, ...currentPosts]);
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await likePost(postId);

      // Update post in state - ensure posts is array
      const currentPosts = Array.isArray(posts) ? posts : [];
      setPosts(currentPosts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: response.data.liked 
                ? [...(post.likes || []), currentUser.id] 
                : (post.likes || []).filter(id => id !== currentUser.id)
            }
          : post
      ));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const response = await commentOnPost(postId, content);

      // Update post comments in state - ensure posts is array
      const currentPosts = Array.isArray(posts) ? posts : [];
      setPosts(currentPosts.map(post => 
        post._id === postId 
          ? { ...post, comments: [...(post.comments || []), response.data] }
          : post
      ));
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleShare = async (postId) => {
    try {
      await sharePost(postId);

      // Update shares count in state - ensure posts is array
      const currentPosts = Array.isArray(posts) ? posts : [];
      setPosts(currentPosts.map(post => 
        post._id === postId 
          ? { ...post, shares: [...(post.shares || []), currentUser.id] }
          : post
      ));
    } catch (error) {
      console.error("Failed to share post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);

      // Remove post from state - ensure posts is array
      const currentPosts = Array.isArray(posts) ? posts : [];
      setPosts(currentPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const getFilteredPosts = () => {
    const safePosts = Array.isArray(posts) ? posts : [];
    const safeTrendingPosts = Array.isArray(trendingPosts) ? trendingPosts : [];
    
    switch (activeFilter) {
      case 'trending':
        return safeTrendingPosts;
      case 'recent':
        return [...safePosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'following':
        // Filter posts from followed users (implement following system)
        return safePosts;
      default:
        return safePosts;
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

  const filteredPosts = getFilteredPosts();

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

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
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
                {Array.isArray(trendingPosts) && trendingPosts.slice(0, 3).map((post, index) => (
                  <div key={post._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={post.author?.profileImage || `https://ui-avatars.com/api/?name=${post.author?.fullName}&background=3b82f6&color=ffffff`}
                        alt={post.author?.fullName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.author?.fullName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span>{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-blue-500" />
                        <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-green-500" />
                        <span>{Array.isArray(post.shares) ? post.shares.length : 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {trendingPosts.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No trending posts yet
                  </div>
                )}
              </div>
            </motion.div>

            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
                <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Announcements
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                      Marketing Dept.
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Today</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white mb-2">
                    Guest lecture on 'Digital Marketing Trends' tomorrow at 2 PM, Room 301.
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    lecture
                  </span>
                </div>
                
                <div className="text-center py-2">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View all announcements
                  </button>
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