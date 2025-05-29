import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Image as ImageIcon,
  Video,
  Smile,
  MapPin,
  Users,
  Calendar,
  Hash,
  Link as LinkIcon,
  Globe,
  Lock,
  Eye,
  Send,
  Plus,
  Camera
} from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import MediaUploadPreview from './MediaUploadPreview';

const PostModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [privacy, setPrivacy] = useState('public');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feeling, setFeeling] = useState('');
  
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const textareaRef = useRef(null);

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this post' },
    { value: 'friends', label: 'Friends', icon: Users, description: 'Only your friends can see this' },
    { value: 'private', label: 'Only me', icon: Lock, description: 'Only you can see this post' }
  ];

  const feelings = [
    '😊 happy', '😢 sad', '😍 loved', '🎉 excited', '😴 tired', 
    '🤔 thoughtful', '😎 cool', '🥳 celebrating', '😋 hungry', '💪 motivated'
  ];

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        media,
        privacy,
        location: location.trim(),
        tags,
        feeling
      });
      
      // Reset form
      setContent('');
      setMedia([]);
      setLocation('');
      setTags([]);
      setFeeling('');
      setPrivacy('public');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = (event, type) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (media.length < 4) { // Limit to 4 media files
        const reader = new FileReader();
        reader.onload = (e) => {
          setMedia(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            type
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeMedia = (id) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + emoji + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Post</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={currentUser?.profileImage || `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=3b82f6&color=ffffff`}
                alt={currentUser?.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {currentUser?.fullName}
                </h3>
                <div className="flex items-center gap-2">
                  {/* Privacy Selector */}
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {privacyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Feeling/Activity */}
            {feeling && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                  {currentUser?.fullName} is feeling {feeling}
                </span>
                <button
                  onClick={() => setFeeling('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content Input */}
            <div className="mb-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${currentUser?.fullName?.split(' ')[0]}?`}
                className="w-full p-4 text-lg border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {content.length}/2000
              </div>
            </div>

            {/* Media Preview */}
            {media.length > 0 && (
              <MediaUploadPreview media={media} onRemove={removeMedia} />
            )}

            {/* Location Input */}
            {location && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location..."
                    className="flex-1 bg-transparent text-green-800 dark:text-green-200 placeholder-green-600 focus:outline-none"
                  />
                  <button
                    onClick={() => setLocation('')}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add Tag Input */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tags..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Hash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-2xl p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Add to your post
              </p>
              <div className="flex flex-wrap gap-3">
                {/* Photo/Video */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  Photo
                </button>
                
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Video className="w-5 h-5" />
                  Video
                </button>

                {/* Emoji */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                >
                  <Smile className="w-5 h-5" />
                  Emoji
                </button>

                {/* Location */}
                <button
                  onClick={() => setLocation('Dhaka, Bangladesh')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Location
                </button>

                {/* Feeling */}
                <div className="relative">
                  <select
                    value={feeling}
                    onChange={(e) => setFeeling(e.target.value)}
                    className="appearance-none bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer focus:outline-none"
                  >
                    <option value="">😊 Feeling</option>
                    {feelings.map((feel, index) => (
                      <option key={index} value={feel.split(' ')[1]}>
                        {feel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mb-4">
                <EmojiPicker onEmojiSelect={insertEmoji} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={(!content.trim() && media.length === 0) || isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Post
                </>
              )}
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleMediaUpload(e, 'image')}
            accept="image/*"
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={videoInputRef}
            onChange={(e) => handleMediaUpload(e, 'video')}
            accept="video/*"
            className="hidden"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PostModal;