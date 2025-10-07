import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

// Import components
import Header from './components/common/Header';
import UserSwitcher from './components/common/UserSwitcher';
import ScoreDisplay from './components/common/ScoreDisplay';
import NavigationTabs from './components/common/NavigationTabs';
import FloatingActionButton from './components/common/FloatingActionButton';
import AuthStatus from './components/auth/AuthStatus';
import ToastContainer from './components/common/Toast';
import FirebaseDebug from './components/common/FirebaseDebug';
import ConfigWarning from './components/common/ConfigWarning';
import PersistenceTest from './components/common/PersistenceTest';

// Import content components
import TaskManager from './components/tasks/TaskManager';
import RewardManager from './components/rewards/RewardManager';
import ActivityTimeline from './components/activity/ActivityTimeline';
import SettingsPage from './components/settings/SettingsPage';

// Main App Content
const AppContent = () => {
  const { state, actions } = useApp();

  // Render content based on active tab
  const renderContent = () => {
    switch (state.activeTab) {
      case 'tasks':
        return <TaskManager onFloatingButtonClick={handleFloatingButtonClick} />;
      case 'rewards':
        return <RewardManager onFloatingButtonClick={handleFloatingButtonClick} />;
      case 'activity':
        return <ActivityTimeline />;
      case 'settings':
        return <SettingsPage />;
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
    <AuthStatus>
      <div className={`min-h-screen ${state.isDarkMode ? 'dark' : ''}`}>
        {/* Configuration Warning */}
        <ConfigWarning />
        
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
          
          {/* Floating Action Button - 不在设置页面和查看伙伴数据时显示 */}
          {state.activeTab !== 'settings' && state.viewingUser === 'current' && (
            <FloatingActionButton 
              onAddClick={handleFloatingButtonClick}
            />
          )}
          
          {/* Toast Notifications */}
          <ToastContainer />
          
          {/* Firebase Debug (开发环境) */}
          <FirebaseDebug />
          
          {/* Persistence Test */}
          <PersistenceTest />
        </div>
      </div>
    </AuthStatus>
  );
};

// App with Providers
const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
