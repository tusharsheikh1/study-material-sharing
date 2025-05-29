import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Clock,
  Eye,
  Edit3,
  Trash2,
  Flag,
  Copy,
  ExternalLink
} from 'lucide-react';

// Simple time formatting function (fallback if utils don't exist)
const formatPostTime = (dateString) => {
  if (!dateString) return 'Just now';
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) return 'Just now';
  
  const diffTime = Math.abs(now - date);
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const formatFullDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const PostCard = ({ post, onLike, onComment, onShare, onDelete, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes?.some(like => 
      typeof like === 'string' ? like === currentUser?.id : like._id === currentUser?.id
    ) || false
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const isOwnPost = post.author._id === currentUser?.id;

  const handleLike = async () => {
    try {
      await onLike(post._id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await onComment(post._id, commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    const mediaCount = post.media.length;
    
    return (
      <div className={`mt-4 rounded-2xl overflow-hidden ${
        mediaCount === 1 ? '' : 
        mediaCount === 2 ? 'grid grid-cols-2 gap-1' :
        mediaCount === 3 ? 'grid grid-cols-2 gap-1' :
        'grid grid-cols-2 gap-1'
      }`}>
        {post.media.map((mediaUrl, index) => {
          const isVideo = mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') || mediaUrl.includes('video');
          
          if (mediaCount === 3 && index === 0) {
            return (
              <div key={index} className="row-span-2">
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt=""
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => {/* Open image modal */}}
                  />
                )}
              </div>
            );
          }

          if (mediaCount > 4 && index === 3) {
            return (
              <div key={index} className="relative">
                <img
                  src={post.media[3]}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{mediaCount - 4}
                  </span>
                </div>
              </div>
            );
          }

          if (index >= 4) return null;

          return (
            <div key={index} className={mediaCount === 1 ? 'col-span-2' : ''}>
              {isVideo ? (
                <video
                  src={mediaUrl}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt=""
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => {/* Open image modal */}}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${post.author._id}`}>
            <img
              src={post.author.profileImage || `https://ui-avatars.com/api/?name=${post.author.fullName}&background=3b82f6&color=ffffff`}
              alt={post.author.fullName}
              className="w-12 h-12 rounded-full object-cover hover:opacity-90 transition-opacity"
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link 
                to={`/profile/${post.author._id}`}
                className="font-semibold text-gray-900 dark:text-white hover:underline"
              >
                {post.author.fullName}
              </Link>
              
              {post.author.role === 'admin' && (
                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="capitalize">{post.author.role}</span>
              <span>•</span>
              <div className="flex items-center gap-1" title={formatFullDateTime(post.createdAt)}>
                <Clock className="w-3 h-3" />
                <time dateTime={post.createdAt}>
                  {formatPostTime(post.createdAt)}
                </time>
              </div>
              
              {post.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                </>
              )}
              
              {post.privacy !== 'public' && (
                <>
                  <span>•</span>
                  <span className="capitalize">{post.privacy}</span>
                </>
              )}
            </div>
          </div>

          {/* Post Options */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10 min-w-48">
                <button className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                  <Bookmark className="w-4 h-4" />
                  Save post
                </button>
                
                <button className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                  <Copy className="w-4 h-4" />
                  Copy link
                </button>
                
                {isOwnPost ? (
                  <>
                    <button className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                      <Edit3 className="w-4 h-4" />
                      Edit post
                    </button>
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(post._id)}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete post
                      </button>
                    )}
                  </>
                ) : (
                  <button className="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                    <Flag className="w-4 h-4" />
                    Report post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feeling/Activity */}
      {post.feeling && (
        <div className="px-6 pb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-sm">
            <span>😊</span>
            <span>feeling {post.feeling}</span>
          </div>
        </div>
      )}

      {/* Post Content */}
      <div className="px-6 pb-4">
        {post.content && (
          <div className="text-gray-900 dark:text-white leading-relaxed mb-3">
            <p>{post.content}</p>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Media */}
        {renderMedia()}
      </div>

      {/* Post Stats */}
      <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            {likesCount > 0 && (
              <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
            )}
            {post.comments && post.comments.length > 0 && (
              <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
            )}
            {post.shares && post.shares.length > 0 && (
              <span>{post.shares.length} {post.shares.length === 1 ? 'share' : 'shares'}</span>
            )}
          </div>
          
          {post.views && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views} views</span>
            </div>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              isLiked
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button
            onClick={() => onShare && onShare(post._id)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            {/* Comment Form */}
            <form onSubmit={handleComment} className="flex gap-3 mb-4">
              <img
                src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=3b82f6&color=ffffff`}
                alt={currentUser?.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments && post.comments.map((comment) => (
                <div key={comment._id || comment.id} className="flex gap-3">
                  <Link to={`/profile/${comment.user._id || comment.user.id}`}>
                    <img
                      src={comment.user.profileImage || `https://ui-avatars.com/api/?name=${comment.user.fullName}&background=3b82f6&color=ffffff`}
                      alt={comment.user.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                      <Link 
                        to={`/profile/${comment.user._id || comment.user.id}`}
                        className="font-medium text-gray-900 dark:text-white text-sm hover:underline"
                      >
                        {comment.user.fullName}
                      </Link>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <time dateTime={comment.createdAt} title={formatFullDateTime(comment.createdAt)}>
                        {formatPostTime(comment.createdAt)}
                      </time>
                      <button className="hover:underline">Like</button>
                      <button className="hover:underline">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;