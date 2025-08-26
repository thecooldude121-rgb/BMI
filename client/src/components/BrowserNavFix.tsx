import { useState } from 'react';
import { clearBrowserCache, debugNavigationState } from '../utils/browserFix';

const BrowserNavFix = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClearCache = () => {
    const success = clearBrowserCache();
    if (success) {
      alert('Browser cache cleared! The page will reload automatically.');
      // Force a hard reload with cache bypass
      window.location.reload();
    } else {
      alert('Failed to clear cache. Please manually clear your browser cache using Ctrl+Shift+Delete.');
    }
  };

  const handleHardReload = () => {
    // Force hard reload bypassing cache
    window.location.href = window.location.href + '?v=' + Date.now();
  };

  const handleResetApp = () => {
    // Clear everything and go to home
    clearBrowserCache();
    window.location.href = '/';
  };

  const handleDebugInfo = () => {
    debugNavigationState();
    alert('Debug info logged to console. Press F12 to view.');
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDialog(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg"
          title="Navigation Issues? Click for help"
        >
          🔧 Nav Fix
        </button>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Navigation Issues?</h3>
            <p className="text-gray-600 mb-4">
              If navigation is not working in normal browser mode but works in incognito, 
              try these fixes:
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleClearCache}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Clear Cache & Reload
              </button>
              
              <button
                onClick={handleHardReload}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Hard Reload (Bypass Cache)
              </button>
              
              <button
                onClick={handleResetApp}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
              >
                Reset App & Go Home
              </button>
              
              <button
                onClick={handleDebugInfo}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Debug Info (Console)
              </button>
              
              <div className="text-sm text-gray-500 mt-4">
                <p><strong>Manual Steps:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Press Ctrl+Shift+Delete (or Cmd+Shift+Delete)</li>
                  <li>Clear "Cached images and files"</li>
                  <li>Clear "Cookies and other site data"</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            </div>
            
            <button
              onClick={() => setShowDialog(false)}
              className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BrowserNavFix;