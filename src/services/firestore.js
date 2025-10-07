import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  setDoc
} from 'firebase/firestore';
import { db, APP_ID } from './firebase';

// 集合路径常量
// 使用简化的集合路径，不带 artifacts 前缀，更符合 Firebase 最佳实践
const COLLECTIONS = {
  PROJECTS: 'projects',
  WISHLISTS: 'wishlists',
  ACTIVITY_LOGS: 'activitylogs',
  USER_SCORES: 'userscores',
  USER_PROFILES: 'userprofiles',
  PAIR_INVITATIONS: 'pairinvitations',
  USER_PAIRS: 'userpairs'
};

// ============= 任务管理 =============

/**
 * 获取用户的所有任务
 */
export const getUserTasks = async (userId) => {
  try {
    // 先按userId过滤，然后在客户端排序（避免复合索引）
    const q = query(
      collection(db, COLLECTIONS.PROJECTS),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 在客户端按创建时间排序
    return tasks.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return bTime - aTime; // 降序排列
    });
  } catch (error) {
    console.error('获取任务失败:', error);
    throw error;
  }
};

/**
 * 监听用户任务变化
 */
export const subscribeToUserTasks = (userId, callback) => {
  // 移除orderBy避免复合索引，在客户端排序
  console.log('设置任务监听器，用户ID:', userId, '集合路径:', COLLECTIONS.PROJECTS);
  const q = query(
    collection(db, COLLECTIONS.PROJECTS),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    console.log('任务监听器触发，用户ID:', userId, '文档数量:', snapshot.docs.length);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('获取到的任务:', tasks);
    
    // 在客户端按创建时间排序
    const sortedTasks = tasks.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return bTime - aTime; // 降序排列
    });
    
    callback(sortedTasks);
  }, (error) => {
    console.error('任务监听失败:', error);
  });
};

/**
 * 创建新任务
 */
export const createTask = async (userId, taskData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
      ...taskData,
      userId,
      isAchieved: false,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('创建任务失败:', error);
    throw error;
  }
};

/**
 * 更新任务
 */
export const updateTask = async (taskId, updates) => {
  try {
    const taskRef = doc(db, COLLECTIONS.PROJECTS, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('更新任务失败:', error);
    throw error;
  }
};

/**
 * 删除任务
 */
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PROJECTS, taskId));
  } catch (error) {
    console.error('删除任务失败:', error);
    throw error;
  }
};

/**
 * 完成任务
 */
export const completeTask = async (userId, taskId) => {
  try {
    const taskRef = doc(db, COLLECTIONS.PROJECTS, taskId);
    const userScoreRef = doc(db, COLLECTIONS.USER_SCORES, userId);
    
    // 使用事务确保数据一致性
    const result = await runTransaction(db, async (transaction) => {
      // 首先执行所有读操作
      const taskDoc = await transaction.get(taskRef);
      const userScoreDoc = await transaction.get(userScoreRef);
      
      if (!taskDoc.exists()) {
        throw new Error('任务不存在');
      }
      
      const task = taskDoc.data();
      
      // 然后执行所有写操作
      
      // 1. 如果是成就任务，标记为已完成
      if (task.type === 'achievement') {
        transaction.update(taskRef, {
          isAchieved: true,
          updatedAt: serverTimestamp()
        });
      }
      
      // 2. 记录活动日志
      const activityRef = doc(collection(db, COLLECTIONS.ACTIVITY_LOGS));
      transaction.set(activityRef, {
        userId,
        taskName: task.name,
        pointsEarned: task.pointValue,
        type: 'task_completed',
        timestamp: serverTimestamp(),
        relatedId: taskId,
        metadata: {
          taskType: task.type,
          category: task.category || 'general'
        }
      });
      
      // 3. 更新用户积分
      if (userScoreDoc.exists()) {
        const currentData = userScoreDoc.data();
        transaction.update(userScoreRef, {
          currentScore: currentData.currentScore + task.pointValue,
          totalEarned: task.pointValue > 0 ? currentData.totalEarned + task.pointValue : currentData.totalEarned,
          tasksCompleted: task.pointValue > 0 ? currentData.tasksCompleted + 1 : currentData.tasksCompleted,
          lastUpdated: serverTimestamp()
        });
      } else {
        // 初始化用户积分
        transaction.set(userScoreRef, {
          currentScore: task.pointValue,
          totalEarned: task.pointValue > 0 ? task.pointValue : 0,
          totalSpent: 0,
          tasksCompleted: task.pointValue > 0 ? 1 : 0,
          rewardsClaimed: 0,
          lastUpdated: serverTimestamp(),
          metadata: {
            joinDate: serverTimestamp()
          }
        });
      }
      
      return task;
    });
    
    return result;
  } catch (error) {
    console.error('完成任务失败:', error);
    throw error;
  }
};

