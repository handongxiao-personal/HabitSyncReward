import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const UserSwitcher = () => {
  const { state, actions } = useApp();
  const { userProfile, partnerId } = useAuth();
  
  // 如果没有配对伙伴，不显示切换器
  if (!partnerId) {
    return null;
  }
  
  return (
    <div className="flex justify-center mb-6">
      <div className="flex space-x-2">
        <button
          onClick={() => actions.setViewingUser('current')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            state.viewingUser === 'current'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-sm">👤</span>
          <span className="text-sm">{userProfile?.username || '我'}</span>
        </button>
        <button
          onClick={() => actions.setViewingUser('other')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            state.viewingUser === 'other'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-sm">👥</span>
          <span className="text-sm">{state.partnerProfile?.username || '伙伴'}</span>
        </button>
      </div>
    </div>
  );
};

export default UserSwitcher;
