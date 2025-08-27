// Direct window navigation bypassing all event systems
import React, { useEffect } from 'react';

const WindowNavigation = () => {
  useEffect(() => {
    // Direct window navigation function
    const navigateDirectly = (path: string) => {
      console.log(`Direct navigation to: ${path}`);
      window.location.href = path;
    };

    // Auto-navigation functions that bypass events completely
    const createNavigationLinks = () => {
      const navContainer = document.createElement('div');
      navContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1f2937;
        color: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 15000;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 300px;
      `;

      navContainer.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 12px; color: #f59e0b; font-size: 14px;">🧭 WORKING NAVIGATION</div>
        <div style="display: grid; gap: 6px;">
          <a href="/analytics" style="color: #60a5fa; text-decoration: none; padding: 10px; border: 2px solid #374151; border-radius: 8px; display: block; text-align: center; transition: all 0.2s; font-weight: 500; background: rgba(96, 165, 250, 0.1);">📊 Analytics</a>
          <a href="/crm/accounts" style="color: #60a5fa; text-decoration: none; padding: 10px; border: 2px solid #374151; border-radius: 8px; display: block; text-align: center; transition: all 0.2s; font-weight: 500; background: rgba(96, 165, 250, 0.1);">🏢 Accounts</a>
          <a href="/crm/deals" style="color: #60a5fa; text-decoration: none; padding: 10px; border: 2px solid #374151; border-radius: 8px; display: block; text-align: center; transition: all 0.2s; font-weight: 500; background: rgba(96, 165, 250, 0.1);">💼 Deals</a>
          <a href="/lead-generation" style="color: #60a5fa; text-decoration: none; padding: 10px; border: 2px solid #374151; border-radius: 8px; display: block; text-align: center; transition: all 0.2s; font-weight: 500; background: rgba(96, 165, 250, 0.1);">🎯 Lead Gen</a>
          <a href="/hrms" style="color: #60a5fa; text-decoration: none; padding: 10px; border: 2px solid #374151; border-radius: 8px; display: block; text-align: center; transition: all 0.2s; font-weight: 500; background: rgba(96, 165, 250, 0.1);">👥 HRMS</a>
          <a href="/calendar" style="color: #60a5fa; text-decoration: none; padding: 10px; border: 2px solid #374151; border-radius: 8px; display: block; text-align: center; transition: all 0.2s; font-weight: 500; background: rgba(96, 165, 250, 0.1);">📅 Calendar</a>
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #374151; font-size: 11px; color: #10b981; text-align: center;">
          ✅ HTML Links Working - No JS Required
        </div>
      `;

      // Add hover effects via CSS
      const style = document.createElement('style');
      style.textContent = `
        #direct-nav a:hover {
          background-color: rgba(96, 165, 250, 0.2) !important;
          border-color: #60a5fa !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(96, 165, 250, 0.3);
        }
      `;
      document.head.appendChild(style);
      navContainer.id = 'direct-nav';

      document.body.appendChild(navContainer);
    };

    // Create navigation after a delay to ensure DOM is ready
    setTimeout(createNavigationLinks, 1000);

    return () => {
      const existing = document.getElementById('direct-nav');
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return (
    <div className="fixed top-80 left-1/2 transform -translate-x-1/2 z-[14000] bg-orange-100 border-2 border-orange-600 rounded-lg p-4 shadow-xl">
      <h3 className="font-bold text-orange-800 mb-2">WINDOW NAVIGATION</h3>
      <p className="text-sm text-orange-700 mb-2">
        HTML links appear bottom-right
      </p>
      <div className="text-xs text-orange-600">
        Direct window.location.href navigation
      </div>
    </div>
  );
};

export default WindowNavigation;