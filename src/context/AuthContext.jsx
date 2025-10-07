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
  const [profileLoaded, setProfileLoaded] = useState(false);

  // 监听认证状态变化
  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (!mounted) return;
      
      setCurrentUser(user);
      
      // 当用户变化时，重置 profileLoaded 状态
      if (user) {
        setProfileLoaded(false);
      }
      
      // 生成用户ID对
      const ids = generateUserIds(user);
      setUserIds(ids);
      
      // 如果用户存在且有邮箱，确保 userprofile 中有 email 字段
      if (user?.email) {
        try {
          // 先获取现有的用户配置，避免覆盖 username
          const existingProfile = await getUserProfile(user.uid);
          await createOrUpdateUserProfile(user.uid, {
            email: user.email,
            updatedAt: serverTimestamp(),
            // 保留现有的 username（如果有）
            ...(existingProfile?.username && { username: existingProfile.username })
          });
        } catch (error) {
          console.error('更新用户邮箱失败:', error);
        }
      }
      
      // 不在这里设置 setLoading(false)，等待 profile 加载完成
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
      } else {
        // 没有登录会话，停止加载
        setLoading(false);
      }
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
      setProfileLoaded(true);
      return;
    }

    setProfileLoaded(false);
    let mounted = true;
    
    // 先立即获取一次用户配置
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile(currentUser.uid);
        if (mounted) {
          setUserProfile(profile);
          setProfileLoaded(true);
        }
      } catch (error) {
        console.error('加载用户配置失败:', error);
        if (mounted) {
          setProfileLoaded(true);
        }
      }
    };
    
    loadProfile();
    
    // 然后设置实时监听器以获取后续更新（不影响 profileLoaded）
    const unsubscribe = subscribeToUserProfile(currentUser.uid, (profile) => {
      if (mounted) {
        setUserProfile(profile);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
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

  // 控制loading状态：只有当用户已认证且profile已加载时才停止loading
  useEffect(() => {
    if (currentUser && profileLoaded) {
      setLoading(false);
    } else if (currentUser && !profileLoaded) {
      // 如果有用户但配置未加载，确保 loading 为 true
      setLoading(true);
    }
  }, [currentUser, profileLoaded, loading]);

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
    
    try {
      await createOrUpdateUserProfile(currentUser.uid, {
        username,
        email: currentUser.email,
        createdAt: serverTimestamp()
      });
      
      // 立即更新本地状态（实时监听器会在稍后覆盖）
      setUserProfile({
        userId: currentUser.uid,
        username,
        email: currentUser.email,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('设置用户名失败:', error);
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
