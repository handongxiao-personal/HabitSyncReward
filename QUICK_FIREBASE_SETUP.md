# 🚀 Firebase 快速配置指南

## 问题：创建任务后数据不保存

**原因**: 当前使用Demo配置，没有连接到真实的Firebase数据库。

## 🔧 快速解决方案

### 步骤1: 创建Firebase项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "创建项目"
3. 输入项目名称（如：`my-habitsync-app`）
4. 完成创建

### 步骤2: 启用服务

1. **启用Authentication**:
   - 点击左侧菜单 "Authentication"
   - 点击 "Get started"
   - 在 "Sign-in method" 中启用 "Anonymous"

2. **创建Firestore数据库**:
   - 点击左侧菜单 "Firestore Database"
   - 点击 "Create database"
   - 选择 "Start in test mode"
   - 选择数据库位置

### 步骤3: 获取配置

1. 点击项目设置（齿轮图标）
2. 在 "General" 标签页找到 "Your apps"
3. 点击 "Add app" → 选择 Web 图标 `</>`
4. 输入应用名称，点击 "Register app"
5. 复制配置对象

### 步骤4: 创建配置文件

在项目根目录创建 `.env.local` 文件：

```env
# 将下面的值替换为你的Firebase配置
VITE_FIREBASE_API_KEY=你的_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=你的项目ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的项目ID
VITE_FIREBASE_STORAGE_BUCKET=你的项目ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的_SENDER_ID
VITE_FIREBASE_APP_ID=你的_APP_ID

# 应用配置
VITE_APP_ID=habitsync_rewards
VITE_INITIAL_AUTH_TOKEN=
```

### 步骤5: 重启应用

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

## ✅ 验证配置

配置成功后：
1. 页面顶部的黄色警告会消失
2. 右下角的调试按钮可以测试连接
3. 创建任务后会真正保存到Firebase

## 🐛 调试工具

点击右下角的 "🐛 调试" 按钮可以：
- 查看Firebase连接状态
- 测试数据读写
- 检查配置是否正确

## ❓ 常见问题

**Q: 配置后仍然显示Demo模式？**
A: 确保重启了开发服务器，并检查`.env.local`文件格式

**Q: 提示权限错误？**
A: 确保Firestore已设置为"测试模式"

**Q: 数据仍然不保存？**
A: 使用调试工具测试连接，查看浏览器控制台错误信息

---

🎉 **配置完成后，你的任务数据就会真正保存到Firebase云数据库了！**