// ============= 奖励管理 =============

/**
 * 获取用户的所有奖励
 */
export const getUserRewards = async (userId) => {
  try {
    // 移除orderBy避免复合索引，在客户端排序
    const q = query(
      collection(db, COLLECTIONS.WISHLISTS),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const rewards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 在客户端按创建时间排序
    return rewards.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return bTime - aTime; // 降序排列
    });
  } catch (error) {
    console.error('获取奖励失败:', error);
    throw error;
  }
};

/**
 * 监听用户奖励变化
 */
export const subscribeToUserRewards = (userId, callback) => {
  // 移除orderBy避免复合索引，在客户端排序
  console.log('设置奖励监听器，用户ID:', userId, '集合路径:', COLLECTIONS.WISHLISTS);
  const q = query(
    collection(db, COLLECTIONS.WISHLISTS),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    console.log('奖励监听器触发，用户ID:', userId, '文档数量:', snapshot.docs.length);
    const rewards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('获取到的奖励:', rewards);
    
    // 在客户端按创建时间排序
    const sortedRewards = rewards.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return bTime - aTime; // 降序排列
    });
    
    callback(sortedRewards);
  }, (error) => {
    console.error('奖励监听失败:', error);
  });
};

/**
 * 创建新奖励
 */
export const createReward = async (userId, rewardData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.WISHLISTS), {
      ...rewardData,
      userId,
      isClaimed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('创建奖励失败:', error);
    throw error;
  }
};

/**
 * 更新奖励
 */
export const updateReward = async (rewardId, updates) => {
  try {
    const rewardRef = doc(db, COLLECTIONS.WISHLISTS, rewardId);
    await updateDoc(rewardRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('更新奖励失败:', error);
    throw error;
  }
};

/**
 * 删除奖励
 */
export const deleteReward = async (rewardId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.WISHLISTS, rewardId));
  } catch (error) {
    console.error('删除奖励失败:', error);
    throw error;
  }
};

/**
 * 兑换奖励
 */
export const claimReward = async (userId, rewardId) => {
  try {
    const rewardRef = doc(db, COLLECTIONS.WISHLISTS, rewardId);
    const userScoreRef = doc(db, COLLECTIONS.USER_SCORES, userId);
    
    // 使用事务确保数据一致性
    const result = await runTransaction(db, async (transaction) => {
      // 首先执行所有读操作
      const rewardDoc = await transaction.get(rewardRef);
      const userScoreDoc = await transaction.get(userScoreRef);
      
      if (!rewardDoc.exists()) {
        throw new Error('奖励不存在');
      }
      
      if (!userScoreDoc.exists()) {
        throw new Error('用户积分记录不存在');
      }
      
      const reward = rewardDoc.data();
      const userScore = userScoreDoc.data();
      
      if (userScore.currentScore < reward.pointCost) {
        throw new Error('积分不足');
      }
      
      // 然后执行所有写操作
      
      // 1. 标记奖励为已兑换
      transaction.update(rewardRef, {
        isClaimed: true,
        claimedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 2. 记录活动日志
      const activityRef = doc(collection(db, COLLECTIONS.ACTIVITY_LOGS));
      transaction.set(activityRef, {
        userId,
        taskName: reward.name,
        pointsEarned: -reward.pointCost,
        type: 'reward_claimed',
        timestamp: serverTimestamp(),
        relatedId: rewardId,
        previousScore: userScore.currentScore,
        newScore: userScore.currentScore - reward.pointCost,
        metadata: {
          rewardCategory: reward.category || 'general'
        }
      });
      
      // 3. 更新用户积分
      transaction.update(userScoreRef, {
        currentScore: userScore.currentScore - reward.pointCost,
        totalSpent: userScore.totalSpent + reward.pointCost,
        rewardsClaimed: userScore.rewardsClaimed + 1,
        lastUpdated: serverTimestamp()
      });
      
      return reward;
    });
    
    return result;
  } catch (error) {
    console.error('兑换奖励失败:', error);
    throw error;
  }
};

// ============= 活动日志管理 =============

/**
 * 获取用户活动日志
 */
export const getUserActivities = async (userId, limit = 50) => {
  try {
    // 移除orderBy避免复合索引，在客户端排序
    const q = query(
      collection(db, COLLECTIONS.ACTIVITY_LOGS),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 在客户端按时间戳排序并限制数量
    return activities
      .sort((a, b) => {
        const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp) || new Date(0);
        const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp) || new Date(0);
        return bTime - aTime; // 降序排列
      })
      .slice(0, limit);
  } catch (error) {
    console.error('获取活动日志失败:', error);
    throw error;
  }
};

/**
 * 监听用户活动日志变化
 */
export const subscribeToUserActivities = (userId, callback, limit = 50) => {
  // 移除orderBy避免复合索引，在客户端排序
  const q = query(
    collection(db, COLLECTIONS.ACTIVITY_LOGS),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 在客户端按时间戳排序并限制数量
    const sortedActivities = activities
      .sort((a, b) => {
        const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp) || new Date(0);
        const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp) || new Date(0);
        return bTime - aTime; // 降序排列
      })
      .slice(0, limit);
    
    callback(sortedActivities);
  }, (error) => {
    console.error('活动日志监听失败:', error);
  });
};

