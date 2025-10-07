import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmailLogin from './EmailLogin';
import UsernameSetup from './UsernameSetup';

const AuthStatus = ({ children }) => {
  const { loading, error, isAuthenticated, currentUser, userProfile, setUsername } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <LoadingSpinner size="large" message="Loading..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <ErrorMessage 
            error={error} 
            onRetry={signIn}
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <EmailLogin />;
  }

  // 如果已登录但未设置用户名，显示用户名设置界面
  if (isAuthenticated && !userProfile?.username) {
    return (
      <UsernameSetup 
        onComplete={setUsername}
        currentEmail={currentUser?.email}
      />
    );
  }

  return children;
};

export default AuthStatus;
