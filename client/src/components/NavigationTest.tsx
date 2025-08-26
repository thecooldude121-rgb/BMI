import { navigateTo, testNavigation } from '../utils/navigation';

const NavigationTest = () => {
  const handleNavigation = (path: string) => {
    console.log(`🔄 Navigation test button clicked for: ${path}`);
    const success = navigateTo(path);
    if (!success) {
      alert(`Navigation to ${path} failed. Check console for details.`);
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
      <h4 className="text-sm font-semibold mb-2">Navigation Test</h4>
      <div className="space-y-2">
        <button
          onClick={() => handleNavigation('/crm/deals')}
          className="block w-full text-left px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 transition-colors"
          data-testid="nav-test-deals"
        >
          → Deals
        </button>
        <button
          onClick={() => handleNavigation('/crm/accounts')}
          className="block w-full text-left px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700 transition-colors"
          data-testid="nav-test-accounts"
        >
          → Accounts
        </button>
        <button
          onClick={() => handleNavigation('/analytics')}
          className="block w-full text-left px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 active:bg-purple-700 transition-colors"
          data-testid="nav-test-analytics"
        >
          → Analytics
        </button>
        <button
          onClick={() => {
            console.log('🧪 Running auto navigation test...');
            testNavigation();
          }}
          className="block w-full text-left px-3 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 active:bg-orange-700 transition-colors"
          data-testid="nav-test-auto"
        >
          🧪 Auto Test
        </button>
        <button
          onClick={() => handleNavigation('/crm')}
          className="block w-full text-left px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 active:bg-gray-700 transition-colors"
          data-testid="nav-test-crm"
        >
          → CRM Home
        </button>
      </div>
    </div>
  );
};

export default NavigationTest;