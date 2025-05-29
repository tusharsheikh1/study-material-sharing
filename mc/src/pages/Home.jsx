// ✅ At the top — everything remains the same...
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

// ✅ Everything else above remains unchanged...

const Home = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // ... your static data: upcomingEvents, trendingTopics, quickStats, departmentNotices, postFilters

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

      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  // ✅ Updated function — safe fallback for array handling
  const getFilteredPosts = () => {
    const safePosts = Array.isArray(posts) ? posts : [];
    const safeTrending = Array.isArray(trendingPosts) ? trendingPosts : [];

    switch (activeFilter) {
      case 'trending':
        return safeTrending;
      case 'recent':
        return [...safePosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'following':
        return safePosts; // Add following logic later
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* ... your header, sidebars, and other layout components ... */}

      {/* ✅ Fixed Post Feed Rendering */}
      <div className="space-y-6">
        {Array.isArray(getFilteredPosts()) && getFilteredPosts().length > 0 ? (
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
