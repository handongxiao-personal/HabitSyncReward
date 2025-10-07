# Firestore 数据模型详细设计

## 数据库架构概览

### 集合结构
```
/artifacts/{appId}/public/data/
├── projects/          # 任务/习惯集合
├── wishlists/         # 愿望清单集合
├── activitylogs/      # 活动日志集合
└── userscores/        # 用户积分集合
```

## 详细数据模型

### 1. Projects Collection

**路径**: `/artifacts/{appId}/public/data/projects`

**用途**: 存储用户创建的所有任务/习惯

**文档结构**:
```typescript
interface Project {
  // 基础信息
  id: string;                    // 文档ID (自动生成)
  userId: string;               // 创建者用户ID
  
  // 任务内容
  name: string;                 // 任务名称 (必填)
  description?: string;         // 任务描述 (可选)
  
  // 任务类型和积分
  type: 'daily' | 'achievement' | 'bad_habit';  // 任务类型
  pointValue: number;           // 积分值 (可正可负)
  
  // 状态管理
  isAchieved: boolean;          // 是否已完成 (仅对achievement有效)
  isActive: boolean;            // 是否激活状态
  
  // 时间戳
  createdAt: Timestamp;         // 创建时间
  updatedAt: Timestamp;         // 最后更新时间
  
  // 元数据
  category?: string;            // 分类标签 (如: 'health', 'work', 'personal')
  priority?: 'low' | 'medium' | 'high';  // 优先级
  tags?: string[];              // 标签数组
}
```

**示例数据**:
```json
{
  "id": "project_001",
  "userId": "user_12345",
  "name": "晨跑30分钟",
  "description": "每天早上6点开始晨跑",
  "type": "daily",
  "pointValue": 50,
  "isAchieved": false,
  "isActive": true,
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-01-15T08:00:00Z",
  "category": "health",
  "priority": "high",
  "tags": ["exercise", "morning"]
}
```

**负分任务示例**:
```json
{
  "id": "project_002",
  "userId": "user_12345",
  "name": "熬夜到凌晨2点",
  "description": "不良习惯，需要避免",
  "type": "bad_habit",
  "pointValue": -30,
  "isAchieved": false,
  "isActive": true,
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-01-15T08:00:00Z",
  "category": "health",
  "priority": "high",
  "tags": ["sleep", "bad-habit"]
}
```

### 2. WishLists Collection

**路径**: `/artifacts/{appId}/public/data/wishlists`

**用途**: 存储用户的愿望清单和奖励

**文档结构**:
```typescript
interface WishListItem {
  // 基础信息
  id: string;                   // 文档ID (自动生成)
  userId: string;              // 创建者用户ID
  
  // 奖励内容
  name: string;                // 奖励名称 (必填)
  description?: string;        // 奖励描述 (可选)
  
  // 积分要求
  pointCost: number;           // 所需积分 (必须为正数)
  
  // 状态管理
  isClaimed: boolean;          // 是否已兑换
  claimedAt?: Timestamp;       // 兑换时间
  
  // 时间戳
  createdAt: Timestamp;        // 创建时间
  updatedAt: Timestamp;        // 最后更新时间
  
  // 元数据
  category?: string;           // 分类标签
  priority?: 'low' | 'medium' | 'high';  // 优先级
  imageUrl?: string;           // 奖励图片URL
  tags?: string[];             // 标签数组
}
```

**示例数据**:
```json
{
  "id": "wish_001",
  "userId": "user_12345",
  "name": "新游戏手柄",
  "description": "PlayStation 5 DualSense 手柄",
  "pointCost": 2000,
  "isClaimed": false,
  "createdAt": "2024-01-15T08:00:00Z",
  "updatedAt": "2024-01-15T08:00:00Z",
  "category": "entertainment",
  "priority": "medium",
  "imageUrl": "https://example.com/controller.jpg",
  "tags": ["gaming", "hardware"]
}
```

### 3. ActivityLog Collection

**路径**: `/artifacts/{appId}/public/data/activitylogs`

**用途**: 记录所有用户操作历史

