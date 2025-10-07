import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PairingManager from '../pairing/PairingManager';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { currentUser, userProfile, partnerId, setUsername } = useAuth();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(userProfile?.username || '');

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      toast.error('请输入用户名');
      return;
    }

    try {
      await setUsername(newUsername.trim());
      toast.success('用户名更新成功！');
      setEditingUsername(false);
    } catch (error) {
      console.error('更新用户名失败:', error);
      toast.error('更新失败：' + error.message);
    }
  };

  return (
    <div className="px-6 pb-20">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">设置</h2>
      
      {/* 用户信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">👤</span>
          个人信息
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">邮箱</label>
            <p className="text-gray-900">{currentUser?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">用户名</label>
            {editingUsername ? (
              <form onSubmit={handleUpdateUsername} className="flex space-x-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="输入新用户名"
                  required
                  minLength={2}
                  maxLength={20}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUsername(false);
                    setNewUsername(userProfile?.username || '');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-gray-900">{userProfile?.username || '未设置'}</p>
                <button
                  onClick={() => setEditingUsername(true)}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  修改
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 配对管理 */}
      <PairingManager 
        currentUserProfile={userProfile}
        partnerId={partnerId}
      />
    </div>
  );
};

export default SettingsPage;

