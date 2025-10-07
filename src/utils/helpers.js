import { format, formatDistanceToNow } from 'date-fns';

// Format timestamp to readable time
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

// Format timestamp to relative time
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

// Format points with sign
export const formatPoints = (points) => {
  if (points > 0) return `+${points}`;
  if (points < 0) return `${points}`;
  return '0';
};

// Get task type color class
export const getTaskTypeColor = (type) => {
  switch (type) {
    case 'daily':
      return 'bg-blue-100 text-blue-800';
    case 'achievement':
      return 'bg-yellow-100 text-yellow-800';
    case 'bad_habit':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get activity color class
export const getActivityColor = (type, pointsEarned) => {
  if (type === 'task_completed') {
    return pointsEarned > 0 ? 'bg-purple-100' : 'bg-red-100';
  }
  return 'bg-blue-100';
};

// Calculate progress percentage
export const calculateProgress = (current, target) => {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
