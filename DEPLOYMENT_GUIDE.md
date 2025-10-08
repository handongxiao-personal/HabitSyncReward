# 🚀 HabitSync Rewards 部署指南

## 方案一：Vercel 部署（推荐）

### 为什么选择 Vercel？
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动部署（Git push 后自动更新）
- ✅ 零配置，开箱即用

### 部署步骤

#### 1. 推送代码到 GitHub

```bash
# 在 GitHub 创建新仓库: https://github.com/new
# 仓库名：HabitSyncReward

# 连接到 GitHub
git remote add origin https://github.com/你的用户名/HabitSyncReward.git

# 推送代码
git branch -M main
git push -u origin main
```

#### 2. 部署到 Vercel

1. 访问 **https://vercel.com**
2. 点击 "Sign Up" 用 GitHub 账号登录
3. 点击 "New Project"
4. 从列表中选择 `HabitSyncReward` 仓库
5. 点击 "Import"

#### 3. 配置项目

Vercel 会自动检测到 Vite 项目，但请确认：
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 4. 添加环境变量

在 "Environment Variables" 部分，添加 Firebase 配置：

```
VITE_FIREBASE_API_KEY=你的API密钥
VITE_FIREBASE_AUTH_DOMAIN=你的项目.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的项目ID
VITE_FIREBASE_STORAGE_BUCKET=你的项目.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的发送者ID
VITE_FIREBASE_APP_ID=你的应用ID
```

> 💡 这些值可以在 `src/services/firebase.js` 中找到

#### 5. 部署

点击 "Deploy" 按钮，等待 1-2 分钟

#### 6. 获取网址

部署成功后，你会得到一个网址，例如：
```
https://habit-sync-reward.vercel.app
```

#### 7. 配置自定义域名（可选）

在 Vercel 项目设置中，可以添加自定义域名。

---

## 方案二：Netlify 部署

### 部署步骤

1. 访问 **https://netlify.com**
2. 用 GitHub 账号登录
3. 点击 "Add new site" → "Import an existing project"
4. 选择 "GitHub"，授权并选择 `HabitSyncReward` 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 在 "Advanced" 中添加环境变量（同上）
7. 点击 "Deploy site"

你会得到一个网址，例如：
```
https://habit-sync-reward.netlify.app
```

---

## 方案三：Firebase Hosting

### 为什么选择 Firebase Hosting？
- ✅ 与 Firebase 服务集成最好
- ✅ 免费额度很高
- ✅ 自动 HTTPS
- ✅ 全球 CDN

### 部署步骤

#### 1. 安装 Firebase CLI

```bash
npm install -g firebase-tools
```

#### 2. 登录 Firebase

```bash
firebase login
```

#### 3. 初始化 Firebase Hosting

```bash
firebase init hosting
```

选择：
- Use an existing project: 选择你的 Firebase 项目
- What do you want to use as your public directory? **dist**
- Configure as a single-page app? **Yes**
- Set up automatic builds and deploys with GitHub? **Yes**（可选）

#### 4. 构建项目

```bash
npm run build
```

#### 5. 部署

```bash
firebase deploy --only hosting
```

你会得到一个网址，例如：
```
https://你的项目.web.app
```

---

## 📝 部署后的配置

### 1. 更新 Firebase 授权域名

1. 进入 Firebase Console
2. Authentication → Settings → Authorized domains
3. 添加你的新域名：
   - `your-app.vercel.app` 或
   - `your-app.netlify.app` 或
   - `your-project.web.app`

### 2. 更新 Firestore 安全规则（如果需要）

确保 Firestore 规则允许你的新域名访问。

### 3. 测试应用

访问你的新网址，测试所有功能：
- ✅ 用户注册和登录
- ✅ 任务和奖励的增删改查
- ✅ 用户配对功能
- ✅ 主题切换

---

## 🔄 自动部署

### Vercel 和 Netlify 都支持自动部署

每次你推送代码到 GitHub，网站会自动更新：

```bash
git add .
git commit -m "更新功能"
git push
```

等待 1-2 分钟，你的网站就会自动更新！

---

## 💡 推荐配置

### 自定义域名

如果你有自己的域名（例如：`habitsync.com`）：

1. **Vercel**：
   - 项目设置 → Domains → Add Domain
   - 按提示配置 DNS

2. **Netlify**：
   - Site settings → Domain management → Add custom domain
   - 按提示配置 DNS

### 性能优化

已经在 `vite.config.js` 中配置了：
- ✅ Source maps
- ✅ Code splitting
- ✅ 资源优化

---

## ❓ 常见问题

### Q: 部署后看到空白页面？
A: 检查浏览器控制台，可能是环境变量配置错误。

### Q: Firebase 连接失败？
A: 确保添加了部署域名到 Firebase 授权域名列表。

### Q: 如何回滚到之前的版本？
A: Vercel 和 Netlify 都支持在后台回滚到任何之前的部署。

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 检查 Vercel/Netlify 的部署日志
2. 查看浏览器控制台错误
3. 确认环境变量配置正确

