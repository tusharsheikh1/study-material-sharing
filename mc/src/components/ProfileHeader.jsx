import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Edit3, 
  MessageCircle, 
  UserPlus, 
  UserCheck, 
  Share2, 
  MoreHorizontal,
  Settings,
  Users,
  Heart,
  FileText
} from 'lucide-react';

const ProfileHeader = ({ user, stats, isOwnProfile, onEditProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow user
  };

  const ActionButton = ({ icon: Icon, label, onClick, variant = 'secondary' }) => {
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors";
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300",
      success: "bg-green-600 hover:bg-green-700 text-white"
    };

    return (
      <button 
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]}`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  };

  return (
    <div className="relative -mt-20 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          
          {/* Profile Picture */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img
                src={user.profileImage || `https://ui-avatars.com/api/?name=${user.fullName}&background=3b82f6&color=ffffff&size=160`}
                alt={user.fullName}
                className="w-40 h-40 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              />
              
              {/* Online Status */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
              
              {/* Camera Button (Own Profile) */}
              {isOwnProfile && (
                <button className="absolute bottom-2 left-2 p-2 bg-gray-900/70 text-white rounded-lg hover:bg-gray-900/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              
              {/* Name and Details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.fullName}
                  {user.emailVerified && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    🎓 {user.role === 'student' ? 'Student' : user.role === 'cr' ? 'Class Representative' : 'Faculty'}
                  </span>
                  {user.semester && (
                    <span>Semester {user.semester}</span>
                  )}
                  {user.batch && (
                    <span>Batch {user.batch}</span>
                  )}
                </div>

                {user.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                    {user.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-gray-900 dark:text-white">{stats.postsCount}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Posts</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="font-bold text-gray-900 dark:text-white">{stats.friendsCount}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Friends</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="font-bold text-gray-900 dark:text-white">{stats.likesReceived}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Likes</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {isOwnProfile ? (
                  <>
                    <ActionButton
                      icon={Edit3}
                      label="Edit Profile"
                      onClick={onEditProfile}
                      variant="secondary"
                    />
                    <ActionButton
                      icon={Settings}
                      label="Settings"
                      onClick={() => {/* Handle settings */}}
                      variant="secondary"
                    />
                  </>
                ) : (
                  <>
                    <ActionButton
                      icon={isFollowing ? UserCheck : UserPlus}
                      label={isFollowing ? 'Following' : 'Follow'}
                      onClick={handleFollowToggle}
                      variant={isFollowing ? 'success' : 'primary'}
                    />
                    <ActionButton
                      icon={MessageCircle}
                      label="Message"
                      onClick={() => {/* Handle message */}}
                      variant="secondary"
                    />
                    
                    {/* More Options */}
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Profile Info Bar */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            {user.location && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{user.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            
            {user.website && (
              <div className="flex items-center gap-2">
                <span>🔗</span>
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span>⭐</span>
              <span>Level {Math.floor(stats.postsCount / 10) + 1} Contributor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;