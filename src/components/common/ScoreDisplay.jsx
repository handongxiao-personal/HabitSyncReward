import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const ScoreDisplay = () => {
  const { state } = useApp();
  const { userProfile } = useAuth();
  
  const currentUserData = state.viewingUser === 'current' 
    ? state.currentUserData 
    : state.otherUserData;
    
  const displayName = state.viewingUser === 'current' 
    ? (userProfile?.username || 'Me')
    : (state.partnerProfile?.username || 'Partner');
  
  return (
    <div className="mx-6 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {/* Left purple gradient bar */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-purple-500 to-purple-600"></div>
        
        <div className="flex items-center justify-between p-6">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Total Score
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {currentUserData.score}
            </div>
            <div className="text-sm text-gray-500">
              {displayName}
            </div>
          </div>
          
          {/* Top right chart icon */}
          <div className="bg-purple-100 p-3 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
