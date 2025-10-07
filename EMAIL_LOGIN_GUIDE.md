# 邮箱登录使用指南

## 📧 设置步骤

### 1. 在 Firebase Console 中启用邮箱/密码认证

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择你的项目 `habitsyncreward`
3. 在左侧菜单中，点击 **Authentication（身份验证）**
4. 点击 **Sign-in method（登录方法）** 标签
5. 在 **Sign-in providers** 列表中，找到 **Email/Password**
6. 点击右侧的编辑图标（铅笔）
7. 启用 **Email/Password** 开关
8. 点击 **保存**

### 2. 使用应用

刷新浏览器页面，你会看到登录/注册界面。

## 👥 双用户使用方法

### 方案 A：两个浏览器窗口（推荐）

1. **浏览器 1（用户A）**：
   - 打开 `http://localhost:3003/`
   - 注册账号：例如 `user1@example.com` / `password123`
   - 登录后可以创建任务和奖励

2. **浏览器 2（用户B）**：
   - 打开**隐私/无痕窗口**或另一个浏览器
   - 访问 `http://localhost:3003/`
   - 注册账号：例如 `user2@example.com` / `password123`
   - 登录后可以创建任务和奖励

### 方案 B：切换账号

1. 使用第一个邮箱登录
2. 在应用右上角找到登出按钮（如果有）
3. 登出后，用第二个邮箱登录

## 🔑 重要说明

### 当前的配对逻辑

目前的配对逻辑是：
- 用户A登录后，`currentUserId` = 用户A的UID
- `otherUserId` = 用户A的UID + "-partner"

这意味着：
- **用户A和用户B看到的不是对方的数据**
- 每个用户都有自己独立的数据空间

### 如果你想要两个用户共享数据

需要修改配对逻辑，有以下几种方案：

#### 方案1：固定配对
在 `src/services/auth.js` 中修改 `generateUserIds` 函数：

```javascript
export const generateUserIds = (currentUser) => {
  if (!currentUser) {
    return {
      currentUserId: 'user-demo-1',
      otherUserId: 'user-demo-2'
    };
  }
  
  // 方案：user1@example.com 和 user2@example.com 互相配对
  const email = currentUser.email;
  if (email === 'user1@example.com') {
    return {
      currentUserId: currentUser.uid,
      otherUserId: '在这里填user2的UID' // 需要先注册user2才能知道UID
    };
  } else if (email === 'user2@example.com') {
    return {
      currentUserId: currentUser.uid,
      otherUserId: '在这里填user1的UID'
    };
  }
  
  // 默认：自己配对自己的partner
  return {
    currentUserId: currentUser.uid,
    otherUserId: `${currentUser.uid}-partner`
  };
};
```

#### 方案2：动态配对（推荐）
在 Firebase 中创建一个 `userPairs` 集合，存储配对关系：
```javascript
{
  user1UID: user2UID,
  user2UID: user1UID
}
```

## 📝 使用流程示例

1. **注册用户1**：
   - 邮箱：`alice@example.com`
   - 密码：`password123`

2. **注册用户2**（在另一个浏览器）：
   - 邮箱：`bob@example.com`
   - 密码：`password123`

3. **使用**：
   - Alice 可以创建任务和奖励
   - Bob 可以创建任务和奖励
   - 目前他们的数据是独立的

## 🔧 获取用户UID

如果需要知道用户的UID（用于配对）：

1. 登录后，打开浏览器控制台
2. 查看用户切换器中显示的用户ID
3. 或者在控制台输入：`firebase.auth().currentUser.uid`

## ⚠️ 注意事项

1. **密码要求**：至少6位
2. **邮箱格式**：必须是有效的邮箱格式
3. **测试邮箱**：可以使用任何邮箱格式，不需要真实邮箱
4. **数据隔离**：默认情况下，每个用户的数据是隔离的
5. **Firestore规则**：确保已配置正确的安全规则（见之前的说明）

