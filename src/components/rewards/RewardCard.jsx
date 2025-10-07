import { calculateProgress } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

const RewardCard = ({ reward, onClaim, onDelete, onEdit }) => {
  const { state, actions } = useApp();
  
  const currentUserData = state.viewingUser === 'current' 
    ? state.currentUserData 
    : state.otherUserData;
    
  const currentUserId = state.viewingUser === 'current' 
    ? state.currentUserId 
    : state.otherUserId;
  
  // 检查是否在查看伙伴的数据
  const isViewingPartner = state.viewingUser === 'other';
  const canEdit = !isViewingPartner;
  
  const progress = calculateProgress(currentUserData.score, reward.pointCost);
  const canClaim = currentUserData.score >= reward.pointCost && !reward.isClaimed && canEdit;
  
  const handleClaim = () => {
    actions.claimReward(reward.id, reward.pointCost, currentUserId);
    onClaim && onClaim(reward);
  };
  
  const handleDelete = () => {
    actions.deleteReward(reward.id, currentUserId);
    onDelete && onDelete(reward.id);
  };
  
  const handleEdit = () => {
    onEdit && onEdit(reward);
  };
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 transition-all animate-fade-in ${
      reward.isClaimed ? 'opacity-75' : 'hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🎁</span>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
            {reward.pointCost} pts
          </span>
        </div>
        {canEdit && (
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-500 transition-colors"
              title="编辑奖励"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="删除奖励"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-gray-900 mb-4">{reward.name}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{progress.toFixed(0)}% to unlock</span>
          <span>{currentUserData.score} / {reward.pointCost}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <button
        onClick={handleClaim}
        disabled={!canClaim}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          canClaim
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isViewingPartner 
          ? '仅查看' 
          : reward.isClaimed 
          ? 'Claimed' 
          : canClaim 
          ? 'Claim Now' 
          : 'Not Enough Points'
        }
      </button>
    </div>
  );
};

export default RewardCard;
