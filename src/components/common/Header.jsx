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
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
