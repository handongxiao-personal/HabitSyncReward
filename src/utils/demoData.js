import { generateId } from './helpers';

// Demo tasks
export const demoTasks = [
  {
    id: generateId(),
    name: 'Complete morning workout',
    type: 'daily',
    pointValue: 25,
    isAchieved: false,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Read 50 pages',
    type: 'achievement',
    pointValue: 100,
    isAchieved: false,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Drink 8 glasses of water',
    type: 'daily',
    pointValue: 15,
    isAchieved: false,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Meditate for 10 minutes',
    type: 'daily',
    pointValue: 20,
    isAchieved: false,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Stay up past midnight',
    type: 'bad_habit',
    pointValue: -30,
    isAchieved: false,
    createdAt: new Date()
  }
];

// Demo rewards
export const demoRewards = [
  {
    id: generateId(),
    name: 'Movie night with popcorn',
    pointCost: 500,
    isClaimed: false,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Buy new book',
    pointCost: 300,
    isClaimed: false,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Take a day off',
    pointCost: 1000,
    isClaimed: false,
    createdAt: new Date()
  },
  {
    id: generateId(),
    name: 'Order favorite takeout',
    pointCost: 200,
    isClaimed: true,
    claimedAt: new Date(Date.now() - 86400000), // 1 day ago
    createdAt: new Date()
  }
];

// Demo activities
export const demoActivities = [
  {
    id: generateId(),
    taskName: 'Complete morning workout',
    pointsEarned: 25,
    type: 'task_completed',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    userId: 'user-abc123'
  },
  {
    id: generateId(),
    taskName: 'Morning meditation',
    pointsEarned: 50,
    type: 'task_completed',
    timestamp: new Date(Date.now() - 1980000), // 33 minutes ago
    userId: 'user-abc123'
  },
  {
    id: generateId(),
    taskName: 'Cook healthy meal',
    pointsEarned: 40,
    type: 'task_completed',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    userId: 'user-abc123'
  },
  {
    id: generateId(),
    taskName: 'Order favorite takeout',
    pointsEarned: -200,
    type: 'reward_claimed',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    userId: 'user-abc123'
  }
];

// Demo user data
export const demoCurrentUserData = {
  score: 475,
  tasks: demoTasks,
  rewards: demoRewards,
  activities: demoActivities
};

export const demoOtherUserData = {
  score: 320,
  tasks: [
    {
      id: generateId(),
      name: 'Go for a run',
      type: 'daily',
      pointValue: 30,
      isAchieved: false,
      createdAt: new Date()
    },
    {
      id: generateId(),
      name: 'Learn new skill',
      type: 'achievement',
      pointValue: 150,
      isAchieved: false,
      createdAt: new Date()
    }
  ],
  rewards: [
    {
      id: generateId(),
      name: 'Buy new shoes',
      pointCost: 400,
      isClaimed: false,
      createdAt: new Date()
    },
    {
      id: generateId(),
      name: 'Watch Netflix series',
      pointCost: 250,
      isClaimed: false,
      createdAt: new Date()
    }
  ],
  activities: [
    {
      id: generateId(),
      taskName: 'Go for a run',
      pointsEarned: 30,
      type: 'task_completed',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      userId: 'user-xyz789'
    },
    {
      id: generateId(),
      taskName: 'Read for 1 hour',
      pointsEarned: 40,
      type: 'task_completed',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      userId: 'user-xyz789'
    }
  ]
};
