// Direct navigation utilities that bypass router issues
export const navigateTo = (path: string) => {
  try {
    // Method 1: Use history API directly
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', path);
      // Trigger a popstate event to update the UI
      window.dispatchEvent(new PopStateEvent('popstate'));
      console.log(`✅ Navigated to: ${path}`);
      return true;
    }
    
    // Method 2: Fallback to location change
    window.location.href = path;
    return true;
  } catch (error) {
    console.error('Navigation failed:', error);
    // Method 3: Force location change as last resort
    window.location.href = path;
    return false;
  }
};

export const createNavigationHandler = (path: string) => {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(path);
  };
};

// Test navigation function
export const testNavigation = () => {
  console.log('🧪 Testing navigation...');
  const testPaths = ['/crm/deals', '/crm/accounts', '/analytics'];
  
  testPaths.forEach((path, index) => {
    setTimeout(() => {
      console.log(`Testing navigation to: ${path}`);
      navigateTo(path);
    }, index * 1000);
  });
};