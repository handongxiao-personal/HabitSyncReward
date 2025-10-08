import { useApp } from '../../context/AppContext';

const NavigationTabs = () => {
  const { state, actions } = useApp();
  
  // 根据当前查看的用户决定主题颜色
  const isCurrentUser = state.viewingUser === 'current';
  
  const tabs = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' }
  ];
  
  return (
    <div className="mx-6 mb-6">
      <nav className="flex gap-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => actions.setActiveTab(tab.id)}
            className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all border ${
              state.activeTab === tab.id
                ? `text-white shadow-sm ${isCurrentUser ? 'bg-purple-600 border-purple-600' : ''}`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300'
            }`}
            style={state.activeTab === tab.id && !isCurrentUser ? {
              backgroundColor: '#4169E1',
              borderColor: '#4169E1'
            } : {}}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs;
