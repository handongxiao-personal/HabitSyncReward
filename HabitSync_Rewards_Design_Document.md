# HabitSync Rewards: 设计文档

## 项目概述

HabitSync Rewards 是一个双用户协作的习惯追踪和奖励系统，通过游戏化机制激励用户建立良好习惯，同时惩罚不良习惯。应用支持实时数据同步、透明化双用户界面，以及完整的CRUD操作。

## 核心功能特性

### 1. 双用户系统
- **用户识别**: 显示完整的用户ID便于协作识别
- **切换视图**: 可在当前用户和对方用户数据间切换
- **透明化**: 双方可查看对方的分数和活动记录

### 2. 习惯管理系统
- **任务类型**:
  - `daily`: 日常习惯 (正分)
  - `achievement`: 成就任务 (正分，一次性)
  - `bad_habit`: 不良习惯 (负分)
- **积分系统**: 支持正负积分，即时生效
- **防重复**: 成就任务完成一次后自动禁用

### 3. 奖励兑换系统
- **愿望清单**: 用户自定义奖励和所需积分
- **进度显示**: 可视化进度条显示当前积分进度
- **兑换机制**: 积分足够时可直接兑换

### 4. 实时同步
- **Firestore**: 使用实时监听器确保多设备同步
- **活动日志**: 完整记录所有操作历史

## 技术架构

### 前端技术栈
- **框架**: React 18+ (单文件应用)
- **样式**: Tailwind CSS
- **状态管理**: React Hooks (useState, useEffect, useContext)
- **响应式**: Mobile-first 设计

### 后端服务
- **数据库**: Google Firestore
- **认证**: Firebase Authentication
- **实时同步**: Firestore onSnapshot

## 数据模型设计

### Firestore 集合结构

#### 1. Projects Collection
```
/artifacts/{appId}/public/data/projects
```

