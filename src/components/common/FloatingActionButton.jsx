import { useApp } from '../../context/AppContext';

const FloatingActionButton = ({ onAddClick }) => {
  const { state } = useApp();
  
  // 根据当前查看的用户决定主题颜色
  const isCurrentUser = state.viewingUser === 'current';
  
  const getIcon = () => {
    switch (state.activeTab) {
      case 'tasks': return '+';
      case 'rewards': return '🎁';
      default: return '+';
    }
  };
  
  const getLabel = () => {
    switch (state.activeTab) {
      case 'tasks': return 'Add Task';
      case 'rewards': return 'Add Reward';
      default: return 'Add Item';
    }
  };
  
  const handleClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      console.log(`Add new ${state.activeTab}`);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 left-6 w-14 h-14 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center text-2xl font-bold hover:scale-110 ${
        isCurrentUser 
          ? 'bg-purple-600 hover:bg-purple-700' 
          : ''
      }`}
      style={!isCurrentUser ? {
        backgroundColor: '#4169E1'
      } : {}}
      onMouseEnter={(e) => {
        if (!isCurrentUser) {
          e.currentTarget.style.backgroundColor = '#3758C7';
        }
      }}
      onMouseLeave={(e) => {
        if (!isCurrentUser) {
          e.currentTarget.style.backgroundColor = '#4169E1';
        }
      }}
      aria-label={getLabel()}
    >
      {getIcon()}
    </button>
  );
};

export default FloatingActionButton;
