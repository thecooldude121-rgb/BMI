// Direct navigation utilities that bypass router issues completely
export const navigateTo = (path: string) => {
  try {
    console.log(`🔄 Attempting navigation to: ${path}`);
    
    // Method 1: Force complete page reload - most reliable
    window.location.href = path;
    console.log(`✅ Navigation initiated to: ${path}`);
    return true;
    
  } catch (error) {
    console.error('Navigation failed:', error);
    // Fallback: Try again with a slight delay
    setTimeout(() => {
      window.location.href = path;
    }, 100);
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