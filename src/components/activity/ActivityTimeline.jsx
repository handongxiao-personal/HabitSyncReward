import { useApp } from '../../context/AppContext';
import ActivityItem from './ActivityItem';

const ActivityTimeline = () => {
  const { state } = useApp();
  
  const currentUserData = state.viewingUser === 'current' 
    ? state.currentUserData 
    : state.otherUserData;
  
  return (
    <div className="px-6 pb-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🕒</span>
          Activity History
        </h2>
        
        {currentUserData.activities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 mb-2">No activities yet</p>
            <p className="text-sm text-gray-400">Complete tasks to see your activity history</p>
          </div>
        )}
        
        <div className="space-y-4">
          {currentUserData.activities.map(activity => (
            <ActivityItem 
              key={activity.id}
              activity={activity}
              onDelete={(activityId) => {
                console.log('Activity deleted:', activityId);
                // Toast notification would go here
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
