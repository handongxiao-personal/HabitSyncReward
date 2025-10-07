import { useApp } from '../../context/AppContext';

const NavigationTabs = () => {
  const { state, actions } = useApp();
  
  const tabs = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' }
  ];
  
  return (
    <div className="px-6 mb-6">
      <nav className="flex space-x-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => actions.setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
              state.activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs;
