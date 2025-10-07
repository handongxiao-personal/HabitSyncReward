import { useApp } from '../../context/AppContext';

const Header = () => {
  const { state, actions } = useApp();
  
  return (
    <header className="bg-white px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          HabitSync Rewards
        </h1>
        <button
          onClick={actions.toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="切换主题"
        >
          {state.isDarkMode ? (
            <span className="text-xl">☀️</span>
          ) : (
            <span className="text-xl">🌙</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
