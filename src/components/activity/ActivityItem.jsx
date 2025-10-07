import { formatTime, getActivityColor, formatPoints } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

const ActivityItem = ({ activity, onDelete }) => {
  const { state, actions } = useApp();
  
  const isPositive = activity.pointsEarned > 0;
  const isTask = activity.type === 'task_completed';
  
  const currentUserId = state.viewingUser === 'current' 
    ? state.currentUserId 
    : state.otherUserId;
    
  const isCurrentUser = activity.userId === currentUserId;
  
  // 检查是否在查看伙伴的数据
  const isViewingPartner = state.viewingUser === 'other';
  const canDelete = !isViewingPartner && isCurrentUser;
  
  const handleDelete = () => {
    actions.deleteActivity(activity.id, currentUserId);
    onDelete && onDelete(activity.id);
  };
  
  const getActivityColorClass = () => {
    if (isTask) {
      return isPositive ? 'bg-purple-100' : 'bg-red-100';
    }
    return 'bg-blue-100';
  };
  
  return (
    <div className="flex items-center space-x-4">
      <div className={`flex-shrink-0 w-3 h-3 rounded-full ${getActivityColorClass()}`}></div>
      
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {activity.taskName}
          </p>
          <p className="text-xs text-gray-500">
            {formatTime(activity.timestamp)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`text-sm font-bold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatPoints(activity.pointsEarned)}
          </div>
          
          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="删除活动"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