**文档结构**:
```typescript
interface ActivityLog {
  // 基础信息
  id: string;                  // 文档ID (自动生成)
  userId: string;             // 操作用户ID
  
  // 操作内容
  taskName: string;           // 任务/奖励名称
  pointsEarned: number;       // 获得的积分 (可正可负)
  
  // 操作类型
  type: 'task_completed' | 'reward_claimed' | 'task_created' | 'reward_created';
  
  // 时间戳
  timestamp: Timestamp;       // 操作时间
  
  // 关联数据
  relatedId?: string;         // 关联的项目ID或奖励ID
  previousScore?: number;     // 操作前积分
  newScore?: number;          // 操作后积分
  
  // 元数据
  metadata?: {                // 额外信息
    taskType?: string;        // 任务类型
    rewardCategory?: string;  // 奖励分类
    [key: string]: any;       // 其他扩展字段
  };
}
```

**示例数据**:
```json
{
  "id": "log_001",
  "userId": "user_12345",
  "taskName": "晨跑30分钟",
  "pointsEarned": 50,
  "type": "task_completed",
  "timestamp": "2024-01-15T06:30:00Z",
  "relatedId": "project_001",
  "previousScore": 1200,
  "newScore": 1250,
  "metadata": {
    "taskType": "daily",
    "category": "health"
  }
}
```

### 4. UserScores Collection

**路径**: `/artifacts/{appId}/public/data/userscores`

**用途**: 维护每个用户的当前积分

**文档结构**:
```typescript
interface UserScore {
  // 用户标识
  id: string;                 // 用户ID作为文档ID
  
  // 积分信息
  currentScore: number;       // 当前总积分
  totalEarned: number;        // 历史总获得积分
  totalSpent: number;         // 历史总消费积分
  
  // 统计信息
  tasksCompleted: number;     // 完成任务数
  rewardsClaimed: number;     // 兑换奖励数
  streakDays: number;         // 连续天数
  
  // 时间戳
  lastUpdated: Timestamp;     // 最后更新时间
  lastActivityDate?: string;  // 最后活动日期 (YYYY-MM-DD)
  
  // 等级系统
  level?: number;             // 当前等级
  experience?: number;        // 经验值
  
  // 成就系统
  achievements?: string[];    // 已获得成就ID列表
  
  // 元数据
  metadata?: {
    joinDate: Timestamp;      // 加入日期
    timezone?: string;        // 时区
    preferences?: {           // 用户偏好
      notifications: boolean;
      theme: string;
      language: string;
    };
  };
}
```

**示例数据**:
```json
{
  "id": "user_12345",
  "currentScore": 1250,
  "totalEarned": 3500,
  "totalSpent": 2250,
  "tasksCompleted": 45,
  "rewardsClaimed": 3,
  "streakDays": 7,
  "lastUpdated": "2024-01-15T06:30:00Z",
  "lastActivityDate": "2024-01-15",
  "level": 3,
  "experience": 750,
  "achievements": ["first_task", "week_streak", "high_scorer"],
  "metadata": {
    "joinDate": "2024-01-01T00:00:00Z",
    "timezone": "Asia/Shanghai",
    "preferences": {
      "notifications": true,
      "theme": "light",
      "language": "zh-CN"
    }
  }
}
```

## Firestore 安全规则

### 安全规则配置
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 项目集合规则
    match /artifacts/{appId}/public/data/projects/{projectId} {
      allow read: if true; // 公开读取
      allow write: if request.auth != null 
        && request.auth.uid == resource.data.userId; // 只能编辑自己的项目
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // 愿望清单规则
    match /artifacts/{appId}/public/data/wishlists/{wishId} {
      allow read: if true; // 公开读取
      allow write: if request.auth != null 
        && request.auth.uid == resource.data.userId; // 只能编辑自己的愿望
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // 活动日志规则
    match /artifacts/{appId}/public/data/activitylogs/{logId} {
      allow read: if true; // 公开读取
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId; // 只能创建自己的日志
      allow update, delete: if false; // 不允许修改或删除日志
    }
    
    // 用户积分规则
    match /artifacts/{appId}/public/data/userscores/{userId} {
      allow read: if true; // 公开读取
      allow write: if request.auth != null 
        && request.auth.uid == userId; // 只能编辑自己的积分
    }
  }
}
```

## 数据库索引配置

### 复合索引
```javascript
// projects 集合索引
{
  "collectionGroup": "projects",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "type", "order": "ASCENDING" },
    { "fieldPath": "isActive", "order": "ASCENDING" }
  ]
}

// activitylogs 集合索引
{
  "collectionGroup": "activitylogs",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "timestamp", "order": "DESCENDING" }
  ]
}

