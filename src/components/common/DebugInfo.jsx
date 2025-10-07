import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const DebugInfo = () => {
  const { currentUser, userIds, isAuthenticated } = useAuth();
  const { state } = useApp();

  // 只在开发环境显示
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🐛 Debug Info</div>
      
      <div className="space-y-1">
        <div>
          <span className="text-yellow-300">认证状态:</span> {isAuthenticated ? '✅ 已登录' : '❌ 未登录'}
        </div>
        
        <div>
          <span className="text-yellow-300">Firebase用户:</span> {currentUser?.uid || '无'}
        </div>
        
        <div>
          <span className="text-yellow-300">当前用户ID:</span> {userIds.currentUserId || '无'}
        </div>
        
        <div>
          <span className="text-yellow-300">对方用户ID:</span> {userIds.otherUserId || '无'}
        </div>
        
        <div>
          <span className="text-yellow-300">查看用户:</span> {state.viewingUser}
        </div>
        
        <div>
          <span className="text-yellow-300">Firebase连接:</span> {state.isConnected ? '✅ 已连接' : '❌ 未连接'}
        </div>
        
        <div>
          <span className="text-yellow-300">任务数量:</span> {state.currentUserData.tasks.length}
        </div>
        
        <div>
          <span className="text-yellow-300">当前积分:</span> {state.currentUserData.score}
        </div>
        
        <div>
          <span className="text-yellow-300">加载状态:</span> 
          {Object.entries(state.loading).map(([key, value]) => (
            <span key={key} className={value ? 'text-orange-300' : 'text-green-300'}>
              {' '}{key}:{value ? '⏳' : '✅'}
            </span>
          ))}
        </div>
        
        {Object.entries(state.error).some(([, error]) => error) && (
          <div>
            <span className="text-red-300">错误:</span>
            {Object.entries(state.error).map(([key, error]) => 
              error && <div key={key} className="text-red-300">{key}: {error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugInfo;
