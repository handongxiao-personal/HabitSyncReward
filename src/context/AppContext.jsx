import { createContext, useContext, useReducer } from 'react';
import { DEMO_USER_IDS } from '../utils/constants';

// Initial state
const initialState = {
  // UI state
  activeTab: 'tasks',
  viewingUser: 'current',
  isDarkMode: false,
  
  // User data
  currentUserId: DEMO_USER_IDS.CURRENT,
  otherUserId: DEMO_USER_IDS.OTHER,
  
  // Demo data
  currentUserData: {
    score: 475,
    tasks: [],
    rewards: [],
    activities: []
  },
  otherUserData: {
    score: 320,
    tasks: [],
    rewards: [],
    activities: []
  },
  
  // Loading states
  loading: {
    tasks: false,
    rewards: false,
    activities: false,
    score: false
  },
  showTaskModal: false,
  showRewardModal: false
};

// Action types
const ActionTypes = {
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_VIEWING_USER: 'SET_VIEWING_USER',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_LOADING: 'SET_LOADING',
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
  SHOW_TASK_MODAL: 'SHOW_TASK_MODAL',
  HIDE_TASK_MODAL: 'HIDE_TASK_MODAL',
  SHOW_REWARD_MODAL: 'SHOW_REWARD_MODAL',
  HIDE_REWARD_MODAL: 'HIDE_REWARD_MODAL'
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
      
    case ActionTypes.COMPLETE_TASK:
      const completeUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [completeUserType]: {
          ...state[completeUserType],
          tasks: state[completeUserType].tasks.map(task =>
            task.id === action.payload.taskId
              ? { ...task, isAchieved: true }
              : task
          ),
          score: state[completeUserType].score + action.payload.points
        }
      };
      
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
      
    case ActionTypes.CLAIM_REWARD:
      const claimUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [claimUserType]: {
          ...state[claimUserType],
          rewards: state[claimUserType].rewards.map(reward =>
            reward.id === action.payload.rewardId
              ? { ...reward, isClaimed: true, claimedAt: new Date() }
              : reward
          ),
          score: state[claimUserType].score - action.payload.pointCost
        }
      };
      
    case ActionTypes.DELETE_ACTIVITY:
      const deleteActivityUserType = action.payload.userId === state.currentUserId ? 'currentUserData' : 'otherUserData';
      return {
        ...state,
        [deleteActivityUserType]: {
          ...state[deleteActivityUserType],
          activities: state[deleteActivityUserType].activities.filter(activity => activity.id !== action.payload.activityId)
        }
      };
      
    case ActionTypes.SHOW_TASK_MODAL:
      return { ...state, showTaskModal: true };
      
    case ActionTypes.HIDE_TASK_MODAL:
      return { ...state, showTaskModal: false };
      
    case ActionTypes.SHOW_REWARD_MODAL:
      return { ...state, showRewardModal: true };
      
    case ActionTypes.HIDE_REWARD_MODAL:
      return { ...state, showRewardModal: false };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const actions = {
    setActiveTab: (tab) => dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab }),
    setViewingUser: (user) => dispatch({ type: ActionTypes.SET_VIEWING_USER, payload: user }),
    toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
    setLoading: (key, value) => dispatch({ type: ActionTypes.SET_LOADING, payload: { key, value } }),
    updateUserData: (userType, data) => dispatch({ 
      type: ActionTypes.UPDATE_USER_DATA, 
      payload: { userType, data }
    }),
    
    addTask: (task, userId) => dispatch({ 
      type: ActionTypes.ADD_TASK, 
      payload: { task, userId } 
    }),
    
    updateTask: (taskId, updates, userId) => dispatch({ 
      type: ActionTypes.UPDATE_TASK, 
      payload: { taskId, updates, userId } 
    }),
    
    deleteTask: (taskId, userId) => dispatch({ 
      type: ActionTypes.DELETE_TASK, 
      payload: { taskId, userId } 
    }),
    
    completeTask: (taskId, points, userId) => dispatch({ 
      type: ActionTypes.COMPLETE_TASK, 
      payload: { taskId, points, userId } 
    }),
    
    addReward: (reward, userId) => dispatch({ 
      type: ActionTypes.ADD_REWARD, 
      payload: { reward, userId } 
    }),
    
    updateReward: (rewardId, updates, userId) => dispatch({ 
      type: ActionTypes.UPDATE_REWARD, 
      payload: { rewardId, updates, userId } 
    }),
    
    deleteReward: (rewardId, userId) => dispatch({ 
      type: ActionTypes.DELETE_REWARD, 
      payload: { rewardId, userId } 
    }),
    
    claimReward: (rewardId, pointCost, userId) => dispatch({ 
      type: ActionTypes.CLAIM_REWARD, 
      payload: { rewardId, pointCost, userId } 
    }),
    
    deleteActivity: (activityId, userId) => dispatch({ 
      type: ActionTypes.DELETE_ACTIVITY, 
      payload: { activityId, userId } 
    }),
    
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
