import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { signOut, currentUser } = useAuth();

  return (
    <header className="bg-white px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          HabitSync Rewards
        </h1>
        {currentUser && (
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            登出
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
