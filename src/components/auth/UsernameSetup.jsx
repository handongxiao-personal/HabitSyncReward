import { useState } from 'react';
import { toast } from 'react-hot-toast';

const UsernameSetup = ({ onComplete, currentEmail }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('请输入用户名');
      return;
    }

    if (username.trim().length < 2) {
      toast.error('用户名至少2个字符');
      return;
    }

    console.log('UsernameSetup: 提交用户名:', username.trim());
    setLoading(true);
    try {
      await onComplete(username.trim());
      console.log('UsernameSetup: onComplete 执行成功');
      toast.success('用户名设置成功！');
    } catch (error) {
      console.error('UsernameSetup: 设置用户名失败:', error);
      toast.error('设置失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            设置你的用户名
          </h2>
          <p className="text-gray-600 text-sm">
            登录邮箱：{currentEmail}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="输入你的昵称"
              required
              minLength={2}
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">
              2-20个字符，建议使用中文或英文名称
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : '完成设置'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameSetup;

