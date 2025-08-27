// Keyboard-based navigation for bypassing click restrictions
import React, { useEffect } from 'react';

const KeyboardNavigation = () => {
  useEffect(() => {
    const createKeyboardNav = () => {
      const navContainer = document.createElement('div');
      navContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #0f172a;
        color: white;
        padding: 20px;
        border-radius: 12px;
        border: 2px solid #3b82f6;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        z-index: 10000;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 320px;
        font-size: 14px;
      `;

      navContainer.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 16px; color: #60a5fa; font-size: 16px;">
          ⌨️ KEYBOARD NAVIGATION
        </div>
        
        <div style="background: rgba(59, 130, 246, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <div style="font-weight: 600; margin-bottom: 8px; color: #fbbf24;">PRESS THESE KEYS:</div>
          <div style="line-height: 1.6; color: #e2e8f0;">
            <div><span style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #60a5fa;">1</span> Analytics Dashboard</div>
            <div><span style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #60a5fa;">2</span> Accounts Module</div>
            <div><span style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #60a5fa;">3</span> Deals Management</div>
            <div><span style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #60a5fa;">4</span> Lead Generation</div>
            <div><span style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #60a5fa;">5</span> HRMS Module</div>
            <div><span style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #60a5fa;">6</span> Calendar</div>
          </div>
        </div>

        <div style="background: rgba(34, 197, 94, 0.1); padding: 10px; border-radius: 6px; border: 1px solid #22c55e;">
          <div style="color: #22c55e; font-size: 12px; text-align: center;">
            Press any number key to navigate instantly
          </div>
        </div>
      `;

      navContainer.id = 'keyboard-nav';
      document.body.appendChild(navContainer);
    };

    // Keyboard event handler
    const handleKeyPress = (event: KeyboardEvent) => {
      const routes = {
        '1': '/analytics',
        '2': '/crm/accounts', 
        '3': '/crm/deals',
        '4': '/lead-generation',
        '5': '/hrms',
        '6': '/calendar'
      };

      const route = routes[event.key as keyof typeof routes];
      if (route) {
        console.log(`Navigating to: ${route}`);
        window.location.href = route;
      }
    };

    // Add keyboard listener
    document.addEventListener('keydown', handleKeyPress);
    
    // Create navigation UI
    setTimeout(createKeyboardNav, 1000);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      const existing = document.getElementById('keyboard-nav');
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return null;
};

export default KeyboardNavigation;