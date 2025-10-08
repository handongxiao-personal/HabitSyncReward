import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

// 检查是否有Firebase配置
const hasFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

console.log('Firebase配置状态:', {
  hasRealConfig: hasFirebaseConfig,
  projectId: firebaseConfig.projectId,
  isDemoMode: !hasFirebaseConfig
});

// 如果没有真实配置，显示警告
if (!hasFirebaseConfig) {
  console.warn('⚠️ 使用Demo配置！请在.env.local中配置真实的Firebase项目信息');
  console.warn('📝 参考FIREBASE_SETUP.md获取配置步骤');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// 启用离线持久化（对移动设备特别重要）
if (hasFirebaseConfig) {
  // 尝试启用多标签页持久化
  enableMultiTabIndexedDbPersistence(db)
    .then(() => {
      console.log('✅ Firestore 离线持久化已启用（多标签页模式）');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // 多标签页模式失败，尝试单标签页模式
        console.warn('⚠️ 多标签页持久化不可用，切换到单标签页模式');
        enableIndexedDbPersistence(db)
          .then(() => {
            console.log('✅ Firestore 离线持久化已启用（单标签页模式）');
          })
          .catch((error) => {
            console.error('❌ 离线持久化启用失败:', error);
          });
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ 当前浏览器不支持离线持久化');
      } else {
        console.error('❌ 离线持久化启用失败:', err);
      }
    });
}

// 如果是demo模式且在开发环境，尝试连接模拟器
if (!hasFirebaseConfig && import.meta.env.DEV) {
  try {
    // 注意：这只是为了演示，实际使用时需要启动Firebase模拟器
    // connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('💡 提示：可以使用Firebase模拟器进行本地开发');
  } catch (error) {
    // 模拟器连接失败是正常的，忽略错误
  }
}

// App configuration
export const APP_ID = import.meta.env.VITE_APP_ID || 'habitsync_rewards';
export const INITIAL_AUTH_TOKEN = import.meta.env.VITE_INITIAL_AUTH_TOKEN;

export default app;
