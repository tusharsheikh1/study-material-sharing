// utils/timeUtils.js

/**
 * Format date for social media posts (e.g., "2m", "5h", "Yesterday", "Jan 15")
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Formatted time string
 */
export const formatPostTime = (dateString) => {
  if (!dateString) return 'Just now';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Just now';
  
  const diffTime = Math.abs(now - date);
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d`;
  if (diffWeeks < 4) return `${diffWeeks}w`;
  if (diffMonths < 12) return `${diffMonths}mo`;
  if (diffYears === 1) return '1 year ago';
  if (diffYears > 1) return `${diffYears} years ago`;
  
  // Fallback to formatted date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Get full formatted date and time
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Full formatted date and time
 */
export const formatFullDateTime = (dateString) => {
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

/**
 * Format date for comments (more detailed)
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Formatted time string
 */
export const formatCommentTime = (dateString) => {
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
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Check if a date is today
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} - True if the date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is yesterday
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} - True if the date is yesterday
 */
export const isYesterday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.toDateString() === yesterday.toDateString();
};

/**
 * Get relative time with more context
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Relative time with context
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown time';
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) return 'Unknown time';
  
  const diffTime = now - date;
  const isPast = diffTime > 0;
  const absDiffTime = Math.abs(diffTime);
  
  const diffSeconds = Math.floor(absDiffTime / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  const suffix = isPast ? 'ago' : 'from now';
  
  if (diffSeconds < 60) return isPast ? 'Just now' : 'In a moment';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ${suffix}`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ${suffix}`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ${suffix}`;
  
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};