/**
 * 删除活动记录（撤销操作）
 */
export const deleteActivity = async (userId, activityId) => {
  try {
    const activityRef = doc(db, COLLECTIONS.ACTIVITY_LOGS, activityId);
    const userScoreRef = doc(db, COLLECTIONS.USER_SCORES, userId);
    
    // 使用事务确保数据一致性
    const result = await runTransaction(db, async (transaction) => {
      // 首先执行所有读操作
      const activityDoc = await transaction.get(activityRef);
      const userScoreDoc = await transaction.get(userScoreRef);
      
      if (!activityDoc.exists()) {
        throw new Error('活动记录不存在');
      }
      
      const activity = activityDoc.data();
      
      // 如果是奖励兑换记录，还需要读取奖励文档
      let rewardDoc = null;
      if (activity.type === 'reward_claimed' && activity.relatedId) {
        const rewardRef = doc(db, COLLECTIONS.WISHLISTS, activity.relatedId);
        rewardDoc = await transaction.get(rewardRef);
      }
      
      // 如果是任务完成记录，还需要读取任务文档
      let taskDoc = null;
      if (activity.type === 'task_completed' && activity.relatedId) {
        const taskRef = doc(db, COLLECTIONS.PROJECTS, activity.relatedId);
        taskDoc = await transaction.get(taskRef);
      }
      
      // 然后执行所有写操作
      
      // 1. 删除活动记录
      transaction.delete(activityRef);
      
      // 2. 如果是奖励兑换记录，恢复奖励为未兑换状态
      if (activity.type === 'reward_claimed' && activity.relatedId && rewardDoc?.exists()) {
        const rewardRef = doc(db, COLLECTIONS.WISHLISTS, activity.relatedId);
        transaction.update(rewardRef, {
          isClaimed: false,
          claimedAt: null,
          updatedAt: serverTimestamp()
        });
      }
      
      // 3. 如果是成就任务完成记录，恢复任务为未完成状态
      if (activity.type === 'task_completed' && activity.relatedId && taskDoc?.exists()) {
        const task = taskDoc.data();
        if (task.type === 'achievement') {
          const taskRef = doc(db, COLLECTIONS.PROJECTS, activity.relatedId);
          transaction.update(taskRef, {
            isAchieved: false,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      // 4. 回滚用户积分
      if (userScoreDoc.exists()) {
        const currentData = userScoreDoc.data();
        
        // 计算新的积分和统计数据
        const newScore = currentData.currentScore - activity.pointsEarned;
        const updates = {
          currentScore: newScore,
          lastUpdated: serverTimestamp()
        };
        
        // 如果是奖励兑换，还需要更新相关统计
        if (activity.type === 'reward_claimed') {
          const pointCost = Math.abs(activity.pointsEarned); // pointsEarned 是负数
          updates.totalSpent = Math.max(0, (currentData.totalSpent || 0) - pointCost);
          updates.rewardsClaimed = Math.max(0, (currentData.rewardsClaimed || 0) - 1);
        }
        
        transaction.update(userScoreRef, updates);
      }
      
      return activity;
    });
    
    return result;
  } catch (error) {
    console.error('删除活动记录失败:', error);
    throw error;
  }
};

// ============= 用户积分管理 =============

/**
 * 获取用户积分
 */
export const getUserScore = async (userId) => {
  try {
    const userScoreRef = doc(db, COLLECTIONS.USER_SCORES, userId);
    const userScoreDoc = await getDoc(userScoreRef);
    
    if (userScoreDoc.exists()) {
      return {
        id: userScoreDoc.id,
        ...userScoreDoc.data()
      };
    } else {
      // 初始化用户积分
      const initialScore = {
        currentScore: 0,
        totalEarned: 0,
        totalSpent: 0,
        tasksCompleted: 0,
        rewardsClaimed: 0,
        lastUpdated: serverTimestamp(),
        metadata: {
          joinDate: serverTimestamp()
        }
      };
      
      await setDoc(userScoreRef, initialScore);
      return {
        id: userId,
        ...initialScore
      };
    }
  } catch (error) {
    console.error('获取用户积分失败:', error);
    throw error;
  }
};

/**
 * 监听用户积分变化
 */
export const subscribeToUserScore = (userId, callback) => {
  const userScoreRef = doc(db, COLLECTIONS.USER_SCORES, userId);
  
  return onSnapshot(userScoreRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    } else {
      // 如果不存在，初始化用户积分
      getUserScore(userId).then(callback);
    }
  }, (error) => {
    console.error('用户积分监听失败:', error);
  });
};

/**
 * 手动更新用户积分（仅在特殊情况下使用）
 */
export const updateUserScore = async (userId, pointsChange) => {
  try {
    const userScoreRef = doc(db, COLLECTIONS.USER_SCORES, userId);
    const userScoreDoc = await getDoc(userScoreRef);
    
    if (userScoreDoc.exists()) {
      const currentData = userScoreDoc.data();
      await updateDoc(userScoreRef, {
        currentScore: currentData.currentScore + pointsChange,
        lastUpdated: serverTimestamp()
      });
    } else {
      // 初始化用户积分
      await setDoc(userScoreRef, {
        currentScore: Math.max(0, pointsChange),
        totalEarned: pointsChange > 0 ? pointsChange : 0,
        totalSpent: 0,
        tasksCompleted: 0,
        rewardsClaimed: 0,
        lastUpdated: serverTimestamp(),
        metadata: {
          joinDate: serverTimestamp()
        }
      });
    }
  } catch (error) {
    console.error('更新用户积分失败:', error);
    throw error;
  }
};

// ============= 批量操作 =============

/**
 * 获取用户的所有数据
 */
export const getUserAllData = async (userId) => {
  try {
    const [tasks, rewards, activities, userScore] = await Promise.all([
      getUserTasks(userId),
      getUserRewards(userId),
      getUserActivities(userId),
      getUserScore(userId)
    ]);
    
    return {
      tasks,
      rewards,
      activities,
      score: userScore.currentScore,
      userScore
    };
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
};

/**
 * 监听用户所有数据变化
 */
export const subscribeToUserAllData = (userId, callbacks) => {
  const unsubscribers = [];
  
  if (callbacks.onTasksChange) {
    unsubscribers.push(subscribeToUserTasks(userId, callbacks.onTasksChange));
  }
  
  if (callbacks.onRewardsChange) {
    unsubscribers.push(subscribeToUserRewards(userId, callbacks.onRewardsChange));
  }
  
  if (callbacks.onActivitiesChange) {
    unsubscribers.push(subscribeToUserActivities(userId, callbacks.onActivitiesChange));
  }
  
  if (callbacks.onScoreChange) {
    unsubscribers.push(subscribeToUserScore(userId, callbacks.onScoreChange));
  }
  
  // 返回取消订阅函数
  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe());
  };
};

// ============= 用户配置管理 =============

/**
 * 创建或更新用户配置
 */
export const createOrUpdateUserProfile = async (userId, profileData) => {
  try {
    const profileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    await setDoc(profileRef, {
      ...profileData,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('创建/更新用户配置失败:', error);
    throw error;
  }
};

/**
 * 获取用户配置
 */
export const getUserProfile = async (userId) => {
  try {
    const profileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
    const profileDoc = await getDoc(profileRef);
    
    if (profileDoc.exists()) {
      return {
        id: profileDoc.id,
        ...profileDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('获取用户配置失败:', error);
    throw error;
  }
};

/**
 * 通过邮箱查询用户是否存在
 */
export const checkUserExistsByEmail = async (email) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.USER_PROFILES),
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('检查邮箱失败:', error);
    // If there's an error, return false to be safe
    return false;
  }
};

/**
 * 监听用户配置变化
 */
export const subscribeToUserProfile = (userId, callback) => {
  const profileRef = doc(db, COLLECTIONS.USER_PROFILES, userId);
  
  return onSnapshot(profileRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('用户配置监听失败:', error);
  });
};

// ============= 用户配对管理 =============

/**
 * 发送配对邀请
 */
export const sendPairInvitation = async (fromUserId, toEmail, fromUserName) => {
  try {
    const invitationRef = await addDoc(collection(db, COLLECTIONS.PAIR_INVITATIONS), {
      fromUserId,
      toEmail: toEmail.toLowerCase(),
      fromUserName,
      status: 'pending', // pending, accepted, rejected
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return invitationRef.id;
  } catch (error) {
    console.error('发送配对邀请失败:', error);
    throw error;
  }
};

/**
 * 获取用户收到的配对邀请
 */
export const getUserInvitations = async (userEmail) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PAIR_INVITATIONS),
      where('toEmail', '==', userEmail.toLowerCase()),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('获取配对邀请失败:', error);
    throw error;
  }
};

