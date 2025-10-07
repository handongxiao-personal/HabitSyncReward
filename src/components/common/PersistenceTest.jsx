import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  createTask, 
  getUserTasks, 
  deleteTask,
  getUserScore,
  completeTask 
} from '../../services/firestore';
import { toast } from './Toast';

const PersistenceTest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const { userIds, isAuthenticated } = useAuth();
  const { state } = useApp();

  const addResult = (step, status, message, details = null) => {
    setTestResults(prev => [...prev, {
      step,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runPersistenceTest = async () => {
    if (!isAuthenticated || !userIds.currentUserId) {
      toast.error('请先登录后再进行测试');
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    
    try {
      // 步骤1: 检查初始状态
      addResult(1, 'info', '开始数据持久化测试...');
      addResult(1, 'success', `用户ID: ${userIds.currentUserId}`);
      addResult(1, 'success', `Firebase连接状态: ${state.isConnected ? '已连接' : '未连接'}`);

      // 步骤2: 获取当前任务数量
      addResult(2, 'info', '获取当前任务列表...');
      const initialTasks = await getUserTasks(userIds.currentUserId);
      addResult(2, 'success', `当前任务数量: ${initialTasks.length}`);

      // 步骤3: 创建测试任务
      addResult(3, 'info', '创建测试任务...');
      const testTaskData = {
        name: `持久化测试任务 - ${new Date().toLocaleString()}`,
        type: 'daily',
        pointValue: 50,
        category: 'test'
      };
      
      const taskId = await createTask(userIds.currentUserId, testTaskData);
      addResult(3, 'success', `任务创建成功，ID: ${taskId}`, testTaskData);

      // 等待一下让数据同步
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 步骤4: 验证任务是否保存
      addResult(4, 'info', '验证任务是否已保存...');
      const updatedTasks = await getUserTasks(userIds.currentUserId);
      const createdTask = updatedTasks.find(task => task.id === taskId);
      
      if (createdTask) {
        addResult(4, 'success', '✅ 任务已成功保存到Firebase', createdTask);
        addResult(4, 'success', `新任务数量: ${updatedTasks.length} (增加了 ${updatedTasks.length - initialTasks.length} 个)`);
      } else {
        addResult(4, 'error', '❌ 任务未找到，保存失败');
        return;
      }

      // 步骤5: 测试任务完成
      addResult(5, 'info', '测试任务完成功能...');
      const initialScore = await getUserScore(userIds.currentUserId);
      addResult(5, 'info', `完成前积分: ${initialScore.currentScore}`);
      
      await completeTask(userIds.currentUserId, taskId);
      
      // 等待积分更新
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedScore = await getUserScore(userIds.currentUserId);
      addResult(5, 'success', `完成后积分: ${updatedScore.currentScore} (+${updatedScore.currentScore - initialScore.currentScore})`);

      // 步骤6: 清理测试数据
      addResult(6, 'info', '清理测试数据...');
      await deleteTask(taskId);
      addResult(6, 'success', '测试数据已清理');

      // 步骤7: 最终验证
      addResult(7, 'info', '最终验证...');
      const finalTasks = await getUserTasks(userIds.currentUserId);
      addResult(7, 'success', `最终任务数量: ${finalTasks.length}`);
      
      if (finalTasks.length === initialTasks.length) {
        addResult(7, 'success', '✅ 数据持久化测试完全成功！');
        toast.success('🎉 数据持久化测试通过！');
      } else {
        addResult(7, 'warning', '⚠️ 任务数量不匹配，可能有残留数据');
      }

    } catch (error) {
      addResult('ERROR', 'error', `测试失败: ${error.message}`, error);
      toast.error(`测试失败: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-lg"
        >
          🧪 测试持久化
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h3 className="font-bold text-gray-900 text-lg">🧪 Firebase 数据持久化测试</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4">
          <button
            onClick={runPersistenceTest}
            disabled={isRunning || !isAuthenticated}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isRunning || !isAuthenticated
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? '🔄 测试进行中...' : '🚀 开始持久化测试'}
          </button>
          
          {!isAuthenticated && (
            <p className="text-red-600 text-sm mt-2">⚠️ 请先登录后再进行测试</p>
          )}
        </div>

        {/* Test Results */}
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <span className="text-lg">{getStatusIcon(result.status)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">步骤 {result.step}:</span>
                    <span className={`font-medium ${getStatusColor(result.status)}`}>
                      {result.message}
                    </span>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  
                  {result.details && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                      <pre className="whitespace-pre-wrap">
                        {typeof result.details === 'object' 
                          ? JSON.stringify(result.details, null, 2)
                          : result.details
                        }
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {testResults.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🧪</div>
            <p>点击上方按钮开始测试</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersistenceTest;
