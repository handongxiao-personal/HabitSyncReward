import { createContext, useContext, useReducer, useEffect } from 'react';
import { DEMO_USER_IDS } from '../utils/constants';
import { useAuth } from './AuthContext';
import { 
  subscribeToUserAllData,
  createTask as createTaskFirestore,
  updateTask as updateTaskFirestore,
  deleteTask as deleteTaskFirestore,
  completeTask as completeTaskFirestore,
  createReward as createRewardFirestore,
  updateReward as updateRewardFirestore,
  deleteReward as deleteRewardFirestore,
  claimReward as claimRewardFirestore,
  deleteActivity as deleteActivityFirestore,
  subscribeToUserProfile,
  getUserProfile
} from '../services/firestore';

// Initial state
const initialState = {
  // UI state
  activeTab: 'tasks',
  viewingUser: 'current',
  isDarkMode: false,
  
  // User data
  currentUserId: null,
  otherUserId: null,
  
  // Firebase data
  currentUserData: {
    score: 0,
    tasks: [],
    rewards: [],
    activities: []
  },
  otherUserData: {
    score: 0,
    tasks: [],
    rewards: [],
    activities: []
  },
  
  // Loading states
  loading: {
    tasks: true,
    rewards: true,
    activities: true,
    score: true
  },
  
  // Error states
  error: {
    tasks: null,
    rewards: null,
    activities: null,
    score: null
  },
  
  // Modal states
  showTaskModal: false,
  showRewardModal: false,
  
  // Firebase connection state
  isConnected: false,
  
  // User profiles
  partnerProfile: null
};

