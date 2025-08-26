import { navigateTo, testNavigation } from '../utils/navigation';

const NavigationTest = () => {
  return (
    <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <h4 className="text-sm font-semibold mb-2">Navigation Test</h4>
      <div className="space-y-2">
        <button
          onClick={() => navigateTo('/crm/deals')}
          className="block w-full text-left px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          → Deals
        </button>
        <button
          onClick={() => navigateTo('/crm/accounts')}
          className="block w-full text-left px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        >
          → Accounts
        </button>
        <button
          onClick={() => navigateTo('/analytics')}
          className="block w-full text-left px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          → Analytics
        </button>
        <button
          onClick={testNavigation}
          className="block w-full text-left px-3 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          🧪 Auto Test
        </button>
      </div>
    </div>
  );
};

export default NavigationTest;