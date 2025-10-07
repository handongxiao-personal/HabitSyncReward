# Firestore 安全规则配置指南

## 🚨 重要：必须完成此配置才能使用应用

当前你看到的所有 "Missing or insufficient permissions" 错误都是因为 Firestore 安全规则未配置。

## 📋 配置步骤

### 方法 1：使用 Firebase CLI（推荐）

如果你已安装 Firebase CLI：

```bash
# 1. 安装 Firebase CLI（如果还没安装）
npm install -g firebase-tools

# 2. 登录 Firebase
firebase login

# 3. 初始化项目（如果还没初始化）
firebase init firestore

# 4. 部署规则
firebase deploy --only firestore:rules
```

项目中已包含 `firestore.rules` 文件，可以直接部署。

### 方法 2：在 Firebase Console 手动配置

1. **打开 Firebase Console**
   - 访问：https://console.firebase.google.com/
   - 选择项目：`habitsyncreward`

2. **进入 Firestore Database**
   - 左侧菜单 → **Firestore Database**
   - 顶部标签 → **规则（Rules）**

3. **删除现有规则，粘贴以下内容**：

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============= 用户配置 =============
    // 任何已认证用户可读，只能写自己的
    match /userprofiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
    
    // ============= 配对系统 =============
    
    // 配对邀请 - 已认证用户可读写
    match /pairinvitations/{invitationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // 配对关系 - 已认证用户可读写
    match /userpairs/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // ============= 核心数据 =============
    
    // 任务数据 - 已认证用户可读，只能写自己的
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // 奖励数据 - 已认证用户可读，创建者可写
    match /wishlists/{wishlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // 活动日志 - 已认证用户可读，只能写自己的
    match /activitylogs/{activityId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // 用户积分 - 已认证用户可读，只能写自己的
    match /userscores/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
  }
}
```

4. **发布规则**
   - 点击右上角 **"发布（Publish）"** 按钮
   - 等待部署完成（通常几秒钟）

5. **刷新浏览器**
   - 刷新你的应用页面
   - 所有权限错误应该消失

## ✅ 验证配置是否成功

配置完成后，刷新页面，你应该：

1. ✅ **不再看到权限错误**
2. ✅ **可以设置用户名**
3. ✅ **可以创建任务和奖励**
4. ✅ **可以兑换奖励**
5. ✅ **可以发送配对邀请**

## 🔐 规则说明

### 核心原则
- **认证检查**：所有操作都需要用户登录 (`request.auth != null`)
- **所有权检查**：只能修改自己创建的数据 (`userId == request.auth.uid`)
- **读取权限**：配对后的用户可以读取对方的数据

### 各集合的权限

| 集合 | 读取 | 创建 | 更新/删除 |
|------|------|------|-----------|
| userprofiles | 所有已认证用户 | 仅自己 | 仅自己 |
| pairinvitations | 所有已认证用户 | 所有已认证用户 | 所有已认证用户 |
| userpairs | 所有已认证用户 | 所有已认证用户 | 所有已认证用户 |
| projects | 所有已认证用户 | 仅自己 | 仅创建者 |
| wishlists | 所有已认证用户 | 仅自己 | 仅创建者 |
| activitylogs | 所有已认证用户 | 仅自己 | 仅创建者 |
| userscores | 所有已认证用户 | 仅自己 | 仅自己 |

## ⚠️ 注意事项

1. **测试环境 vs 生产环境**：
   - 当前规则适用于开发和测试
   - 生产环境建议添加更严格的验证

2. **数据隐私**：
   - 用户可以读取配对伙伴的数据
   - 但不能修改对方的数据

3. **规则更新**：
   - 修改规则后需要发布才能生效
   - 发布后立即生效，无需重启应用

## 🐛 常见问题

### Q: 发布后还是有权限错误？
A: 
- 等待10-30秒让规则完全生效
- 硬刷新浏览器（Cmd+Shift+R）
- 清除浏览器缓存

### Q: 如何验证规则是否正确？
A:
- Firebase Console → Firestore → Rules 标签
- 可以看到当前生效的规则
- 使用"模拟器"功能测试规则

### Q: 规则太宽松了？
A: 当前规则允许所有已认证用户读取所有数据，这是为了支持配对功能。如果需要更严格的隐私保护，可以添加配对检查。

## 📝 严格版规则（可选）

如果你希望用户只能读取自己和配对伙伴的数据，可以使用这个更严格的版本：

```javascript
// 需要先实现一个函数来检查是否配对
function isPaired(userId) {
  return exists(/databases/$(database)/documents/userpairs/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/userpairs/$(request.auth.uid)).data.partnerId == userId;
}

// 任务数据 - 只能读取自己和配对伙伴的
match /projects/{projectId} {
  allow read: if request.auth != null && 
    (resource.data.userId == request.auth.uid || isPaired(resource.data.userId));
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

但这会增加复杂性和查询成本，建议先使用简单版本。

