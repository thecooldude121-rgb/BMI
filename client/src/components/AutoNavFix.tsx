import { useEffect } from 'react';

const AutoNavFix = () => {
  useEffect(() => {
    // Auto-fix navigation issues on component mount
    const fixNavigation = () => {
      try {
        console.log('🔧 Auto-fixing navigation issues...');
        
        // Clear all browser storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear service workers
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => registration.unregister());
          });
        }
        
        // Reset history state
        if (window.history?.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        
        console.log('✅ Navigation auto-fix completed');
        
        // Show success message with manual steps
        setTimeout(() => {
          const shouldShowInstructions = !sessionStorage.getItem('nav-fix-shown');
          if (shouldShowInstructions) {
            sessionStorage.setItem('nav-fix-shown', 'true');
            console.log(`
🔧 NAVIGATION FIX APPLIED
If navigation still doesn't work, try these manual steps:

1. Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Select "Cached images and files" and "Cookies and site data"
3. Click Delete/Clear
4. Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac) to hard refresh

Alternative: Open Developer Tools (F12) and right-click the refresh button, then select "Empty Cache and Hard Reload"
            `);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Navigation fix failed:', error);
      }
    };

    // Run immediately
    fixNavigation();
    
    // Also run after a short delay to catch late-loading issues
    const timer = setTimeout(fixNavigation, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything visible
};

export default AutoNavFix;