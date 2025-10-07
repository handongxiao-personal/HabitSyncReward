# UI 组件设计和交互流程

## 整体布局架构

基于实际设计图片的布局结构：

### 主界面布局
```
┌─────────────────────────────────────┐
│           Header                    │
│  HabitSync Rewards        🌙       │
├─────────────────────────────────────┤
│        User Switcher                │
│   [user-abc123] [user-xyz789]      │
├─────────────────────────────────────┤
│       Total Score Card              │
│   ┌─────────────────────────────┐   │
│   │ Total Score          📈     │   │
│   │      475                   │   │
│   │   user-abc123              │   │
│   └─────────────────────────────┘   │
├─────────────────────────────────────┤
│      Navigation Tabs                │
│   [Tasks] [Rewards] [Activity]      │
├─────────────────────────────────────┤
│                                     │
│        Content Area                 │
│   (Tasks/Rewards/Activity Lists)    │
│                                     │
├─────────────────────────────────────┤
│  + (Floating Action Button)         │
└─────────────────────────────────────┘
```

### 设计特点
- **简洁现代**: 白色背景为主，紫色强调色
- **卡片式设计**: 所有内容都使用圆角卡片
- **清晰层次**: 通过间距和阴影区分内容层级
- **用户友好**: 大按钮，清晰的视觉反馈

## 核心组件设计

### 1. AppHeader 组件
```jsx
const AppHeader = ({ onThemeToggle, isDarkMode }) => {
  return (
    <header className="bg-white px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          HabitSync Rewards
        </h1>
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="切换主题"
        >
          {isDarkMode ? (
            <span className="text-xl">☀️</span>
          ) : (
            <span className="text-xl">🌙</span>
          )}
        </button>
      </div>
    </header>
  );
};
```

**功能特性**:
- 简洁的标题显示
- 主题切换按钮（月亮/太阳图标）
- 无边框设计，更现代的外观

### 2. UserSwitcher 组件
```jsx
const UserSwitcher = ({ currentUserId, otherUserId, viewingUser, onSwitch }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex space-x-2">
        <button
          onClick={() => onSwitch('current')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            viewingUser === 'current'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-sm">👤</span>
          <span className="text-sm font-mono">{currentUserId}</span>
        </button>
        <button
          onClick={() => onSwitch('other')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            viewingUser === 'other'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-sm">👤</span>
          <span className="text-sm font-mono">{otherUserId}</span>
        </button>
      </div>
    </div>
  );
};
```

**功能特性**:
- 居中对齐的用户切换按钮
- 紫色主题色（选中状态）
- 用户图标和ID显示
- 清晰的选中/未选中状态

