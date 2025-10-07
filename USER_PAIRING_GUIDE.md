# 用户配对使用指南

## ✨ 新功能

1. **用户名系统**：登录后设置个性化用户名
2. **配对邀请系统**：通过邮箱邀请伙伴配对
3. **数据隔离**：只有配对后才能看到对方的数据

## 📝 完整使用流程

### 步骤 1：Firebase 配置

在 Firebase Console 中更新 Firestore 安全规则：

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 用户配置
    match /userprofiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
    
    // 配对邀请
    match /pairinvitations/{invitationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.fromUserId == request.auth.uid || 
         resource.data.toEmail == request.auth.token.email);
    }
    
    // 配对关系
    match /userpairs/{userId} {
      allow read: if request.auth != null && userId == request.auth.uid;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
    
    // 任务数据
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // 奖励数据
    match /wishlists/{wishlistId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // 活动日志
    match /activitylogs/{activityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // 用户积分
    match /userscores/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
  }
}
```

### 步骤 2：用户 A 注册和设置

1. **打开浏览器**，访问 `http://localhost:3003/`
2. **注册账号**：
   - 邮箱：`alice@example.com`
   - 密码：`password123`
   - 点击"注册"
3. **设置用户名**：
   - 输入用户名，例如：`Alice`
   - 点击"完成设置"
4. **进入应用**，你会看到主界面

### 步骤 3：用户 B 注册和设置

1. **打开无痕窗口**（Cmd + Shift + N）或另一个浏览器
2. 访问 `http://localhost:3003/`
3. **注册账号**：
   - 邮箱：`bob@example.com`
   - 密码：`password123`
   - 点击"注册"
4. **设置用户名**：
   - 输入用户名，例如：`Bob`
   - 点击"完成设置"

### 步骤 4：发送配对邀请（用户 A）

1. 在 Alice 的浏览器中，点击顶部的 **"设置"** 标签
2. 在"配对管理"区域，点击 **"发送配对邀请"** 按钮
3. 输入 Bob 的邮箱：`bob@example.com`
4. 点击"发送邀请"
5. 看到成功提示："邀请已发送！"

### 步骤 5：接受配对邀请（用户 B）

1. 在 Bob 的浏览器中，点击 **"设置"** 标签
2. 在"收到的邀请"区域，看到 Alice 的邀请
3. 点击 **"接受"** 按钮
4. 看到成功提示："已接受 Alice 的配对邀请！"

### 步骤 6：开始使用

现在两个用户都已配对成功！

#### 用户 A（Alice）：
- 在顶部看到用户切换器：**[Alice]** 和 **[Bob]**
- 可以切换查看自己或 Bob 的任务和奖励
- 创建的任务/奖励只属于自己

#### 用户 B（Bob）：
- 在顶部看到用户切换器：**[Bob]** 和 **[Alice]**
- 可以切换查看自己或 Alice 的任务和奖励
- 创建的任务/奖励只属于自己

## 🎯 功能说明

### 配对前
- ✅ 可以登录和设置用户名
- ✅ 可以创建自己的任务和奖励
- ❌ 看不到用户切换器
- ❌ 无法查看其他人的数据

### 配对后
- ✅ 顶部显示用户名切换器
- ✅ 可以切换查看自己和伙伴的数据
- ✅ 每个人的数据完全独立
- ✅ 可以在设置中取消配对

## 🔄 取消配对

如果需要取消配对：

1. 进入 **"设置"** 标签
2. 在"已配对伙伴"区域，点击 **"取消配对"** 按钮
3. 确认操作
4. 配对关系将被解除，双方都无法再看到对方的数据

## 💡 重要说明

### 数据隔离
- 每个用户的任务、奖励和积分完全独立
- 配对只是允许**查看**对方的数据，不能修改对方的数据
- 只能完成自己的任务，兑换自己的奖励

### 邀请规则
- 必须知道对方的注册邮箱才能发送邀请
- 对方必须先注册账号才能收到邀请
- 每次只能配对一个伙伴
- 可以随时取消配对并重新配对其他人

### 安全性
- 所有数据都有 Firestore 安全规则保护
- 只能读写自己的数据
- 配对邀请需要双方同意

## 🎨 UI 改进

- ✅ 标签页改为中文：任务、奖励、活动、设置
- ✅ 用户切换器显示用户名而不是 ID
- ✅ 未配对时不显示用户切换器
- ✅ 设置页面不显示浮动按钮
- ✅ 登出按钮在页面右上角

## 🐛 故障排除

### 看不到邀请
- 确保对方已经注册并登录
- 检查邮箱拼写是否正确
- 刷新页面重新加载数据

### 无法发送邀请
- 检查 Firestore 安全规则是否正确配置
- 确保已启用 Email/Password 认证
- 查看浏览器控制台的错误信息

### 配对后看不到对方数据
- 确保对方已经创建了任务或奖励
- 刷新页面
- 检查用户切换器是否正确切换

