# HabitSync Rewards 安装指南

## 🚀 快速安装

### 步骤 1: 安装 Node.js

首先需要安装 Node.js，这是运行 React 应用的前提条件。

**macOS (使用 Homebrew):**
```bash
# 安装 Homebrew (如果还没有)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node
```

**Windows:**
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本
3. 运行安装程序并按照提示安装

**Linux (Ubuntu/Debian):**
```bash
# 更新包管理器
sudo apt update

# 安装 Node.js
sudo apt install nodejs npm
```

### 步骤 2: 验证安装

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

### 步骤 3: 安装项目依赖

```bash
# 进入项目目录
cd "/Users/dongxiao.han/Downloads/Personal Project/HabitSyncReward"

# 安装依赖
npm install
```

### 步骤 4: 启动开发服务器

```bash
# 启动开发服务器
npm run dev
```

### 步骤 5: 查看应用

打开浏览器访问: [http://localhost:3000](http://localhost:3000)

## 🔧 故障排除

### 问题 1: 找不到 npm 命令

**解决方案:**
```bash
# 重新安装 Node.js
# 或使用 nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

### 问题 2: 权限错误

**解决方案:**
```bash
# 修复 npm 权限
sudo chown -R $(whoami) ~/.npm
```

### 问题 3: 端口被占用

**解决方案:**
```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程
kill -9 $(lsof -ti:3000)

# 或使用不同端口启动
npm run dev -- --port 3001
```

### 问题 4: 依赖安装失败

**解决方案:**
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

## 📱 使用说明

### 基本功能

1. **用户切换**: 点击顶部的用户按钮切换查看不同用户的数据
2. **任务管理**: 在 Tasks 标签页查看和管理任务
3. **奖励系统**: 在 Rewards 标签页查看和兑换奖励
4. **活动历史**: 在 Activity 标签页查看活动记录

### 演示数据

应用已包含演示数据，包括：
- 5个示例任务（日常习惯、成就任务、不良习惯）
- 4个示例奖励
- 活动历史记录

## 🎨 自定义配置

### 修改主题色

编辑 `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color-here', // 修改主色调
      }
    }
  }
}
```

### 修改演示数据

编辑 `src/utils/demoData.js` 文件来修改演示数据。

## 🔮 下一步

1. **配置 Firebase**: 按照 README.md 中的说明配置 Firebase
2. **添加功能**: 实现模态框、表单等功能
3. **部署应用**: 使用 Firebase Hosting 部署应用

## 📞 获取帮助

如果遇到问题，请：
1. 查看浏览器控制台错误信息
2. 检查 Node.js 和 npm 版本
3. 参考项目 README.md 文档
4. 提交 Issue 到项目仓库
