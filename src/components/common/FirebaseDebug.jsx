import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { db, APP_ID } from '../../services/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const FirebaseDebug = () => {
  const { currentUser, userIds, isAuthenticated } = useAuth();
  const { state } = useApp();
  const [testResult, setTestResult] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // 测试Firebase连接
  const testFirebaseConnection = async () => {
    try {
      setTestResult('测试中...');
      
      // 1. 检查Firebase配置
      console.log('Firebase配置:', {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '已设置' : '未设置',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: APP_ID
      });
      
      // 2. 检查认证状态
      console.log('认证状态:', {
        isAuthenticated,
        currentUser: currentUser?.uid,
        userIds
      });
      
      // 3. 测试写入数据
      const testData = {
        name: '测试任务',
        type: 'daily',
        pointValue: 10,
        userId: userIds.currentUserId,
        createdAt: new Date(),
        isAchieved: false,
        isActive: true
      };
      
      console.log('尝试写入测试数据:', testData);
      
      const collectionPath = `artifacts/${APP_ID}/public/data/projects`;
      console.log('集合路径:', collectionPath);
      
      const docRef = await addDoc(collection(db, collectionPath), testData);
      console.log('写入成功，文档ID:', docRef.id);
      
      // 4. 测试读取数据
      const snapshot = await getDocs(collection(db, collectionPath));
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('读取到的数据:', docs);
      
      setTestResult(`✅ 测试成功！写入文档ID: ${docRef.id}，共读取到 ${docs.length} 条记录`);
      
    } catch (error) {
      console.error('Firebase测试失败:', error);
      setTestResult(`❌ 测试失败: ${error.message}`);
    }
  };

  // 键盘快捷键显示/隐藏调试面板
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(!isVisible);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          🐛 调试
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900">Firebase 调试</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>认证状态:</strong> {isAuthenticated ? '✅ 已登录' : '❌ 未登录'}
        </div>
        
        <div>
          <strong>用户ID:</strong> {userIds.currentUserId || '无'}
        </div>
        
        <div>
          <strong>Firebase连接:</strong> {state.isConnected ? '✅ 已连接' : '❌ 未连接'}
        </div>
        
        <div>
          <strong>环境变量:</strong>
          <div className="ml-2 text-xs">
            <div>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌'}</div>
            <div>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || '未设置'}</div>
            <div>App ID: {APP_ID}</div>
          </div>
        </div>
        
        <div>
          <strong>当前任务数:</strong> {state.currentUserData.tasks.length}
        </div>
        
        {testResult && (
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
            {testResult}
          </div>
        )}
        
        <div className="mt-3 space-y-2">
          <button
            onClick={testFirebaseConnection}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            测试Firebase连接
          </button>
          
          <button
            onClick={() => {
              console.log('当前状态:', state);
              console.log('认证信息:', { currentUser, userIds, isAuthenticated });
            }}
            className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            打印状态到控制台
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          快捷键: Ctrl+Shift+D 切换显示
        </div>
      </div>
    </div>
  );
};

export default FirebaseDebug;
