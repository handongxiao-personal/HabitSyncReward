import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PairingManager from '../pairing/PairingManager';
import { toast } from '../common/Toast';

const SettingsPage = () => {
  const { currentUser, userProfile, partnerId, setUsername } = useAuth();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(userProfile?.username || '');

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }

    try {
      await setUsername(newUsername.trim());
      toast.success('Username updated successfully!');
      setEditingUsername(false);
    } catch (error) {
      console.error('Failed to update username:', error);
      toast.error('Update failed: ' + error.message);
    }
  };

  return (
    <div className="px-6 pb-20">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
      
      {/* User Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🙆‍♀️</span>
          Profile
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <p className="text-gray-900">{currentUser?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            {editingUsername ? (
              <form onSubmit={handleUpdateUsername} className="flex space-x-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter new username"
                  required
                  minLength={2}
                  maxLength={20}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUsername(false);
                    setNewUsername(userProfile?.username || '');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-gray-900">{userProfile?.username || 'Not set'}</p>
                <button
                  onClick={() => setEditingUsername(true)}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Pairing Management */}
      <PairingManager 
        currentUserProfile={userProfile}
        partnerId={partnerId}
      />
    </div>
  );
};

export default SettingsPage;