// wishlists 集合索引
{
  "collectionGroup": "wishlists",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "isClaimed", "order": "ASCENDING" },
    { "fieldPath": "pointCost", "order": "ASCENDING" }
  ]
}
```

## 数据操作示例

### 1. 创建任务
```javascript
const createTask = async (taskData) => {
  const docRef = await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'projects'), {
    ...taskData,
    userId: currentUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isAchieved: false,
    isActive: true
  });
  
  return docRef.id;
};
```

### 2. 完成任务
```javascript
const completeTask = async (taskId) => {
  const taskRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'projects', taskId);
  const taskDoc = await getDoc(taskRef);
  const task = taskDoc.data();
  
  // 更新任务状态
  if (task.type === 'achievement') {
    await updateDoc(taskRef, {
      isAchieved: true,
      updatedAt: serverTimestamp()
    });
  }
  
  // 记录活动日志
  await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'activitylogs'), {
    userId: currentUser.uid,
    taskName: task.name,
    pointsEarned: task.pointValue,
    type: 'task_completed',
    timestamp: serverTimestamp(),
    relatedId: taskId,
    metadata: {
      taskType: task.type,
      category: task.category
    }
  });
  
  // 更新用户积分
  await updateUserScore(currentUser.uid, task.pointValue);
};
```

### 3. 兑换奖励
```javascript
const claimReward = async (rewardId) => {
  const rewardRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'wishlists', rewardId);
  const rewardDoc = await getDoc(rewardRef);
  const reward = rewardDoc.data();
  
  const userScoreRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'userscores', currentUser.uid);
  const userScoreDoc = await getDoc(userScoreRef);
  const userScore = userScoreDoc.data();
  
  if (userScore.currentScore >= reward.pointCost) {
    // 使用事务确保数据一致性
    await runTransaction(db, async (transaction) => {
      // 标记奖励为已兑换
      transaction.update(rewardRef, {
        isClaimed: true,
        claimedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 更新用户积分
      transaction.update(userScoreRef, {
        currentScore: userScore.currentScore - reward.pointCost,
        totalSpent: userScore.totalSpent + reward.pointCost,
        rewardsClaimed: userScore.rewardsClaimed + 1,
        lastUpdated: serverTimestamp()
      });
    });
    
    // 记录活动日志
    await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'activitylogs'), {
      userId: currentUser.uid,
      taskName: reward.name,
      pointsEarned: -reward.pointCost,
      type: 'reward_claimed',
      timestamp: serverTimestamp(),
      relatedId: rewardId,
      previousScore: userScore.currentScore,
      newScore: userScore.currentScore - reward.pointCost,
      metadata: {
        rewardCategory: reward.category
      }
    });
  }
};
```

## 数据迁移和备份

### 数据导出脚本
```javascript
const exportUserData = async (userId) => {
  const userData = {
    projects: [],
    wishlists: [],
    activitylogs: [],
    userscore: null
  };
  
  // 导出用户项目
  const projectsSnapshot = await getDocs(
    query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'projects'),
          where('userId', '==', userId))
  );
  projectsSnapshot.forEach(doc => {
    userData.projects.push({ id: doc.id, ...doc.data() });
  });
  
  // 导出愿望清单
  const wishlistsSnapshot = await getDocs(
    query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'wishlists'),
          where('userId', '==', userId))
  );
  wishlistsSnapshot.forEach(doc => {
    userData.wishlists.push({ id: doc.id, ...doc.data() });
  });
  
  // 导出活动日志
  const activitylogsSnapshot = await getDocs(
    query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'activitylogs'),
          where('userId', '==', userId))
  );
  activitylogsSnapshot.forEach(doc => {
    userData.activitylogs.push({ id: doc.id, ...doc.data() });
  });
  
  // 导出用户积分
  const userScoreDoc = await getDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'userscores', userId));
  if (userScoreDoc.exists()) {
    userData.userscore = { id: userScoreDoc.id, ...userScoreDoc.data() };
  }
  
  return userData;
};
```

## 性能优化建议

### 1. 查询优化
- 使用适当的索引
- 限制查询结果数量
- 使用分页加载大量数据
- 避免深层嵌套查询

### 2. 实时监听优化
- 只监听必要的数据变化
- 及时取消不需要的监听器
- 使用防抖处理频繁更新

### 3. 数据缓存
- 在客户端缓存常用数据
- 实现离线数据同步
- 使用本地存储减少网络请求

这个数据模型设计确保了数据的完整性、一致性和可扩展性，同时支持实时同步和高效查询。
