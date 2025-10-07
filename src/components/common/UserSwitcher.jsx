import { useApp } from '../../context/AppContext';

const UserSwitcher = () => {
  const { state, actions } = useApp();
  
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
          <span className="text-sm font-mono">{state.currentUserId}</span>
        </button>
        <button
          onClick={() => actions.setViewingUser('other')}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            state.viewingUser === 'other'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="text-sm">👤</span>
          <span className="text-sm font-mono">{state.otherUserId}</span>
        </button>
      </div>
    </div>
  );
};

export default UserSwitcher;
