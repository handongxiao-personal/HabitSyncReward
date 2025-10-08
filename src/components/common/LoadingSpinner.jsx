import { useApp } from '../../context/AppContext';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const { state } = useApp();
  
  // 根据当前查看的用户决定主题颜色
  const isCurrentUser = state.viewingUser === 'current';
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 ${isCurrentUser ? 'border-t-purple-600' : ''} ${sizeClasses[size]}`}
        style={!isCurrentUser ? {
          borderTopColor: '#4169E1'
        } : {}}
      ></div>
      {message && (
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
