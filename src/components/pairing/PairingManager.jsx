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
import { toast } from '../common/Toast';
import Modal from '../common/Modal';

const PairingManager = ({ currentUserProfile, partnerId, onPartnerChange }) => {
  const { currentUser } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Listen for received invitations
  useEffect(() => {
    if (!currentUser?.email) return;

    const unsubscribe = subscribeToUserInvitations(currentUser.email, (invites) => {
      setInvitations(invites);
    });

    return unsubscribe;
  }, [currentUser]);

  // Fetch partner's profile
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
        console.error('Failed to fetch partner profile:', error);
      }
    };

    fetchPartnerProfile();
  }, [partnerId]);

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    
    if (!partnerEmail.trim()) {
      toast.error("Please enter partner's email");
      return;
    }

    if (partnerEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      toast.error("Cannot invite yourself");
      return;
    }

    setLoading(true);
    try {
      await sendPairInvitation(
        currentUser.uid, 
        partnerEmail.trim(), 
        currentUserProfile?.username || 'Unnamed User'
      );
      toast.success('Invitation sent!');
      setShowInviteModal(false);
      setPartnerEmail('');
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast.error('Failed to send: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitation) => {
    setLoading(true);
    try {
      await acceptPairInvitation(invitation.id, currentUser.uid, invitation.fromUserId);
      toast.success(`Accepted pairing invitation from ${invitation.fromUserName}!`);
      if (onPartnerChange) {
        onPartnerChange(invitation.fromUserId);
      }
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      toast.error('Failed to accept: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    setLoading(true);
    try {
      await rejectPairInvitation(invitationId);
      toast.success('Invitation rejected');
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      toast.error('Operation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpair = async () => {
    if (!partnerId) return;
    
    if (!confirm(`Are you sure you want to unpair from ${partnerProfile?.username || 'partner'}?`)) {
      return;
    }

    setLoading(true);
    try {
      await unpairUsers(currentUser.uid, partnerId);
      toast.success('Unpaired successfully');
      if (onPartnerChange) {
        onPartnerChange(null);
      }
    } catch (error) {
      console.error('Failed to unpair:', error);
      toast.error('Operation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">👯</span>
        Partner Management
      </h3>

      {/* Current pairing status */}
      {partnerId ? (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paired with</p>
              <p className="font-medium text-gray-900">
                {partnerProfile?.username || 'Loading...'}
              </p>
            </div>
            <button
              onClick={handleUnpair}
              disabled={loading}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              Unpair
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            You don't have a partner yet. Send an invitation to start pairing!
          </p>
        </div>
      )}

      {/* Invite button */}
      {!partnerId && (
        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Send Pairing Invitation
        </button>
      )}

      {/* Received invitations */}
      {invitations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Received Invitations ({invitations.length})
          </p>
          {invitations.map((invitation) => (
            <div 
              key={invitation.id}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-sm mb-2">
                <span className="font-medium">{invitation.fromUserName}</span> invited you to pair
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptInvitation(invitation)}
                  disabled={loading || partnerId}
                  className="flex-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectInvitation(invitation.id)}
                  disabled={loading}
                  className="flex-1 px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send invitation modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Send Pairing Invitation"
        subtitle="Enter partner's registered email"
      >
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner's Email
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
              Partner must register an account first to receive invitation
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PairingManager;
