// App constants
export const APP_NAME = 'HabitSync Rewards';

// Task types
export const TASK_TYPES = {
  DAILY: 'daily',
  ACHIEVEMENT: 'achievement',
  BAD_HABIT: 'bad_habit'
};

// Task type labels
export const TASK_TYPE_LABELS = {
  [TASK_TYPES.DAILY]: 'Daily',
  [TASK_TYPES.ACHIEVEMENT]: 'Achievement',
  [TASK_TYPES.BAD_HABIT]: 'Bad Habit'
};

// Task type icons
export const TASK_TYPE_ICONS = {
  [TASK_TYPES.DAILY]: '📅',
  [TASK_TYPES.ACHIEVEMENT]: '🏆',
  [TASK_TYPES.BAD_HABIT]: '⚠️'
};

// Activity types
export const ACTIVITY_TYPES = {
  TASK_COMPLETED: 'task_completed',
  REWARD_CLAIMED: 'reward_claimed'
};

// Default values
export const DEFAULT_POINTS = {
  DAILY_TASK: 25,
  ACHIEVEMENT: 100,
  BAD_HABIT: -30
};

// Colors
export const COLORS = {
  PRIMARY: '#7C3AED',
  POSITIVE: '#10B981',
  NEGATIVE: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6'
};

// Demo user IDs
export const DEMO_USER_IDS = {
  CURRENT: 'user-abc123',
  OTHER: 'user-xyz789'
};