/**
 * 监听用户收到的配对邀请
 */
export const subscribeToUserInvitations = (userEmail, callback) => {
  const q = query(
    collection(db, COLLECTIONS.PAIR_INVITATIONS),
    where('toEmail', '==', userEmail.toLowerCase()),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(q, (snapshot) => {
    const invitations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(invitations);
  }, (error) => {
    console.error('邀请监听失败:', error);
  });
};

/**
 * 接受配对邀请
 */
export const acceptPairInvitation = async (invitationId, currentUserId, partnerUserId) => {
  try {
    await runTransaction(db, async (transaction) => {
      const invitationRef = doc(db, COLLECTIONS.PAIR_INVITATIONS, invitationId);
      const invitationDoc = await transaction.get(invitationRef);
      
      if (!invitationDoc.exists()) {
        throw new Error('邀请不存在');
      }
      
      // 更新邀请状态
      transaction.update(invitationRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 创建双向配对关系
      const pair1Ref = doc(db, COLLECTIONS.USER_PAIRS, currentUserId);
      transaction.set(pair1Ref, {
        userId: currentUserId,
        partnerId: partnerUserId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const pair2Ref = doc(db, COLLECTIONS.USER_PAIRS, partnerUserId);
      transaction.set(pair2Ref, {
        userId: partnerUserId,
        partnerId: currentUserId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
  } catch (error) {
    console.error('接受配对邀请失败:', error);
    throw error;
  }
};

/**
 * 拒绝配对邀请
 */
export const rejectPairInvitation = async (invitationId) => {
  try {
    const invitationRef = doc(db, COLLECTIONS.PAIR_INVITATIONS, invitationId);
    await updateDoc(invitationRef, {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('拒绝配对邀请失败:', error);
    throw error;
  }
};

/**
 * 获取用户的配对伙伴ID
 */
export const getUserPartner = async (userId) => {
  try {
    const pairRef = doc(db, COLLECTIONS.USER_PAIRS, userId);
    const pairDoc = await getDoc(pairRef);
    
    if (pairDoc.exists()) {
      return pairDoc.data().partnerId;
    }
    return null;
  } catch (error) {
    console.error('获取配对伙伴失败:', error);
    throw error;
  }
};

/**
 * 监听用户配对关系变化
 */
export const subscribeToUserPair = (userId, callback) => {
  const pairRef = doc(db, COLLECTIONS.USER_PAIRS, userId);
  
  return onSnapshot(pairRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().partnerId);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('配对关系监听失败:', error);
  });
};

/**
 * 取消配对关系
 */
export const unpairUsers = async (userId, partnerId) => {
  try {
    await runTransaction(db, async (transaction) => {
      const pair1Ref = doc(db, COLLECTIONS.USER_PAIRS, userId);
      const pair2Ref = doc(db, COLLECTIONS.USER_PAIRS, partnerId);
      
      transaction.delete(pair1Ref);
      transaction.delete(pair2Ref);
    });
  } catch (error) {
    console.error('取消配对失败:', error);
    throw error;
  }
};
