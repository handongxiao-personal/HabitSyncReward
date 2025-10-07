import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { demoCurrentUserData, demoOtherUserData } from './utils/demoData';

// Import components
import Header from './components/common/Header';
import UserSwitcher from './components/common/UserSwitcher';
import ScoreDisplay from './components/common/ScoreDisplay';
import NavigationTabs from './components/common/NavigationTabs';
import FloatingActionButton from './components/common/FloatingActionButton';

// Import content components
import TaskManager from './components/tasks/TaskManager';
import RewardManager from './components/rewards/RewardManager';
import ActivityTimeline from './components/activity/ActivityTimeline';

// Main App Content
const AppContent = () => {
  const { state, actions } = useApp();

  // Load demo data on component mount
  useEffect(() => {
    actions.setLoading('tasks', true);
    actions.setLoading('rewards', true);
    actions.setLoading('activities', true);
    
    // Simulate loading delay
    setTimeout(() => {
      actions.updateUserData('currentUserData', demoCurrentUserData);
      actions.updateUserData('otherUserData', demoOtherUserData);
      
      actions.setLoading('tasks', false);
      actions.setLoading('rewards', false);
      actions.setLoading('activities', false);
    }, 1000);
  }, []);

  // Render content based on active tab
  const renderContent = () => {
    switch (state.activeTab) {
      case 'tasks':
        return <TaskManager onFloatingButtonClick={handleFloatingButtonClick} />;
      case 'rewards':
        return <RewardManager onFloatingButtonClick={handleFloatingButtonClick} />;
      case 'activity':
        return <ActivityTimeline />;
      default:
        return <TaskManager onFloatingButtonClick={handleFloatingButtonClick} />;
    }
  };
  
  // 处理浮动按钮点击
  const handleFloatingButtonClick = () => {
    switch (state.activeTab) {
      case 'tasks':
        actions.showTaskModal();
        break;
      case 'rewards':
        actions.showRewardModal();
        break;
      default:
        console.log('No action for', state.activeTab);
    }
  };

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />
        
        {/* User Switcher */}
        <UserSwitcher />
        
        {/* Score Display */}
        <ScoreDisplay />
        
        {/* Navigation Tabs */}
        <NavigationTabs />
        
        {/* Main Content */}
        <main>
          {renderContent()}
        </main>
        
        {/* Floating Action Button */}
        <FloatingActionButton 
          onAddClick={handleFloatingButtonClick}
        />
      </div>
    </div>
  );
};

// App with Provider
const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
