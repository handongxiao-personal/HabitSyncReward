import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  sendPairInvitation, 
  subscribeToUserInvitations,
  acceptPairInvitation,
  rejectPairInvitation,
  unpairUsers,
  getUserProfile
} from '../../services/firestore';
import { toast } from 'react-hot-toast';
import Modal from '../common/Modal';

const PairingManager = ({ currentUserProfile, partnerId, onPartnerChange }) => {
  const { currentUser } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 监听收到的邀请
  useEffect(() => {
    if (!currentUser?.email) return;

    const unsubscribe = subscribeToUserInvitations(currentUser.email, (invites) => {
      setInvitations(invites);
    });

    return unsubscribe;
  }, [currentUser]);

  // 获取伙伴的配置信息
  useEffect(() => {
    if (!partnerId) {
      setPartnerProfile(null);
      return;
    }

    const fetchPartnerProfile = async () => {
      try {
        const profile = await getUserProfile(partnerId);
        setPartnerProfile(profile);
      } catch (error) {
        console.error('获取伙伴配置失败:', error);
      }
    };

    fetchPartnerProfile();
  }, [partnerId]);

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    
    if (!partnerEmail.trim()) {
      toast.error('请输入对方的邮箱');
      return;
    }

    if (partnerEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      toast.error('不能邀请自己');
      return;
    }

    setLoading(true);
    try {
      await sendPairInvitation(
        currentUser.uid, 
        partnerEmail.trim(), 
        currentUserProfile?.username || '未命名用户'
      );
      toast.success('邀请已发送！');
      setShowInviteModal(false);
      setPartnerEmail('');
    } catch (error) {
      console.error('发送邀请失败:', error);
      toast.error('发送失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitation) => {
    setLoading(true);
    try {
      await acceptPairInvitation(invitation.id, currentUser.uid, invitation.fromUserId);
      toast.success(`已接受 ${invitation.fromUserName} 的配对邀请！`);
      if (onPartnerChange) {
        onPartnerChange(invitation.fromUserId);
      }
    } catch (error) {
      console.error('接受邀请失败:', error);
      toast.error('接受失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    setLoading(true);
    try {
      await rejectPairInvitation(invitationId);
      toast.success('已拒绝邀请');
    } catch (error) {
      console.error('拒绝邀请失败:', error);
      toast.error('操作失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpair = async () => {
    if (!partnerId) return;
    
    if (!confirm(`确定要取消与 ${partnerProfile?.username || '对方'} 的配对吗？`)) {
      return;
    }

    setLoading(true);
    try {
      await unpairUsers(currentUser.uid, partnerId);
      toast.success('已取消配对');
      if (onPartnerChange) {
        onPartnerChange(null);
      }
    } catch (error) {
      console.error('取消配对失败:', error);
      toast.error('操作失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">👥</span>
        配对管理
      </h3>

      {/* 当前配对状态 */}
      {partnerId ? (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">已配对伙伴</p>
              <p className="font-medium text-gray-900">
                {partnerProfile?.username || '加载中...'}
              </p>
            </div>
            <button
              onClick={handleUnpair}
              disabled={loading}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              取消配对
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            你还没有配对伙伴，发送邀请开始配对吧！
          </p>
        </div>
      )}

      {/* 邀请按钮 */}
      {!partnerId && (
        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          发送配对邀请
        </button>
      )}

      {/* 收到的邀请 */}
      {invitations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            收到的邀请 ({invitations.length})
          </p>
          {invitations.map((invitation) => (
            <div 
              key={invitation.id}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-sm mb-2">
                <span className="font-medium">{invitation.fromUserName}</span> 邀请你配对
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptInvitation(invitation)}
                  disabled={loading || partnerId}
                  className="flex-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
                >
                  接受
                </button>
                <button
                  onClick={() => handleRejectInvitation(invitation.id)}
                  disabled={loading}
                  className="flex-1 px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50"
                >
                  拒绝
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 发送邀请弹窗 */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="发送配对邀请"
        subtitle="输入对方的注册邮箱"
      >
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              对方的邮箱
            </label>
            <input
              type="email"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="partner@example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              对方需要先注册账号才能收到邀请
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? '发送中...' : '发送邀请'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PairingManager;

