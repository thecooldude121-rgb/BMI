import React from 'react';

const PureHTMLTest: React.FC = () => {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Pure HTML Navigation & Scroll Test</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f5f5f5; 
            }
            .container { 
              max-width: 1200px; 
              margin: 0 auto; 
            }
            .nav-section {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .nav-link {
              display: inline-block;
              padding: 12px 24px;
              background: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 5px;
              transition: background 0.2s;
            }
            .nav-link:hover {
              background: #0056b3;
            }
            .scroll-container {
              background: white;
              border: 3px solid #007bff;
              border-radius: 8px;
              padding: 20px;
              overflow-x: auto;
              overflow-y: hidden;
              margin-top: 20px;
            }
            .scroll-content {
              display: flex;
              gap: 15px;
              width: 1200px;
              min-width: 1200px;
            }
            .scroll-item {
              min-width: 120px;
              height: 150px;
              background: linear-gradient(45deg, #667eea, #764ba2);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              font-weight: bold;
              border-radius: 8px;
              flex-shrink: 0;
            }
            .instructions {
              background: #e3f2fd;
              border: 1px solid #2196f3;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>PURE HTML INTERACTION TEST</h1>
            <p>This bypasses React and all JavaScript frameworks</p>
            
            <div class="nav-section">
              <h2>Navigation Test:</h2>
              <a href="/crm/deals" class="nav-link">Go to Deals List</a>
              <a href="/crm" class="nav-link">Go to CRM Home</a>
              <a href="/crm/deals/kanban" class="nav-link">Go to Kanban</a>
              <button onclick="window.location.href='/crm/deals'" class="nav-link" style="border: none; cursor: pointer;">
                JS Navigation
              </button>
            </div>

            <div class="nav-section">
              <h2>Scroll Test:</h2>
              <p>Try scrolling horizontally in the blue bordered area below:</p>
              
              <div class="scroll-container">
                <div class="scroll-content">
                  <div class="scroll-item">Stage 1<br>Discovery</div>
                  <div class="scroll-item">Stage 2<br>Qualification</div>
                  <div class="scroll-item">Stage 3<br>Proposal</div>
                  <div class="scroll-item">Stage 4<br>Demo</div>
                  <div class="scroll-item">Stage 5<br>Trial</div>
                  <div class="scroll-item">Stage 6<br>Negotiation</div>
                  <div class="scroll-item">Stage 7<br>Closed Won</div>
                  <div class="scroll-item">Stage 8<br>Closed Lost</div>
                </div>
              </div>
            </div>

            <div class="instructions">
              <h3>Test Instructions:</h3>
              <ul>
                <li><strong>Navigation:</strong> Click any of the blue navigation links above</li>
                <li><strong>Scrolling:</strong> Use mouse wheel or drag the scrollbar in the blue area</li>
                <li><strong>Expected:</strong> Links should navigate, scrolling should show all 8 stages</li>
                <li><strong>If this doesn't work:</strong> The issue is browser/extension level, not JavaScript</li>
              </ul>
            </div>
          </div>
          
          <script>
            console.log('Pure HTML test loaded successfully');
            
            // Test scroll event
            document.querySelector('.scroll-container').addEventListener('scroll', function(e) {
              console.log('Scroll detected! ScrollLeft:', e.target.scrollLeft);
            });
            
            // Test click events
            document.querySelectorAll('.nav-link').forEach(link => {
              link.addEventListener('click', function(e) {
                console.log('Navigation link clicked:', e.target.textContent);
              });
            });
          </script>
        </body>
        </html>
      `
    }} />
  );
};

export default PureHTMLTest;