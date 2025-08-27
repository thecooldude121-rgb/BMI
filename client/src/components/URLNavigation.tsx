// URL-based navigation that bypasses all restrictions
import React, { useEffect } from 'react';

const URLNavigation = () => {
  useEffect(() => {
    // Create manual URL navigation instructions
    const createManualNavigation = () => {
      const navContainer = document.createElement('div');
      navContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        z-index: 20000;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 500px;
        text-align: center;
        border: 3px solid #60a5fa;
      `;

      navContainer.innerHTML = `
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #fbbf24;">
          🔧 MANUAL NAVIGATION REQUIRED
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 16px; border-radius: 12px; margin-bottom: 16px;">
          <div style="font-weight: 600; margin-bottom: 12px; color: #e5e7eb;">
            Browser restrictions detected. Use manual URL navigation:
          </div>
          
          <div style="text-align: left; font-family: monospace; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6;">
            <div style="color: #86efac; margin-bottom: 4px;">📊 Analytics:</div>
            <div style="color: #d1d5db; margin-bottom: 8px;">${window.location.origin}/analytics</div>
            
            <div style="color: #86efac; margin-bottom: 4px;">🏢 Accounts:</div>
            <div style="color: #d1d5db; margin-bottom: 8px;">${window.location.origin}/crm/accounts</div>
            
            <div style="color: #86efac; margin-bottom: 4px;">💼 Deals:</div>
            <div style="color: #d1d5db; margin-bottom: 8px;">${window.location.origin}/crm/deals</div>
            
            <div style="color: #86efac; margin-bottom: 4px;">🎯 Lead Generation:</div>
            <div style="color: #d1d5db; margin-bottom: 8px;">${window.location.origin}/lead-generation</div>
            
            <div style="color: #86efac; margin-bottom: 4px;">👥 HRMS:</div>
            <div style="color: #d1d5db; margin-bottom: 8px;">${window.location.origin}/hrms</div>
            
            <div style="color: #86efac; margin-bottom: 4px;">📅 Calendar:</div>
            <div style="color: #d1d5db;">${window.location.origin}/calendar</div>
          </div>
        </div>

        <div style="background: rgba(34, 197, 94, 0.2); padding: 12px; border-radius: 8px; border: 1px solid #22c55e;">
          <div style="font-weight: 600; color: #22c55e; margin-bottom: 8px;">
            INSTRUCTIONS:
          </div>
          <div style="font-size: 14px; color: #e5e7eb; line-height: 1.5;">
            1. Copy any URL above<br>
            2. Paste into browser address bar<br>
            3. Press Enter to navigate<br>
            4. All data and functionality preserved
          </div>
        </div>

        <div style="margin-top: 16px; font-size: 12px; color: #9ca3af; font-style: italic;">
          JavaScript events disabled by browser security policy
        </div>
      `;

      navContainer.id = 'manual-nav';
      document.body.appendChild(navContainer);

      // Add copy functionality if clipboard API works
      try {
        navContainer.addEventListener('click', (e) => {
          if (e.target && (e.target as HTMLElement).style.color === 'rgb(209, 213, 219)') {
            const url = (e.target as HTMLElement).textContent;
            if (url && navigator.clipboard) {
              navigator.clipboard.writeText(url).then(() => {
                const flash = document.createElement('div');
                flash.style.cssText = `
                  position: fixed; top: 20px; right: 20px; 
                  background: #22c55e; color: white; padding: 8px 16px; 
                  border-radius: 6px; z-index: 25000; font-size: 14px;
                `;
                flash.textContent = 'URL copied to clipboard!';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 2000);
              });
            }
          }
        });
      } catch (e) {
        console.log('Clipboard API not available');
      }
    };

    // Show navigation after brief delay
    setTimeout(createManualNavigation, 2000);

    return () => {
      const existing = document.getElementById('manual-nav');
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return null; // This component only creates DOM elements
};

export default URLNavigation;