import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import axios from 'axios';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  MessageCircle,
  Plus,
  Image,
  Video,
  Smile
} from 'lucide-react';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userStats, setUserStats] = useState({
    postsCount: 0,
    friendsCount: 0,
    likesReceived: 0
  });

  const isOwnProfile = !userId || userId === currentUser?.id;
  const targetUserId = isOwnProfile ? currentUser?.id : userId;

  useEffect(() => {
    fetchProfileData();
  }, [userId, currentUser]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      if (isOwnProfile) {
        setProfileUser(currentUser);
        await Promise.all([
          fetchUserPosts(currentUser?.id),
          fetchUserStats(currentUser?.id)
        ]);
      } else {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileUser(response.data);
        await Promise.all([
          fetchUserPosts(userId),
          fetchUserStats(userId)
        ]);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (targetUserId) => {
    try {
      setPostsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/posts/user/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchUserStats = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/users/${targetUserId}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
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

      setUserPosts([response.data, ...userPosts]);
      setUserStats(prev => ({
        ...prev,
        postsCount: prev.postsCount + 1
      }));
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

      setUserPosts(userPosts.map(post => 
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

      setUserPosts(userPosts.map(post => 
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

      setUserPosts(userPosts.map(post => 
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

      setUserPosts(userPosts.filter(post => post._id !== postId));
      setUserStats(prev => ({
        ...prev,
        postsCount: Math.max(0, prev.postsCount - 1)
      }));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Photo Section */}
      <div className="relative">
        <div className="h-80 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
          {profileUser.coverImage ? (
            <img
              src={profileUser.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
          )}
        </div>
        
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <ProfileHeader 
          user={profileUser}
          stats={userStats}
          isOwnProfile={isOwnProfile}
          onEditProfile={() => {}}
        />

        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 'posts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Left Sidebar - About */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About</h3>
                  
                  <div className="space-y-4">
                    {profileUser.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {profileUser.bio}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      {profileUser.role && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 text-sm">🎓</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {profileUser.role === 'student' ? 'Student' : profileUser.role === 'cr' ? 'Class Representative' : 'Faculty'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {profileUser.semester && `Semester ${profileUser.semester}`}
                              {profileUser.batch && ` • Batch ${profileUser.batch}`}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {profileUser.location && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Lives in {profileUser.location}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Joined {new Date(profileUser.createdAt || Date.now()).toLocaleDateString('en-US', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Photos</h3>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                      See all
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {userPosts
                      .filter(post => post.media && post.media.length > 0)
                      .slice(0, 6)
                      .map((post, index) => (
                        post.media.slice(0, 1).map((media, mediaIndex) => (
                          <div key={`${post._id}-${mediaIndex}`} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img 
                              src={media} 
                              alt=""
                              className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                            />
                          </div>
                        ))
                      ))
                    }
                    {userPosts.filter(post => post.media && post.media.length > 0).length === 0 && (
                      Array.from({length: 6}).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content - Posts */}
              <div className="lg:col-span-2">
                {/* Create Post (Own Profile Only) */}
                {isOwnProfile && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={profileUser.profileImage || `https://ui-avatars.com/api/?name=${profileUser.fullName}&background=3b82f6&color=ffffff`}
                        alt={profileUser.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <button 
                        onClick={() => setShowCreatePost(true)}
                        className="flex-1 text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        What's on your mind, {profileUser.fullName?.split(' ')[0]}?
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
                  </div>
                )}

                {/* Posts Feed */}
                <div className="space-y-6">
                  {postsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                    </div>
                  ) : userPosts.length > 0 ? (
                    userPosts.map((post, index) => (
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
                          onDelete={isOwnProfile ? handleDeletePost : undefined}
                          currentUser={currentUser}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No posts yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {isOwnProfile 
                          ? "Share your first post to get started!" 
                          : `${profileUser.fullName} hasn't posted anything yet.`
                        }
                      </p>
                      {isOwnProfile && (
                        <button
                          onClick={() => setShowCreatePost(true)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Create Your First Post
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About {profileUser.fullName}</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</span>
                        <p className="text-gray-900 dark:text-white">{profileUser.fullName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                        <p className="text-gray-900 dark:text-white">{profileUser.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Student ID</span>
                        <p className="text-gray-900 dark:text-white">{profileUser.studentId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</span>
                        <p className="text-gray-900 dark:text-white capitalize">{profileUser.role}</p>
                      </div>
                      {profileUser.semester && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester</span>
                          <p className="text-gray-900 dark:text-white">{profileUser.semester}</p>
                        </div>
                      )}
                      {profileUser.batch && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Batch</span>
                          <p className="text-gray-900 dark:text-white">{profileUser.batch}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'photos' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Photos</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userPosts
                    .filter(post => post.media && post.media.length > 0)
                    .flatMap(post => post.media)
                    .slice(0, 20)
                    .map((media, index) => (
                      <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                        <img 
                          src={media} 
                          alt=""
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      </div>
                    ))
                  }
                  
                  {userPosts.filter(post => post.media && post.media.length > 0).length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No photos yet</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {isOwnProfile ? "Share some photos to get started!" : `${profileUser.fullName} hasn't shared any photos yet.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <PostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Profile;