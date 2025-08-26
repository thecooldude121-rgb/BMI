// Browser compatibility and navigation fix utilities

export const clearBrowserCache = () => {
  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear cookies if possible
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    console.log('Browser cache cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing browser cache:', error);
    return false;
  }
};

export const forcePageReload = () => {
  try {
    // Force hard reload
    window.location.reload();
  } catch (error) {
    console.error('Error forcing page reload:', error);
  }
};

export const fixNavigationIssues = () => {
  try {
    // Clear any cached route data
    clearBrowserCache();
    
    // Reset any problematic window properties
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    console.log('Navigation issues fixed');
    return true;
  } catch (error) {
    console.error('Error fixing navigation:', error);
    return false;
  }
};

export const debugNavigationState = () => {
  console.log('=== Navigation Debug Info ===');
  console.log('Current URL:', window.location.href);
  console.log('Pathname:', window.location.pathname);
  console.log('Search:', window.location.search);
  console.log('Hash:', window.location.hash);
  console.log('User Agent:', navigator.userAgent);
  console.log('Local Storage Keys:', Object.keys(localStorage));
  console.log('Session Storage Keys:', Object.keys(sessionStorage));
  console.log('Cookies:', document.cookie);
  console.log('History Length:', window.history.length);
  console.log('=== End Debug Info ===');
};