// Action types
const ActionTypes = {
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_VIEWING_USER: 'SET_VIEWING_USER',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER_IDS: 'SET_USER_IDS',
  SET_CONNECTION_STATE: 'SET_CONNECTION_STATE',
  
  // Firebase data updates
  SET_TASKS: 'SET_TASKS',
  SET_REWARDS: 'SET_REWARDS',
  SET_ACTIVITIES: 'SET_ACTIVITIES',
  SET_SCORE: 'SET_SCORE',
  
  // Legacy actions (for backward compatibility)
  UPDATE_USER_DATA: 'UPDATE_USER_DATA',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  ADD_REWARD: 'ADD_REWARD',
  UPDATE_REWARD: 'UPDATE_REWARD',
  CLAIM_REWARD: 'CLAIM_REWARD',
  DELETE_REWARD: 'DELETE_REWARD',
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  DELETE_ACTIVITY: 'DELETE_ACTIVITY',
  
  // Modal actions
  SHOW_TASK_MODAL: 'SHOW_TASK_MODAL',
  HIDE_TASK_MODAL: 'HIDE_TASK_MODAL',
  SHOW_REWARD_MODAL: 'SHOW_REWARD_MODAL',
  HIDE_REWARD_MODAL: 'HIDE_REWARD_MODAL',
  
  // Profile actions
  SET_PARTNER_PROFILE: 'SET_PARTNER_PROFILE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };
      
    case ActionTypes.SET_VIEWING_USER:
      return {
        ...state,
        viewingUser: action.payload
      };
      
    case ActionTypes.TOGGLE_THEME:
      return {
        ...state,
        isDarkMode: !state.isDarkMode
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.key]: action.payload.value
        }
      };
      
    case ActionTypes.SET_USER_IDS:
      return {
        ...state,
        currentUserId: action.payload.currentUserId,
        otherUserId: action.payload.otherUserId
      };
      
    case ActionTypes.SET_CONNECTION_STATE:
      return {
        ...state,
        isConnected: action.payload
      };
      
    case ActionTypes.SET_TASKS:
      const tasksUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [tasksUserType]: {
          ...state[tasksUserType],
          tasks: action.payload.tasks
        },
        loading: {
          ...state.loading,
          tasks: false
        },
        error: {
          ...state.error,
          tasks: null
        }
      };
      
    case ActionTypes.SET_REWARDS:
      const rewardsUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [rewardsUserType]: {
          ...state[rewardsUserType],
          rewards: action.payload.rewards
        },
        loading: {
          ...state.loading,
          rewards: false
        },
        error: {
          ...state.error,
          rewards: null
        }
      };
      
    case ActionTypes.SET_ACTIVITIES:
      const activitiesUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [activitiesUserType]: {
          ...state[activitiesUserType],
          activities: action.payload.activities
        },
        loading: {
          ...state.loading,
          activities: false
        },
        error: {
          ...state.error,
          activities: null
        }
      };
      
    case ActionTypes.SET_SCORE:
      const scoreUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [scoreUserType]: {
          ...state[scoreUserType],
          score: action.payload.score
        },
        loading: {
          ...state.loading,
          score: false
        },
        error: {
          ...state.error,
          score: null
        }
      };
      
    case ActionTypes.UPDATE_USER_DATA:
      return {
        ...state,
        [action.payload.userType]: {
          ...state[action.payload.userType],
          ...action.payload.data
        }
      };
      
    case ActionTypes.ADD_TASK:
      const userType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [userType]: {
          ...state[userType],
          tasks: [...state[userType].tasks, action.payload.task]
        }
      };
      
    case ActionTypes.UPDATE_TASK:
      const updateUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [updateUserType]: {
          ...state[updateUserType],
          tasks: state[updateUserType].tasks.map(task =>
            task.id === action.payload.taskId
              ? { ...task, ...action.payload.updates }
              : task
          )
        }
      };
      
    case ActionTypes.DELETE_TASK:
      const deleteUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [deleteUserType]: {
          ...state[deleteUserType],
          tasks: state[deleteUserType].tasks.filter(task => task.id !== action.payload.taskId)
        }
      };
      
    case ActionTypes.COMPLETE_TASK: {
      const { userId, taskId, points } = action.payload;
      const userType = userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      const taskToComplete = state[userType].tasks.find(t => t.id === taskId);

      if (!taskToComplete) {
        return state;
      }

      const newActivity = {
        id: `activity_${Date.now()}`,
        taskName: taskToComplete.name,
        pointsEarned: points,
        timestamp: new Date(),
        type: 'task_completed',
      };

      return {
        ...state,
        [userType]: {
          ...state[userType],
          tasks: state[userType].tasks.map(task => {
            if (task.id === taskId && task.type === 'achievement') {
              return { ...task, isAchieved: true };
            }
            return task;
          }),
          score: state[userType].score + points,
          activities: [newActivity, ...state[userType].activities],
        },
      };
    }
      
    case ActionTypes.ADD_REWARD:
      const rewardUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [rewardUserType]: {
          ...state[rewardUserType],
          rewards: [...state[rewardUserType].rewards, action.payload.reward]
        }
      };
      
    case ActionTypes.UPDATE_REWARD:
      const updateRewardUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [updateRewardUserType]: {
          ...state[updateRewardUserType],
          rewards: state[updateRewardUserType].rewards.map(reward =>
            reward.id === action.payload.rewardId
              ? { ...reward, ...action.payload.updates }
              : reward
          )
        }
      };
      
    case ActionTypes.DELETE_REWARD:
      const deleteRewardUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [deleteRewardUserType]: {
          ...state[deleteRewardUserType],
          rewards: state[deleteRewardUserType].rewards.filter(reward => reward.id !== action.payload.rewardId)
        }
      };
      
    case ActionTypes.CLAIM_REWARD: {
      const { userId, rewardId, pointCost } = action.payload;
      const userType = userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      const rewardToClaim = state[userType].rewards.find(r => r.id === rewardId);

      if (!rewardToClaim) {
        return state;
      }

      const newActivity = {
        id: `activity_${Date.now()}`,
        taskName: rewardToClaim.name,
        pointsEarned: -pointCost,
        timestamp: new Date(),
        type: 'reward_claimed'
      };

      return {
        ...state,
        [userType]: {
          ...state[userType],
          rewards: state[userType].rewards.map(reward =>
            reward.id === rewardId
              ? { ...reward, isClaimed: true, claimedAt: new Date() }
              : reward
          ),
          score: state[userType].score - pointCost,
          activities: [newActivity, ...state[userType].activities]
        }
      };
    }
      
    case ActionTypes.DELETE_ACTIVITY: {
      const { userId, activityId } = action.payload;
      const userType = userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      const activityToDelete = state[userType].activities.find(activity => activity.id === activityId);

      if (!activityToDelete) {
        return state;
      }

      const pointsToRevert = activityToDelete.pointsEarned;

      return {
        ...state,
        [userType]: {
          ...state[userType],
          activities: state[userType].activities.filter(activity => activity.id !== activityId),
          score: state[userType].score - pointsToRevert
        }
      };
    }
      
    case ActionTypes.SHOW_TASK_MODAL:
      return { ...state, showTaskModal: true };
      
    case ActionTypes.HIDE_TASK_MODAL:
      return { ...state, showTaskModal: false };
      
    case ActionTypes.SHOW_REWARD_MODAL:
      return { ...state, showRewardModal: true };
      
    case ActionTypes.HIDE_REWARD_MODAL:
      return { ...state, showRewardModal: false };
      
    case ActionTypes.SET_PARTNER_PROFILE:
      return { 
        ...state, 
        partnerProfile: action.payload 
      };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { userIds, isAuthenticated } = useAuth();
  
  // 同步用户ID
  useEffect(() => {
    if (userIds.currentUserId && userIds.otherUserId) {
      dispatch({
        type: ActionTypes.SET_USER_IDS,
        payload: userIds
      });
    }
  }, [userIds]);
  
  // Firebase数据同步
  useEffect(() => {
    if (!isAuthenticated || !userIds.currentUserId || !userIds.otherUserId) {
      return;
    }
    
    dispatch({ type: ActionTypes.SET_CONNECTION_STATE, payload: true });
    
    // 订阅当前用户数据
    console.log('订阅当前用户数据:', userIds.currentUserId);
    const unsubscribeCurrentUser = subscribeToUserAllData(userIds.currentUserId, {
      onTasksChange: (tasks) => {
        console.log('当前用户任务更新:', tasks.length, '个任务');
        dispatch({
          type: ActionTypes.SET_TASKS,
          payload: { userId: userIds.currentUserId, tasks }
        });
      },
      onRewardsChange: (rewards) => {
        console.log('当前用户奖励更新:', rewards.length, '个奖励');
        dispatch({
          type: ActionTypes.SET_REWARDS,
          payload: { userId: userIds.currentUserId, rewards }
        });
      },
      onActivitiesChange: (activities) => {
        console.log('当前用户活动更新:', activities.length, '个活动');
        dispatch({
          type: ActionTypes.SET_ACTIVITIES,
          payload: { userId: userIds.currentUserId, activities }
        });
      },
      onScoreChange: (userScore) => {
        console.log('当前用户积分更新:', userScore.currentScore);
        dispatch({
          type: ActionTypes.SET_SCORE,
          payload: { userId: userIds.currentUserId, score: userScore.currentScore }
        });
      }
    });
    
    // 订阅对方用户数据
    const unsubscribeOtherUser = subscribeToUserAllData(userIds.otherUserId, {
      onTasksChange: (tasks) => {
        dispatch({
          type: ActionTypes.SET_TASKS,
          payload: { userId: userIds.otherUserId, tasks }
        });
      },
      onRewardsChange: (rewards) => {
        dispatch({
          type: ActionTypes.SET_REWARDS,
          payload: { userId: userIds.otherUserId, rewards }
        });
      },
      onActivitiesChange: (activities) => {
        dispatch({
          type: ActionTypes.SET_ACTIVITIES,
          payload: { userId: userIds.otherUserId, activities }
        });
      },
      onScoreChange: (userScore) => {
        dispatch({
          type: ActionTypes.SET_SCORE,
          payload: { userId: userIds.otherUserId, score: userScore.currentScore }
        });
      }
    });
    
    // 清理订阅
    return () => {
      unsubscribeCurrentUser();
      unsubscribeOtherUser();
      dispatch({ type: ActionTypes.SET_CONNECTION_STATE, payload: false });
    };
  }, [isAuthenticated, userIds.currentUserId, userIds.otherUserId]);
  
  // 监听伙伴的配置信息
  useEffect(() => {
    if (!userIds.otherUserId) {
      dispatch({ type: ActionTypes.SET_PARTNER_PROFILE, payload: null });
      return;
    }
    
    const unsubscribe = subscribeToUserProfile(userIds.otherUserId, (profile) => {
      dispatch({ type: ActionTypes.SET_PARTNER_PROFILE, payload: profile });
    });
    
    return unsubscribe;
  }, [userIds.otherUserId]);
  
  const actions = {
    // UI actions
    setActiveTab: (tab) => dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab }),
    setViewingUser: (user) => dispatch({ type: ActionTypes.SET_VIEWING_USER, payload: user }),
    toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
    setLoading: (key, value) => dispatch({ type: ActionTypes.SET_LOADING, payload: { key, value } }),
    setError: (key, value) => dispatch({ type: ActionTypes.SET_ERROR, payload: { key, value } }),
    
    // Firebase Task actions
    addTask: async (task, userId = null) => {
      try {
        const targetUserId = userId || userIds.currentUserId;
        if (!targetUserId) throw new Error('用户未登录');
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'tasks', value: true } });
        await createTaskFirestore(targetUserId, task);
        // 数据会通过实时监听自动更新
      } catch (error) {
        console.error('创建任务失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'tasks', value: error.message } });
      }
    },
    
    updateTask: async (taskId, updates, userId = null) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'tasks', value: true } });
        await updateTaskFirestore(taskId, updates);
      } catch (error) {
        console.error('更新任务失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'tasks', value: error.message } });
      }
    },
    
    deleteTask: async (taskId, userId = null) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'tasks', value: true } });
        await deleteTaskFirestore(taskId);
      } catch (error) {
        console.error('删除任务失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'tasks', value: error.message } });
      }
    },
    
    completeTask: async (taskId, points = null, userId = null) => {
      try {
        const targetUserId = userId || userIds.currentUserId;
        if (!targetUserId) throw new Error('用户未登录');
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'tasks', value: true } });
        await completeTaskFirestore(targetUserId, taskId);
      } catch (error) {
        console.error('完成任务失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'tasks', value: error.message } });
      }
    },
    
    // Firebase Reward actions
    addReward: async (reward, userId = null) => {
      try {
        const targetUserId = userId || userIds.currentUserId;
        if (!targetUserId) throw new Error('用户未登录');
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: true } });
        await createRewardFirestore(targetUserId, reward);
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
      } catch (error) {
        console.error('创建奖励失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'rewards', value: error.message } });
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
        throw error;
      }
    },
    
    updateReward: async (rewardId, updates, userId = null) => {
      try {
        const targetUserId = userId || userIds.currentUserId;
        if (!targetUserId) throw new Error('用户未登录');
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: true } });
        
        // 调用 Firebase 更新
        await updateRewardFirestore(rewardId, updates);
        
        // 立即更新本地状态作为备用（实时监听器应该会覆盖这个更新）
        dispatch({
          type: ActionTypes.UPDATE_REWARD,
          payload: {
            userId: targetUserId,
            rewardId,
            updates: {
              ...updates,
              updatedAt: new Date()
            }
          }
        });
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
      } catch (error) {
        console.error('更新奖励失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'rewards', value: error.message } });
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
        throw error;
      }
    },
    
    deleteReward: async (rewardId, userId = null) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: true } });
        await deleteRewardFirestore(rewardId);
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
      } catch (error) {
        console.error('删除奖励失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'rewards', value: error.message } });
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
        throw error;
      }
    },
    
    claimReward: async (rewardId, pointCost = null, userId = null) => {
      try {
        const targetUserId = userId || userIds.currentUserId;
        if (!targetUserId) throw new Error('用户未登录');
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: true } });
        await claimRewardFirestore(targetUserId, rewardId);
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
      } catch (error) {
        console.error('兑换奖励失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'rewards', value: error.message } });
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'rewards', value: false } });
        throw error;
      }
    },
    
    // Firebase Activity actions
    deleteActivity: async (activityId, userId = null) => {
      try {
        const targetUserId = userId || userIds.currentUserId;
        if (!targetUserId) throw new Error('用户未登录');
        
        dispatch({ type: ActionTypes.SET_LOADING, payload: { key: 'activities', value: true } });
        await deleteActivityFirestore(targetUserId, activityId);
      } catch (error) {
        console.error('删除活动失败:', error);
        dispatch({ type: ActionTypes.SET_ERROR, payload: { key: 'activities', value: error.message } });
      }
    },
    
    // Legacy actions for backward compatibility
    updateUserData: (userType, data) => dispatch({ 
      type: ActionTypes.UPDATE_USER_DATA, 
      payload: { userType, data }
    }),
    
    // Modal actions
    showTaskModal: () => dispatch({ type: ActionTypes.SHOW_TASK_MODAL }),
    hideTaskModal: () => dispatch({ type: ActionTypes.HIDE_TASK_MODAL }),
    showRewardModal: () => dispatch({ type: ActionTypes.SHOW_REWARD_MODAL }),
    hideRewardModal: () => dispatch({ type: ActionTypes.HIDE_REWARD_MODAL })
  };
  
  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
