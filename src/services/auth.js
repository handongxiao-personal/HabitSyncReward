import { 
  signInAnonymously, 
  signInWithCustomToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, INITIAL_AUTH_TOKEN } from './firebase';

/**
 * 匿名登录
 */
export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('匿名登录失败:', error);
    throw error;
  }
};

/**
 * 使用自定义Token登录
 */
export const signInWithToken = async (token) => {
  try {
    const result = await signInWithCustomToken(auth, token);
    return result.user;
  } catch (error) {
    console.error('Token登录失败:', error);
    throw error;
  }
};

/**
 * 自动登录 - 优先使用Token，否则匿名登录
 */
export const autoSignIn = async () => {
  try {
    if (INITIAL_AUTH_TOKEN) {
      return await signInWithToken(INITIAL_AUTH_TOKEN);
    } else {
      return await signInAnonymous();
    }
  } catch (error) {
    console.error('自动登录失败:', error);
    // 如果Token登录失败，尝试匿名登录
    return await signInAnonymous();
  }
};

/**
 * 登出
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

/**
 * 监听认证状态变化
 */
export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * 获取当前用户
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * 生成双用户ID - 基于当前用户ID
 */
export const generateUserIds = (currentUser) => {
  if (!currentUser) {
    // 如果没有用户，返回默认的demo用户ID
    return {
      currentUserId: 'user-demo-1',
      otherUserId: 'user-demo-2'
    };
  }
  
  // 基于真实用户ID生成配对用户ID
  const baseId = currentUser.uid;
  return {
    currentUserId: baseId,
    otherUserId: `${baseId}-partner` // 简单的配对逻辑
  };
};

/**
 * 检查用户是否已认证
 */
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

/**
 * 使用邮箱和密码登录
 */
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('邮箱登录失败:', error);
    console.error('详细错误信息:', JSON.stringify(error, null, 2));
    
    // Re-throw with more context if needed
    throw error;
  }
};

/**
 * 使用邮箱和密码注册新用户
 */
export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('邮箱注册失败:', error);
    throw error;
  }
};

/**
 * 检查邮箱是否已注册
 */
export const checkEmailExists = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    // If methods array has items, email is registered
    return methods.length > 0;
  } catch (error) {
    console.error('检查邮箱失败:', error);
    // If there's an error, assume email doesn't exist
    return false;
  }
};

/**
 * 发送密码重置邮件
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin, // 重置后返回到应用首页
      handleCodeInApp: false
    });
    console.log('密码重置邮件已发送至:', email);
  } catch (error) {
    console.error('发送密码重置邮件失败:', error);
    throw error;
  }
};
