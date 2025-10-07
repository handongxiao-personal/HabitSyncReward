import { useApp } from '../../context/AppContext';

const FloatingActionButton = ({ onAddClick }) => {
  const { state } = useApp();
  
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
      className="fixed bottom-6 left-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 flex items-center justify-center text-2xl font-bold hover:scale-110"
      aria-label={getLabel()}
    >
      {getIcon()}
    </button>
  );
};

export default FloatingActionButton;