**文档结构**:
```typescript
interface Project {
  id: string;           // 自动生成
  userId: string;       // 用户ID
  name: string;         // 任务名称
  type: 'daily' | 'achievement' | 'bad_habit';
  pointValue: number;   // 积分值 (可正可负)
  isAchieved: boolean;  // 是否已完成 (仅对achievement类型有效)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 2. WishLists Collection
```
/artifacts/{appId}/public/data/wishlists
```

**文档结构**:
```typescript
interface WishListItem {
  id: string;           // 自动生成
  userId: string;       // 用户ID
  name: string;         // 奖励名称
  pointCost: number;    // 所需积分
  isClaimed: boolean;   // 是否已兑换
  claimedAt?: Timestamp; // 兑换时间
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 3. ActivityLog Collection
```
/artifacts/{appId}/public/data/activitylogs
```

**文档结构**:
```typescript
interface ActivityLog {
  id: string;           // 自动生成
  userId: string;       // 用户ID
  taskName: string;     // 任务名称
  pointsEarned: number; // 获得的积分 (可正可负)
  timestamp: Timestamp; // 操作时间
  type: 'task_completed' | 'reward_claimed';
}
```

#### 4. UserScores Collection
```
/artifacts/{appId}/public/data/userscores
```

**文档结构**:
```typescript
interface UserScore {
  id: string;           // 用户ID作为文档ID
  currentScore: number; // 当前总积分
  lastUpdated: Timestamp;
}
```

## UI/UX 设计规范

### 设计原则
1. **简洁直观**: 一目了然的功能布局
2. **即时反馈**: 操作后立即显示结果
3. **视觉层次**: 清晰的信息架构
4. **情感化设计**: 正负习惯的视觉差异化

### 色彩系统
```css
/* 正面习惯 */
--positive-primary: #10B981;    /* 绿色 */
--positive-light: #D1FAE5;      /* 浅绿 */
--positive-dark: #047857;       /* 深绿 */

/* 负面习惯 */
--negative-primary: #EF4444;    /* 红色 */
--negative-light: #FEE2E2;      /* 浅红 */
--negative-dark: #DC2626;       /* 深红 */

/* 中性色 */
--neutral-50: #F9FAFB;
--neutral-100: #F3F4F6;
--neutral-500: #6B7280;
--neutral-900: #111827;
```

### 组件设计

#### 1. 用户切换器
```jsx
<UserSwitcher 
  currentUserId={currentUserId}
  otherUserId={otherUserId}
  onSwitch={handleUserSwitch}
/>
```

#### 2. 积分显示
```jsx
<ScoreDisplay 
  score={userScore}
  userId={currentUserId}
  isPositive={userScore >= 0}
/>
```

#### 3. 任务卡片
```jsx
<TaskCard 
  task={task}
  onComplete={handleTaskComplete}
  isDisabled={task.type === 'achievement' && task.isAchieved}
  variant={task.type === 'bad_habit' ? 'negative' : 'positive'}
/>
```

#### 4. 奖励卡片
```jsx
<RewardCard 
  reward={reward}
  currentScore={userScore}
  onClaim={handleRewardClaim}
  progress={calculateProgress(userScore, reward.pointCost)}
/>
```

#### 5. 活动时间线
```jsx
<ActivityTimeline 
  activities={activities}
  currentUserId={currentUserId}
/>
```

## 应用架构

### 文件结构
```
HabitSyncRewards/
├── index.html              # 主HTML文件
├── app.js                  # React应用主文件
├── components/             # React组件
│   ├── UserSwitcher.jsx
│   ├── ScoreDisplay.jsx
│   ├── TaskManager.jsx
│   ├── RewardManager.jsx
│   ├── ActivityTimeline.jsx
│   └── TaskCard.jsx
├── hooks/                  # 自定义Hooks
│   ├── useFirestore.js
│   ├── useAuth.js
│   └── useRealtimeData.js
├── utils/                  # 工具函数
│   ├── firebase.js
│   ├── constants.js
│   └── helpers.js
└── styles/                 # 样式文件
    └── tailwind.css
```

### 状态管理架构

```javascript
// 应用状态结构
const AppState = {
  auth: {
    currentUser: null,
    otherUser: null,
    isAuthenticated: false
  },
  ui: {
    activeTab: 'tasks', // 'tasks' | 'rewards' | 'history'
    viewingUser: 'current' // 'current' | 'other'
  },
  data: {
    currentUserData: {
      tasks: [],
      rewards: [],
      score: 0,
      activities: []
    },
    otherUserData: {
      tasks: [],
      rewards: [],
      score: 0,
      activities: []
    }
  }
};
```

## 核心功能实现

### 1. 实时数据同步
```javascript
// 使用Firestore实时监听
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, `artifacts/${APP_ID}/public/data/projects`),
    (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasks);
    }
  );
  
  return () => unsubscribe();
}, []);
```

### 2. 任务完成处理
```javascript
const handleTaskComplete = async (taskId) => {
  const task = tasks.find(t => t.id === taskId);
  
  // 更新任务状态
  if (task.type === 'achievement') {
    await updateDoc(doc(db, 'projects', taskId), {
      isAchieved: true,
      updatedAt: serverTimestamp()
    });
  }
  
  // 记录活动日志
  await addDoc(collection(db, 'activitylogs'), {
    userId: currentUserId,
    taskName: task.name,
    pointsEarned: task.pointValue,
    timestamp: serverTimestamp(),
    type: 'task_completed'
  });
  
  // 更新用户积分
  await updateUserScore(currentUserId, task.pointValue);
};
```

### 3. 奖励兑换处理
```javascript
const handleRewardClaim = async (rewardId) => {
  const reward = rewards.find(r => r.id === rewardId);
  
  if (userScore >= reward.pointCost) {
    // 标记奖励为已兑换
    await updateDoc(doc(db, 'wishlists', rewardId), {
      isClaimed: true,
      claimedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // 记录活动日志
    await addDoc(collection(db, 'activitylogs'), {
      userId: currentUserId,
      taskName: reward.name,
      pointsEarned: -reward.pointCost,
      timestamp: serverTimestamp(),
      type: 'reward_claimed'
    });
    
    // 更新用户积分
    await updateUserScore(currentUserId, -reward.pointCost);
  }
};
```

## 响应式设计

### 断点设置
```css
/* Tailwind CSS 断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏 */
```

### 布局策略
- **移动端**: 单列布局，底部导航
- **平板**: 双列布局，侧边导航
- **桌面**: 三列布局，完整功能展示

## 性能优化

### 1. 数据优化
- 使用Firestore索引优化查询
- 实现分页加载活动历史
- 缓存用户数据减少网络请求

### 2. 渲染优化
- 使用React.memo优化组件渲染
- 实现虚拟滚动处理大量数据
- 懒加载非关键组件

### 3. 网络优化
- 实现离线支持
- 使用Service Worker缓存资源
- 优化Firestore查询结构

## 安全考虑

### 1. 数据安全
- 使用Firestore安全规则
- 实现用户数据隔离
- 验证所有客户端输入

### 2. 认证安全
- 使用Firebase Authentication
- 实现Token刷新机制
- 防止未授权访问

## 部署方案

### 1. 开发环境
- 使用Firebase Emulator Suite
- 本地开发服务器
- 热重载支持

### 2. 生产环境
- 部署到Firebase Hosting
- 使用CDN加速
- 启用HTTPS

## 测试策略

### 1. 单元测试
- 组件功能测试
- 工具函数测试
- 自定义Hook测试

### 2. 集成测试
- Firebase集成测试
- 用户流程测试
- 实时同步测试

### 3. 端到端测试
- 完整用户旅程测试
- 跨设备同步测试
- 性能测试

## 项目里程碑

### Phase 1: 基础架构 (Week 1)
- [ ] 项目初始化
- [ ] Firebase配置
- [ ] 基础组件开发
- [ ] 认证系统

### Phase 2: 核心功能 (Week 2)
- [ ] 任务管理功能
- [ ] 奖励系统
- [ ] 积分计算
- [ ] 实时同步

### Phase 3: 用户体验 (Week 3)
- [ ] UI/UX优化
- [ ] 响应式设计
- [ ] 性能优化
- [ ] 错误处理

### Phase 4: 测试部署 (Week 4)
- [ ] 功能测试
- [ ] 性能测试
- [ ] 部署配置
- [ ] 文档完善

## 风险评估

### 技术风险
- **Firebase限制**: 免费版有使用限制
- **实时同步**: 网络不稳定可能导致同步延迟
- **数据一致性**: 并发操作可能导致数据冲突

### 解决方案
- 实现离线模式
- 添加数据冲突解决机制
- 使用Firestore事务确保数据一致性

## 总结

HabitSync Rewards 是一个功能丰富的双用户习惯追踪应用，通过游戏化机制和实时同步技术，为用户提供直观、高效的 habit tracking 体验。设计文档涵盖了从技术架构到用户体验的各个方面，为项目开发提供了清晰的指导方向。

关键成功因素：
1. **简洁直观的UI设计**
2. **稳定的实时数据同步**
3. **良好的用户体验**
4. **可靠的数据安全**
5. **跨设备兼容性**

通过遵循这个设计文档，可以确保项目按时交付，并达到预期的质量标准。