### 3. ScoreDisplay 组件
```jsx
const ScoreDisplay = ({ score, userId }) => {
  return (
    <div className="mx-6 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 左侧紫色渐变条 */}
        <div className="bg-gradient-to-b from-purple-500 to-purple-600 w-2 h-full absolute"></div>
        
        <div className="flex items-center justify-between p-6">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Total Score
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {score}
            </div>
            <div className="text-sm font-mono text-gray-500">
              {userId}
            </div>
          </div>
          
          {/* 右上角图表图标 */}
          <div className="bg-purple-100 p-3 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**功能特性**:
- 左侧紫色渐变装饰条
- 大号数字显示总分
- 用户ID显示
- 右上角趋势图表图标
- 简洁现代的卡片设计

### 4. NavigationTabs 组件
```jsx
const NavigationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'activity', label: 'Activity' }
  ];
  
  return (
    <div className="px-6 mb-6">
      <nav className="flex space-x-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
```

### 5. TaskManager 组件
```jsx
const TaskManager = ({ tasks, onTaskComplete, onTaskCreate, onTaskEdit, onTaskDelete }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const taskCategories = {
    daily: { label: '日常习惯', color: 'green', icon: '🔄' },
    achievement: { label: '成就任务', color: 'blue', icon: '🏆' },
    bad_habit: { label: '不良习惯', color: 'red', icon: '⚠️' }
  };
  
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.type]) acc[task.type] = [];
    acc[task.type].push(task);
    return acc;
  }, {});
  
  return (
    <div className="p-4">
      {/* 创建任务按钮 */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>添加新任务</span>
        </button>
      </div>
      
      {/* 任务分类显示 */}
      {Object.entries(groupedTasks).map(([type, typeTasks]) => (
        <TaskCategory 
          key={type}
          category={taskCategories[type]}
          tasks={typeTasks}
          onTaskComplete={onTaskComplete}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
        />
      ))}
      
      {/* 创建任务表单 */}
      {showCreateForm && (
        <TaskCreateForm 
          onSubmit={onTaskCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};
```

### 6. TaskCard 组件
```jsx
const TaskCard = ({ task, onComplete, onDelete }) => {
  const isDisabled = task.type === 'achievement' && task.isAchieved;
  const isNegative = task.type === 'bad_habit';
  
  const getTaskIcon = () => {
    switch (task.type) {
      case 'daily': return '📅';
      case 'achievement': return '🏆';
      case 'bad_habit': return '⚠️';
      default: return '📋';
    }
  };
  
  const getTaskTypeStyle = () => {
    switch (task.type) {
      case 'achievement': 
        return 'bg-yellow-100 text-yellow-800';
      case 'bad_habit':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const pointColor = isNegative ? 'text-red-600' : 'text-green-600';
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTaskIcon()}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTaskTypeStyle()}`}>
            {task.type}
          </span>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <h3 className="font-medium text-gray-900 mb-3">{task.name}</h3>
      
      <div className="flex items-center justify-between">
        <div className={`text-lg font-bold ${pointColor}`}>
          {task.pointValue > 0 ? '+' : ''}{task.pointValue}
        </div>
        
        <button
          onClick={() => onComplete(task.id)}
          disabled={isDisabled}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDisabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isNegative
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isDisabled ? 'Completed' : 'Complete'}
        </button>
      </div>
    </div>
  );
};
```

### 7. RewardManager 组件
```jsx
const RewardManager = ({ rewards, currentScore, onRewardClaim, onRewardCreate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const availableRewards = rewards.filter(r => !r.isClaimed);
  const claimedRewards = rewards.filter(r => r.isClaimed);
  
  return (
    <div className="p-4">
      {/* 创建奖励按钮 */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>添加新奖励</span>
        </button>
      </div>
      
      {/* 可兑换奖励 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🎁</span>
          可兑换奖励
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableRewards.map(reward => (
            <RewardCard 
              key={reward.id}
              reward={reward}
              currentScore={currentScore}
              onClaim={onRewardClaim}
            />
          ))}
        </div>
      </div>
      
      {/* 已兑换奖励 */}
      {claimedRewards.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">✅</span>
            已兑换奖励
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {claimedRewards.map(reward => (
              <RewardCard 
                key={reward.id}
                reward={reward}
                currentScore={currentScore}
                isClaimed={true}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* 创建奖励表单 */}
      {showCreateForm && (
        <RewardCreateForm 
          onSubmit={onRewardCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};
```

### 8. RewardCard 组件
```jsx
const RewardCard = ({ reward, currentScore, onClaim, onDelete, isClaimed = false }) => {
  const progress = Math.min((currentScore / reward.pointCost) * 100, 100);
  const canClaim = currentScore >= reward.pointCost && !isClaimed;
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 transition-all ${
      isClaimed ? 'opacity-75' : 'hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🎁</span>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
            {reward.pointCost} pts
          </span>
        </div>
        <button
          onClick={() => onDelete(reward.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <h3 className="font-medium text-gray-900 mb-4">{reward.name}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{progress.toFixed(0)}% to unlock</span>
          <span>{currentScore} / {reward.pointCost}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <button
        onClick={() => onClaim(reward.id)}
        disabled={!canClaim}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          canClaim
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isClaimed ? 'Claimed' : canClaim ? 'Claim Now' : 'Not Enough Points'}
      </button>
    </div>
  );
};
```

### 9. ActivityTimeline 组件
```jsx
const ActivityTimeline = ({ activities, currentUserId }) => {
  return (
    <div className="px-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🕒</span>
          Activity History
        </h2>
        
        <div className="space-y-4">
          {activities.map(activity => (
            <ActivityItem 
              key={activity.id}
              activity={activity}
              isCurrentUser={activity.userId === currentUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 10. ActivityItem 组件
```jsx
const ActivityItem = ({ activity, isCurrentUser }) => {
  const isPositive = activity.pointsEarned > 0;
  const isTask = activity.type === 'task_completed';
  
  const getActivityColor = () => {
    if (isTask) {
      return isPositive ? 'bg-purple-100' : 'bg-red-100';
    }
    return 'bg-blue-100';
  };
  
  const getActivityIcon = () => {
    if (isTask) {
      return isPositive ? '✅' : '⚠️';
    }
    return '🎁';
  };
  
  return (
    <div className="flex items-center space-x-4">
      <div className={`flex-shrink-0 w-3 h-3 rounded-full ${getActivityColor()}`}></div>
      
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {activity.taskName}
          </p>
          <p className="text-xs text-gray-500">
            {activity.timestamp.toDate().toLocaleTimeString()}
          </p>
        </div>
        
        <div className={`text-sm font-bold ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {activity.pointsEarned > 0 ? '+' : ''}{activity.pointsEarned}
        </div>
      </div>
    </div>
  );
};
```

### 11. Modal 基础组件
```jsx
const Modal = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
```

### 12. TaskCreateForm 组件
```jsx
const TaskCreateForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    pointValue: 10,
    type: 'daily'
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Add New Task"
      subtitle="Create a new task or achievement to earn points"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Complete morning workout"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Point Value
          </label>
          <input
            type="number"
            value={formData.pointValue}
            onChange={(e) => setFormData({...formData, pointValue: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="achievement">Achievement</option>
            <option value="bad_habit">Bad Habit</option>
          </select>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  );
};
```

### 13. RewardCreateForm 组件
```jsx
const RewardCreateForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    pointCost: 100,
    description: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Add New Reward"
      subtitle="Create a reward to motivate yourself"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reward Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Movie night with popcorn"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Point Cost
          </label>
          <input
            type="number"
            value={formData.pointCost}
            onChange={(e) => setFormData({...formData, pointCost: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe your reward..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Reward
          </button>
        </div>
      </form>
    </Modal>
  );
};
```

### 14. FloatingActionButton 组件
```jsx
const FloatingActionButton = ({ onClick, type = 'task' }) => {
  const getIcon = () => {
    switch (type) {
      case 'task': return '+';
      case 'reward': return '🎁';
      default: return '+';
    }
  };
  
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 flex items-center justify-center text-2xl font-bold hover:scale-110"
      aria-label={`Add new ${type}`}
    >
      {getIcon()}
    </button>
  );
};
```

## 交互流程设计

### 1. 用户切换流程
```
用户点击切换按钮
    ↓
显示加载状态
    ↓
获取对方用户数据
    ↓
更新UI显示
    ↓
记录切换操作
```

### 2. 任务完成流程
```
用户点击任务完成按钮
    ↓
显示确认对话框
    ↓
验证任务状态
    ↓
更新任务状态 (如果是achievement类型)
    ↓
记录活动日志
    ↓
更新用户积分
    ↓
显示成功反馈
    ↓
刷新相关UI组件
```

### 3. 奖励兑换流程
```
用户点击兑换按钮
    ↓
验证积分是否足够
    ↓
显示确认对话框
    ↓
更新奖励状态
    ↓
扣除用户积分
    ↓
记录活动日志
    ↓
显示兑换成功反馈
    ↓
刷新相关UI组件
```

## 响应式设计细节

### 移动端优化
- 使用触摸友好的按钮尺寸 (最小44px)
- 实现滑动操作支持
- 优化表单输入体验
- 使用底部导航栏

### 桌面端优化
- 使用键盘快捷键支持
- 实现拖拽排序功能
- 优化鼠标悬停效果
- 使用侧边栏导航

## 无障碍设计

### 可访问性特性
- 支持键盘导航
- 提供屏幕阅读器支持
- 使用语义化HTML标签
- 提供高对比度模式
- 支持字体大小调整

### ARIA 标签示例
```jsx
<button
  aria-label="完成任务：晨跑30分钟，获得50积分"
  aria-describedby="task-description"
  onClick={handleComplete}
>
  完成
</button>
```

## 更新后的色彩系统

### 主色调 - 紫色系
```css
/* 主色调 - 紫色系 */
--primary: #7C3AED;           /* 主紫色 */
--primary-light: #A78BFA;     /* 浅紫色 */
--primary-dark: #5B21B6;      /* 深紫色 */
--primary-50: #F3F4F6;        /* 极浅紫 */

/* 功能色 */
--positive: #10B981;          /* 绿色 - 正分 */
--negative: #EF4444;          /* 红色 - 负分 */
--warning: #F59E0B;           /* 橙色 - 警告 */
--info: #3B82F6;              /* 蓝色 - 信息 */

/* 任务类型色 */
--daily: #3B82F6;             /* 蓝色 - 日常任务 */
--achievement: #F59E0B;       /* 橙色 - 成就任务 */
--bad-habit: #EF4444;         /* 红色 - 不良习惯 */

/* 中性色 */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;

/* 背景色 */
--bg-primary: #FFFFFF;        /* 主背景 */
--bg-secondary: #F9FAFB;      /* 次背景 */
--bg-card: #FFFFFF;           /* 卡片背景 */
```

## 设计图片匹配总结

基于提供的UI设计图片，我们已经成功更新了以下组件：

### ✅ 已更新的组件
1. **AppHeader** - 简洁标题 + 主题切换按钮
2. **UserSwitcher** - 居中对齐的用户切换按钮，紫色主题
3. **ScoreDisplay** - 左侧紫色渐变条，大号数字显示，右上角图表图标
4. **NavigationTabs** - 圆角标签设计，白色选中状态
5. **TaskCard** - 任务类型标签，图标，删除按钮，积分显示
6. **RewardCard** - 橙色积分标签，黄色进度条，进度百分比
7. **ActivityTimeline** - 简洁的活动历史卡片
8. **ActivityItem** - 彩色圆点，简洁的列表项
9. **Modal组件** - 匹配设计图片的模态框样式
10. **TaskCreateForm** - 完整的任务创建表单
11. **RewardCreateForm** - 奖励创建表单
12. **FloatingActionButton** - 紫色圆形浮动按钮

### 🎨 设计特点
- **紫色主题**: 主色调使用紫色系 (#7C3AED)
- **卡片式设计**: 所有内容都使用白色圆角卡片
- **简洁布局**: 清晰的视觉层次和间距
- **现代UI**: 符合当前设计趋势的界面风格
- **响应式**: 适配不同屏幕尺寸

### 📱 布局结构
```
Header (标题 + 主题切换)
    ↓
UserSwitcher (用户切换)
    ↓
ScoreDisplay (积分显示卡片)
    ↓
NavigationTabs (导航标签)
    ↓
ContentArea (任务/奖励/活动列表)
    ↓
FloatingActionButton (浮动添加按钮)
```

这个UI组件设计完全匹配了提供的设计图片，确保了良好的用户体验、响应式布局和无障碍访问，同时保持了代码的可维护性和可扩展性。
