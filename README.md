# HabitSync Rewards

一个双用户协作的习惯追踪和奖励系统，通过游戏化机制激励用户建立良好习惯，同时惩罚不良习惯。

## 🎯 功能特性

- 🎯 **双用户系统**: 支持两个用户的数据管理和切换
- 📋 **任务管理**: 支持日常习惯、成就任务和不良习惯
- 🎁 **奖励兑换**: 基于积分的奖励系统
- 📊 **实时同步**: Firestore实时数据同步
- 📱 **响应式设计**: 适配移动端和桌面端
- 🌙 **主题切换**: 支持明暗主题切换

## 🛠️ 技术栈

- **React 18** - UI框架
- **Tailwind CSS** - 样式框架
- **Firebase** - 后端服务
- **Firestore** - 数据库
- **Vite** - 构建工具

## 🚀 快速开始

### 前置要求

确保你的系统已安装以下软件：
- [Node.js](https://nodejs.org/) (版本 18 或更高)
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd HabitSyncReward
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **配置环境变量**
   ```bash
   cp env.example .env
   ```
   
   编辑 `.env` 文件，填入你的 Firebase 配置：
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_APP_ID=habitsync_rewards
   VITE_INITIAL_AUTH_TOKEN=your_custom_token_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. **打开浏览器**
   
   访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 📁 项目结构

```
HabitSyncReward/
├── public/                 # 静态资源
├── src/
│   ├── components/        # React组件
│   │   ├── common/       # 通用组件
│   │   ├── tasks/        # 任务相关组件
│   │   ├── rewards/      # 奖励相关组件
│   │   └── activity/     # 活动相关组件
│   ├── context/          # React Context
│   ├── hooks/            # 自定义Hooks
│   ├── services/         # 服务层
│   ├── utils/            # 工具函数
│   ├── styles/           # 样式文件
│   ├── App.jsx           # 主应用组件
│   └── main.jsx          # 应用入口
├── package.json          # 项目配置
├── tailwind.config.js    # Tailwind配置
├── vite.config.js        # Vite配置
└── README.md             # 项目说明
```

## 🎨 设计特点

- **紫色主题**: 主色调使用紫色系 (#7C3AED)
- **卡片式设计**: 所有内容都使用白色圆角卡片
- **简洁现代**: 清晰的视觉层次和间距
- **响应式布局**: 适配不同屏幕尺寸
- **无障碍设计**: 支持键盘导航和屏幕阅读器

## 📱 功能演示

### 当前用户界面
- 显示当前用户的积分、任务、奖励和活动历史
- 支持用户切换查看对方数据
- 任务类型：日常习惯、成就任务、不良习惯
- 奖励系统：基于积分的兑换机制

### 任务管理
- 创建不同类型的任务
- 完成任务获得积分
- 不良习惯会扣除积分
- 成就任务只能完成一次

### 奖励系统
- 创建自定义奖励
- 积分足够时可直接兑换
- 进度条显示当前进度
- 兑换历史记录

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

## 🌐 Firebase 配置

### 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目
3. 启用 Authentication 和 Firestore
4. 获取项目配置信息
5. 配置安全规则（参考 `Firestore_Data_Models.md`）

### 安全规则示例

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📝 待办事项

- [ ] 实现 Firebase 认证
- [ ] 添加实时数据同步
- [ ] 实现离线支持
- [ ] 添加通知系统
- [ ] 优化性能
- [ ] 添加单元测试
- [ ] 部署到生产环境

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交 Issue 或联系开发团队。
