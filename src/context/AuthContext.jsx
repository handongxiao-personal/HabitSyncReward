import { createContext, useContext, useEffect, useState } from 'react';
import { 
  autoSignIn, 
  signOutUser, 
  subscribeToAuthState, 
  generateUserIds,
  isAuthenticated 
} from '../services/auth';
import {
  createOrUpdateUserProfile,
  getUserProfile,
  subscribeToUserProfile,
  subscribeToUserPair
} from '../services/firestore';
import { serverTimestamp } from 'firebase/firestore';

// 创建认证上下文
const AuthContext = createContext();

// 认证Provider组件
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userIds, setUserIds] = useState({ currentUserId: null, otherUserId: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [partnerId, setPartnerId] = useState(null);

  // 监听认证状态变化
  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = subscribeToAuthState((user) => {
      if (!mounted) return;
      
      setCurrentUser(user);
      
      // 生成用户ID对
      const ids = generateUserIds(user);
      setUserIds(ids);
      
      setLoading(false);
      setError(null);
    });

    // 检查是否已有登录会话
    const checkInitialAuth = async () => {
      if (!mounted) return;
      
      const { getCurrentUser } = await import('../services/auth');
      const user = getCurrentUser();
      
      if (user) {
        // 有登录会话，使用它
        setCurrentUser(user);
        const ids = generateUserIds(user);
        setUserIds(ids);
      }
      
      setLoading(false);
    };

    checkInitialAuth();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // 监听用户配置
  useEffect(() => {
    if (!currentUser?.uid) {
      setUserProfile(null);
      return;
    }

    const unsubscribe = subscribeToUserProfile(currentUser.uid, (profile) => {
      setUserProfile(profile);
    });

    return unsubscribe;
  }, [currentUser]);

  // 监听配对关系
  useEffect(() => {
    if (!currentUser?.uid) {
      setPartnerId(null);
      return;
    }

    const unsubscribe = subscribeToUserPair(currentUser.uid, (partnerIdFromDb) => {
      setPartnerId(partnerIdFromDb);
      
      // 更新 userIds
      if (partnerIdFromDb) {
        setUserIds({
          currentUserId: currentUser.uid,
          otherUserId: partnerIdFromDb
        });
      } else {
        setUserIds({
          currentUserId: currentUser.uid,
          otherUserId: null
        });
      }
    });

    return unsubscribe;
  }, [currentUser]);

  // 登出函数
  const signOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setCurrentUser(null);
      setUserIds({ currentUserId: null, otherUserId: null });
      setUserProfile(null);
      setPartnerId(null);
    } catch (error) {
      console.error('登出失败:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 重新登录函数
  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await autoSignIn();
    } catch (error) {
      console.error('登录失败:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // 设置用户名
  const setUsername = async (username) => {
    if (!currentUser?.uid) {
      throw new Error('用户未登录');
    }
    
    console.log('开始设置用户名:', { userId: currentUser.uid, username, email: currentUser.email });
    
    try {
      await createOrUpdateUserProfile(currentUser.uid, {
        username,
        email: currentUser.email,
        createdAt: serverTimestamp()
      });
      
      console.log('用户名保存成功到Firebase');
      
      // 立即更新本地状态（实时监听器会在稍后覆盖）
      setUserProfile({
        userId: currentUser.uid,
        username,
        email: currentUser.email,
        updatedAt: new Date()
      });
      
      console.log('本地状态已更新');
    } catch (error) {
      console.error('设置用户名详细错误:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userIds,
    userProfile,
    partnerId,
    loading,
    error,
    signIn,
    signOut,
    setUsername,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
