import { navigateTo, testNavigation } from '../utils/navigation';

const NavigationTest = () => {
  const handleNavigation = (path: string) => {
    console.log(`🔄 Navigation test button clicked for: ${path}`);
    console.log(`Current location: ${window.location.pathname}`);
    
    // Multiple fallback navigation methods
    try {
      console.log(`Method 1: Direct window.location.href to: ${path}`);
      window.location.href = window.location.origin + path;
      return;
    } catch (error1) {
      console.error(`Method 1 failed:`, error1);
      
      try {
        console.log(`Method 2: Using window.location.assign to: ${path}`);
        window.location.assign(window.location.origin + path);
        return;
      } catch (error2) {
        console.error(`Method 2 failed:`, error2);
        
        try {
          console.log(`Method 3: Using window.open with _self to: ${path}`);
          window.open(window.location.origin + path, '_self');
          return;
        } catch (error3) {
          console.error(`Method 3 failed:`, error3);
          alert(`All navigation methods failed for ${path}. Check browser console for details.`);
        }
      }
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 bg-white border-2 border-red-500 rounded-lg p-4 shadow-lg">
      <h4 className="text-sm font-semibold mb-2 text-red-600">🧪 Navigation Test Panel</h4>
      <p className="text-xs text-gray-500 mb-2">Click buttons to test navigation</p>
      <div className="space-y-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNavigation('/crm/deals');
          }}
          className="block w-full text-left px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 transition-colors cursor-pointer"
          data-testid="nav-test-deals"
          type="button"
        >
          → Deals
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNavigation('/crm/accounts');
          }}
          className="block w-full text-left px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700 transition-colors cursor-pointer"
          data-testid="nav-test-accounts"
          type="button"
        >
          → Accounts
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNavigation('/analytics');
          }}
          className="block w-full text-left px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 active:bg-purple-700 transition-colors cursor-pointer"
          data-testid="nav-test-analytics"
          type="button"
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