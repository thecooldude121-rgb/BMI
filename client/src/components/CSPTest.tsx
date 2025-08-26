// Test for Content Security Policy issues
import React, { useEffect, useState } from 'react';

const CSPTest = () => {
  const [diagnostics, setDiagnostics] = useState<string[]>([]);

  useEffect(() => {
    const results: string[] = [];
    
    // Test 1: Basic console output
    try {
      console.log('CSP TEST: Console logging works');
      results.push('✅ Console logging: OK');
    } catch (e) {
      results.push('❌ Console logging: BLOCKED');
    }

    // Test 2: DOM manipulation
    try {
      const testDiv = document.createElement('div');
      testDiv.style.display = 'none';
      document.body.appendChild(testDiv);
      document.body.removeChild(testDiv);
      results.push('✅ DOM manipulation: OK');
    } catch (e) {
      results.push('❌ DOM manipulation: BLOCKED');
    }

    // Test 3: Event listeners
    try {
      const tempBtn = document.createElement('button');
      tempBtn.addEventListener('click', () => {});
      results.push('✅ Event listeners: OK');
    } catch (e) {
      results.push('❌ Event listeners: BLOCKED');
    }

    // Test 4: Inline styles
    try {
      const testEl = document.createElement('div');
      testEl.style.cssText = 'color: red;';
      results.push('✅ Inline styles: OK');
    } catch (e) {
      results.push('❌ Inline styles: BLOCKED');
    }

    // Test 5: Check CSP headers
    try {
      const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
      if (metaTags.length > 0) {
        results.push(`⚠️  CSP meta found: ${metaTags.length} tags`);
      } else {
        results.push('✅ No CSP meta tags');
      }
    } catch (e) {
      results.push('❌ CSP check failed');
    }

    setDiagnostics(results);
  }, []);

  return (
    <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-[12000] bg-purple-100 border-2 border-purple-600 rounded-lg p-4 shadow-xl max-w-md">
      <h3 className="font-bold text-purple-800 mb-2">CSP DIAGNOSTICS</h3>
      <div className="text-xs space-y-1">
        {diagnostics.map((result, index) => (
          <div key={index} className="text-purple-700 font-mono">
            {result}
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-purple-50 rounded text-xs">
        <strong>Next:</strong> Check browser console for CSP violations
      </div>
    </div>
  );
};

export default CSPTest;