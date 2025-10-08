# 🔑 Vercel 环境变量配置指南

## 在 Vercel 部署时需要添加的环境变量

在 Vercel 的 "Environment Variables" 部分，添加以下 6 个变量：

### 必需的 Firebase 配置

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_FIREBASE_API_KEY` | Firebase API 密钥 | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `VITE_FIREBASE_AUTH_DOMAIN` | 认证域名 | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | 项目 ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | 存储桶 | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 消息发送者 ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | 应用 ID | `1:123456789012:web:abcdefg` |

---

## 📋 如何获取这些值？

### 方法 1：从 Firebase Console 获取

1. 访问 **https://console.firebase.google.com/**
2. 选择你的项目
3. 点击左上角的 ⚙️ **Project settings**（项目设置）
4. 向下滚动到 **"Your apps"** 部分
5. 选择你的 Web 应用（或创建一个新的）
6. 复制 `firebaseConfig` 对象中的值

### 方法 2：从本地代码查找

如果你之前已经在本地配置过 Firebase，检查：

```bash
# 查看是否有 .env.local 文件
cat .env.local
```

或者查看 `src/services/firebase.js` 文件中硬编码的配置（如果有）

---

## ✅ 在 Vercel 中添加环境变量

### 格式示例：

在 Vercel 部署页面，每个环境变量分别添加：

```
Name: VITE_FIREBASE_API_KEY
Value: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

```
Name: VITE_FIREBASE_AUTH_DOMAIN
Value: your-project.firebaseapp.com
```

```
Name: VITE_FIREBASE_PROJECT_ID
Value: your-project-id
```

```
Name: VITE_FIREBASE_STORAGE_BUCKET
Value: your-project.appspot.com
```

```
Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 123456789012
```

```
Name: VITE_FIREBASE_APP_ID
Value: 1:123456789012:web:abcdefg
```

### 环境选择：
- ✅ 勾选 **Production**
- ✅ 勾选 **Preview**
- ✅ 勾选 **Development**

---

## 🚨 重要提示

### 如果你还没有 Firebase 项目：

**选项 1：先部署，后配置**
- 可以先不添加环境变量
- 点击 "Deploy" 直接部署
- 应用会以 Demo 模式运行（数据不会持久化）
- 之后在 Vercel 项目设置中添加环境变量
- 触发重新部署即可

**选项 2：立即配置 Firebase**
1. 访问 **https://console.firebase.google.com/**
2. 创建新项目（或选择现有项目）
3. 启用 Authentication（Email/Password）
4. 创建 Firestore Database
5. 获取配置信息并添加到 Vercel

---

## 📍 部署后的下一步

### 1. 更新 Firebase 授权域名

部署成功后，你会得到一个 Vercel 域名，例如：
```
https://habit-sync-reward.vercel.app
```

需要将这个域名添加到 Firebase 授权域名列表：

1. 访问 **Firebase Console**
2. **Authentication** → **Settings** → **Authorized domains**
3. 点击 **"Add domain"**
4. 输入你的 Vercel 域名（不包括 `https://`）：
   ```
   habit-sync-reward.vercel.app
   ```
5. 点击 **"Add"**

### 2. 测试应用

访问你的 Vercel 域名，测试：
- ✅ 用户注册和登录
- ✅ 创建任务和奖励
- ✅ 用户配对功能
- ✅ 主题切换

---

## ❓ 常见问题

### Q: 我找不到 Firebase 配置信息
A: 在 Firebase Console → Project Settings → Your apps → Web app → Config

### Q: 部署成功但无法登录
A: 检查是否添加了 Vercel 域名到 Firebase 授权域名列表

### Q: 显示 "Demo 模式"
A: 说明环境变量没有正确配置，检查 Vercel 项目设置中的环境变量

### Q: 如何更新环境变量？
A: Vercel 项目 → Settings → Environment Variables → 修改后需要重新部署

---

## 🎉 完成！

配置好环境变量后：
1. 点击 **"Deploy"** 按钮
2. 等待 1-2 分钟
3. 获得你的应用网址！

部署完成后，每次推送代码到 GitHub，Vercel 会自动重新部署。

