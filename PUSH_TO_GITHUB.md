# 📤 推送代码到 GitHub 指南

## 当前状态
✅ 已连接到远程仓库: https://github.com/handongxiao-personal/HabitSyncReward.git
✅ 代码已准备好推送

## 🔐 需要身份验证

由于 GitHub 的安全策略，你需要使用以下任一方式进行身份验证：

---

## 方法 1：使用 Personal Access Token（推荐）

### 步骤 1：创建 Personal Access Token

1. 访问 GitHub Token 设置页面：
   **https://github.com/settings/tokens**

2. 点击 "Generate new token" → "Generate new token (classic)"

3. 设置 Token 信息：
   - **Note**: `HabitSyncReward Deployment`
   - **Expiration**: 选择 `No expiration` 或你想要的时长
   - **Select scopes**: 勾选 `repo` (完整的仓库访问权限)

4. 点击 "Generate token"

5. **重要**：复制生成的 token（类似：`ghp_xxxxxxxxxxxxxxxxxxxx`）
   ⚠️ 这个 token 只会显示一次，请妥善保存！

### 步骤 2：使用 Token 推送代码

在终端运行以下命令：

```bash
# 使用你的 token 推送（将 YOUR_TOKEN 替换为实际的 token）
git push https://YOUR_TOKEN@github.com/handongxiao-personal/HabitSyncReward.git main
```

例如：
```bash
git push https://ghp_abc123xyz456@github.com/handongxiao-personal/HabitSyncReward.git main
```

### 步骤 3：保存凭证（可选，避免每次都输入）

```bash
# macOS 使用 Keychain 保存
git config --global credential.helper osxkeychain

# 然后再次推送，输入 token 后会自动保存
git push -u origin main
```

---

## 方法 2：使用 GitHub CLI（更简单）

### 安装 GitHub CLI

```bash
# macOS
brew install gh

# 或者下载安装包
# 访问：https://cli.github.com/
```

### 登录并推送

```bash
# 登录 GitHub
gh auth login

# 选择：
# - GitHub.com
# - HTTPS
# - Yes (authenticate Git with your GitHub credentials)
# - Login with a web browser

# 然后推送代码
git push -u origin main
```

---

## 方法 3：使用 SSH Key（最安全）

### 步骤 1：生成 SSH Key

```bash
# 生成新的 SSH key
ssh-keygen -t ed25519 -C "yishen.chen@rea-group.com"

# 按提示操作（可以直接按 Enter 使用默认设置）
```

### 步骤 2：添加 SSH Key 到 GitHub

```bash
# 复制 SSH public key
cat ~/.ssh/id_ed25519.pub | pbcopy
```

然后：
1. 访问 **https://github.com/settings/ssh/new**
2. Title: `HabitSync MacBook`
3. Key: 粘贴刚才复制的内容
4. 点击 "Add SSH key"

### 步骤 3：更改远程仓库为 SSH

```bash
# 移除现有的 HTTPS 远程仓库
git remote remove origin

# 添加 SSH 远程仓库
git remote add origin git@github.com:handongxiao-personal/HabitSyncReward.git

# 推送代码
git push -u origin main
```

---

## ✅ 推送成功后

你会看到类似的输出：

```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Delta compression using up to X threads
Compressing objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XX.XX KiB | XX.XX MiB/s, done.
Total XX (delta X), reused XX (delta X), pack-reused 0
remote: Resolving deltas: 100% (X/X), done.
To https://github.com/handongxiao-personal/HabitSyncReward.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🎉 下一步：部署到 Vercel

代码推送成功后，立即前往：

1. **https://vercel.com/new**
2. 选择你的仓库 `handongxiao-personal/HabitSyncReward`
3. 添加环境变量（Firebase 配置）
4. 点击 "Deploy"

详细步骤见：`DEPLOYMENT_GUIDE.md`

---

## ❓ 遇到问题？

### 问题 1：`fatal: could not read Username`
👉 使用方法 1 的 Personal Access Token

### 问题 2：`Permission denied (publickey)`
👉 使用方法 2 的 GitHub CLI 或重新配置 SSH

### 问题 3：`remote: Repository not found`
👉 检查仓库 URL 是否正确，确认你有访问权限

