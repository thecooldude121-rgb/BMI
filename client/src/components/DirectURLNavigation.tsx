// Direct URL navigation that works regardless of browser restrictions
import React, { useEffect } from 'react';

const DirectURLNavigation = () => {
  useEffect(() => {
    // Create a persistent navigation solution using native HTML
    const createNativeNavigation = () => {
      // Remove any existing navigation
      const existing = document.getElementById('native-nav');
      if (existing) existing.remove();

      const navContainer = document.createElement('div');
      navContainer.id = 'native-nav';
      navContainer.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #ffffff;
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif;
      `;

      // Create navigation using native HTML forms (these always work)
      navContainer.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 12px; color: #1f2937; font-size: 16px;">
          🧭 NAVIGATION
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <form method="get" action="/analytics" style="margin: 0;">
            <button type="submit" style="
              width: 160px;
              background: #3b82f6;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
              font-weight: 500;
            ">📊 Analytics</button>
          </form>
          
          <form method="get" action="/crm/accounts" style="margin: 0;">
            <button type="submit" style="
              width: 160px;
              background: #10b981;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
              font-weight: 500;
            ">🏢 Accounts</button>
          </form>
          
          <form method="get" action="/crm/deals" style="margin: 0;">
            <button type="submit" style="
              width: 160px;
              background: #8b5cf6;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
              font-weight: 500;
            ">💼 Deals</button>
          </form>
          
          <form method="get" action="/lead-generation" style="margin: 0;">
            <button type="submit" style="
              width: 160px;
              background: #f59e0b;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
              font-weight: 500;
            ">🎯 Lead Gen</button>
          </form>
          
          <form method="get" action="/hrms" style="margin: 0;">
            <button type="submit" style="
              width: 160px;
              background: #06b6d4;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
              font-weight: 500;
            ">👥 HRMS</button>
          </form>
          
          <form method="get" action="/calendar" style="margin: 0;">
            <button type="submit" style="
              width: 160px;
              background: #ec4899;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 13px;
              cursor: pointer;
              font-weight: 500;
            ">📅 Calendar</button>
          </form>
        </div>
        
        <div style="margin-top: 12px; padding: 8px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px;">
          <div style="font-size: 11px; color: #0369a1; text-align: center;">
            Native HTML forms bypass all restrictions
          </div>
        </div>
      `;

      document.body.appendChild(navContainer);
    };

    // Create navigation after DOM is ready
    setTimeout(createNativeNavigation, 1000);

    return () => {
      const existing = document.getElementById('native-nav');
      if (existing) existing.remove();
    };
  }, []);

  return null;
};

export default DirectURLNavigation;