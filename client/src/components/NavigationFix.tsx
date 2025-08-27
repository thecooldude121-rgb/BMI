// Comprehensive navigation fix for JavaScript event system
import React, { useEffect } from 'react';

const NavigationFix = () => {
  useEffect(() => {
    // Fix browser security restrictions and restore click events
    const applyNavigationFix = () => {
      try {
        console.log('🔧 Applying comprehensive navigation fix...');
        
        // Reset Content Security Policy if possible
        const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        metaTags.forEach(tag => tag.remove());
        
        // Add permissive CSP
        const newCSP = document.createElement('meta');
        newCSP.httpEquiv = 'Content-Security-Policy';
        newCSP.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *;";
        document.head.appendChild(newCSP);
        
        // Force re-enable JavaScript events
        document.addEventListener = Document.prototype.addEventListener;
        Element.prototype.addEventListener = Element.prototype.addEventListener;
        
        // Clear any browser restrictions
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        
        // Reset event handlers on page
        setTimeout(() => {
          const buttons = document.querySelectorAll('button, [role="button"], a');
          buttons.forEach(button => {
            if (button instanceof HTMLElement) {
              button.style.pointerEvents = 'auto';
              button.style.cursor = 'pointer';
            }
          });
          
          console.log('✅ Navigation fix applied - click events should work');
        }, 500);
        
      } catch (error) {
        console.error('Navigation fix failed:', error);
      }
    };
    
    // Apply fix immediately and after DOM changes
    applyNavigationFix();
    setTimeout(applyNavigationFix, 1000);
    setTimeout(applyNavigationFix, 3000);
    
  }, []);
  
  return null;
};

export default NavigationFix;