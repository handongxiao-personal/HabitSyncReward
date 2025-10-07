# Firebase 设置指南

## 🔥 Firebase 项目配置

### 1. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"创建项目"
3. 输入项目名称（例如：`habitsync-rewards`）
4. 选择是否启用 Google Analytics（可选）
5. 创建项目

### 2. 启用 Authentication

1. 在 Firebase Console 中，点击左侧菜单的 "Authentication"
2. 点击 "Get started"
3. 在 "Sign-in method" 标签页中：
   - 启用 "Anonymous" 登录方式
   - （可选）启用其他登录方式如 Google、Email/Password

### 3. 创建 Firestore 数据库

1. 点击左侧菜单的 "Firestore Database"
2. 点击 "Create database"
3. 选择 "Start in test mode"（开发阶段）
4. 选择数据库位置（推荐选择离你最近的区域）

### 4. 配置安全规则

在 Firestore 的 "Rules" 标签页中，使用以下规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许所有用户读写 artifacts 集合下的数据
    match /artifacts/{appId}/public/data/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**注意**: 这是开发阶段的宽松规则，生产环境需要更严格的安全规则。

### 5. 获取 Firebase 配置

1. 在 Firebase Console 中，点击项目设置（齿轮图标）
2. 在 "General" 标签页中，滚动到 "Your apps" 部分
3. 点击 "Add app" 并选择 Web 图标 `</>`
4. 输入应用昵称（例如：`HabitSync Web App`）
5. 复制 Firebase 配置对象

### 6. 配置环境变量

创建 `.env` 文件（如果不存在）并填入你的 Firebase 配置：

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# App Configuration
VITE_APP_ID=habitsync_rewards
VITE_INITIAL_AUTH_TOKEN=
```

### 7. 测试连接

启动开发服务器：

```bash
npm run dev
```

如果配置正确，应用会：
1. 自动进行匿名登录
2. 显示主界面
3. 能够创建和管理任务/奖励

## 🔧 数据库结构

Firebase 集成后，数据将存储在以下结构中：

```
/artifacts/habitsync_rewards/public/data/
├── projects/          # 任务集合
├── wishlists/         # 奖励集合  
├── activitylogs/      # 活动日志
└── userscores/        # 用户积分
```

## 📊 功能特性

### ✅ 已实现的功能

- **用户认证**: 匿名登录
- **实时数据同步**: 使用 Firestore onSnapshot
- **任务管理**: 创建、更新、删除、完成任务
- **奖励系统**: 创建、更新、删除、兑换奖励
- **活动日志**: 自动记录所有操作
- **积分系统**: 自动计算和更新用户积分
- **双用户支持**: 支持查看对方用户数据

### 🔄 实时同步

所有数据变更都会实时同步到 Firebase，包括：
- 任务的创建、更新、完成
- 奖励的创建、更新、兑换
- 积分的自动计算
- 活动历史的记录

### 🎯 双用户系统

- 当前用户ID: 基于 Firebase 用户 UID
- 对方用户ID: `{当前用户ID}-partner`
- 双方可以查看对方的所有数据

## 🚀 快速开始

1. 按照上述步骤配置 Firebase
2. 创建 `.env` 文件并填入配置
3. 启动应用：`npm run dev`
4. 开始创建任务和奖励！

## 🔒 安全注意事项

### 开发阶段
- 当前使用的是宽松的安全规则
- 所有用户都可以读写数据

### 生产环境建议
- 实现用户认证（Email/Password 或 Google 登录）
- 使用严格的安全规则
- 限制用户只能访问自己的数据

## 🐛 常见问题

### 1. 连接失败
- 检查 `.env` 文件中的配置是否正确
- 确保 Firebase 项目已启用 Authentication 和 Firestore

### 2. 权限错误
- 检查 Firestore 安全规则是否正确配置
- 确保规则允许读写 `artifacts` 集合

### 3. 数据不同步
- 检查网络连接
- 查看浏览器控制台是否有错误信息

## 📞 获取帮助

如果遇到问题，请：
1. 检查浏览器控制台的错误信息
2. 查看 Firebase Console 中的使用情况和日志
3. 确保所有依赖都已正确安装

---

🎉 **恭喜！** 你已经成功集成了 Firebase，现在可以享受实时数据同步的习惯追踪体验了！
