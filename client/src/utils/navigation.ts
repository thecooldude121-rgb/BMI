// Direct navigation utilities that bypass router issues completely
export const navigateTo = (path: string) => {
  console.log(`🚀 DIRECT NAVIGATION ATTEMPT: ${path}`);
  console.log(`🌍 Current location: ${window.location.href}`);
  
  try {
    // Force immediate navigation
    window.location.href = path;
    console.log(`✅ Navigation command executed for: ${path}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Navigation error:`, error);
    // Emergency fallback
    window.location.replace(path);
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
  console.log('🧪 Starting navigation test sequence...');
  alert('Auto test will navigate through pages. Check console for details.');
  
  const testPaths = ['/analytics', '/crm/deals', '/crm/accounts'];
  let currentIndex = 0;
  
  const runNextTest = () => {
    if (currentIndex >= testPaths.length) {
      console.log('✅ Navigation test sequence completed');
      return;
    }
    
    const path = testPaths[currentIndex];
    console.log(`🧪 Test ${currentIndex + 1}/${testPaths.length}: Navigating to ${path}`);
    navigateTo(path);
    currentIndex++;
    
    // Continue to next test after 3 seconds
    setTimeout(runNextTest, 3000);
  };
  
  runNextTest();
};