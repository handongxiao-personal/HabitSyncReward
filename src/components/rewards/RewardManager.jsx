import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateId } from '../../utils/helpers';
import RewardCard from './RewardCard';
import Modal from '../common/Modal';
import RewardForm from './RewardForm';

const RewardManager = () => {
  const { state, actions } = useApp();
  
  const [editingReward, setEditingReward] = useState(null);
  
  const currentUserData = state.viewingUser === 'current' 
    ? state.currentUserData 
    : state.otherUserData;
    
  const currentUserId = state.viewingUser === 'current' 
    ? state.currentUserId 
    : state.otherUserId;
  
  const availableRewards = currentUserData.rewards.filter(r => !r.isClaimed);
  const claimedRewards = currentUserData.rewards.filter(r => r.isClaimed);
  
  const handleRewardClaim = (reward) => {
    console.log('Reward claimed:', reward);
    // Toast notification would go here
  };
  
  const handleRewardDelete = (rewardId) => {
    console.log('Reward deleted:', rewardId);
    // Toast notification would go here
  };
  
  const handleRewardEdit = (reward) => {
    setEditingReward(reward);
    actions.showRewardModal();
  };
  
  const handleAddReward = () => {
    setEditingReward(null);
    actions.showRewardModal();
  };
  
  const handleRewardSubmit = (formData) => {
    if (editingReward) {
      // 更新奖励
      actions.updateReward(editingReward.id, formData, currentUserId);
    } else {
      // 创建新奖励
      const newReward = {
        id: generateId(),
        ...formData,
        isClaimed: false,
        createdAt: new Date()
      };
      actions.addReward(newReward, currentUserId);
    }
    actions.hideRewardModal();
    setEditingReward(null);
  };
  
  const handleCloseModal = () => {
    actions.hideRewardModal();
    setEditingReward(null);
  };
  
  return (
    <div className="px-6 pb-20">
      {/* 可兑换奖励 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🎁</span>
          可兑换奖励
        </h2>
        
        {availableRewards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-500 mb-2">No rewards available</p>
            <p className="text-sm text-gray-400">Tap the + button to add your first reward</p>
          </div>
        )}
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableRewards.map(reward => (
            <RewardCard 
              key={reward.id}
              reward={reward}
              onClaim={handleRewardClaim}
              onDelete={handleRewardDelete}
              onEdit={handleRewardEdit}
            />
          ))}
        </div>
      </div>
      
      {/* 已兑换奖励 */}
      {claimedRewards.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">✅</span>
            已兑换奖励
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {claimedRewards.map(reward => (
              <RewardCard 
                key={reward.id}
                reward={reward}
                onClaim={handleRewardClaim}
                onDelete={handleRewardDelete}
                onEdit={handleRewardEdit}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Reward Modal */}
      <Modal
        isOpen={state.showRewardModal}
        onClose={handleCloseModal}
        title={editingReward ? "Edit Reward" : "Add New Reward"}
        subtitle={editingReward ? "Update your reward details" : "Create a new reward to motivate yourself"}
      >
        <RewardForm
          reward={editingReward}
          onSubmit={handleRewardSubmit}
          onCancel={handleCloseModal}
          isEditing={!!editingReward}
        />
      </Modal>
    </div>
  );
};

export default RewardManager;
