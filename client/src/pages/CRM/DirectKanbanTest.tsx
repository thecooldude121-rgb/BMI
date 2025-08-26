import React from 'react';

// Direct test component - bypass all routing complexity
const DirectKanbanTest: React.FC = () => {
  console.log('DirectKanbanTest component mounted directly');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          color: 'white', 
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          margin: '0 0 20px 0'
        }}>
          🎯 DIRECT KANBAN TEST - SUCCESS!
        </h1>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>
          This proves the component system works - routing is the issue
        </p>
      </div>
      
      <div style={{ 
        width: '100%',
        overflowX: 'auto',
        border: '2px solid white',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          width: 'calc(8 * 300px + 7 * 20px)',
          minWidth: 'calc(8 * 300px + 7 * 20px)'
        }}>
        {/* All 8 Stages */}
        {[
          { name: 'Discovery', color: '#3B82F6', deals: ['AWS Migration - $500K'] },
          { name: 'Qualification', color: '#8B5CF6', deals: ['Apple Enterprise - $750K', 'Google Workspace - $300K'] },
          { name: 'Proposal', color: '#F59E0B', deals: ['Microsoft Teams - $400K', 'Salesforce Integration - $200K'] },
          { name: 'Demo', color: '#6366F1', deals: ['Oracle Database - $600K'] },
          { name: 'Trial', color: '#14B8A6', deals: ['Adobe Creative Suite - $150K'] },
          { name: 'Negotiation', color: '#F97316', deals: ['Netflix Enterprise - $1.2M'] },
          { name: 'Closed Won', color: '#10B981', deals: ['Meta Business Suite - $800K'] },
          { name: 'Closed Lost', color: '#EF4444', deals: ['Tesla Energy - $2M'] }
        ].map((stage, index) => (
          <div key={index} style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: '12px',
            padding: '20px',
            minHeight: '400px',
            minWidth: '300px',
            width: '300px',
            flexShrink: 0,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{
              color: stage.color,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              marginBottom: '15px',
              textAlign: 'center',
              borderBottom: `3px solid ${stage.color}`,
              paddingBottom: '10px'
            }}>
              {stage.name}
            </h3>
            
            {stage.deals.map((deal, dealIndex) => (
              <div key={dealIndex} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: `2px solid ${stage.color}20`
              }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '5px'
                }}>
                  {deal}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6B7280'
                }}>
                  Stage {index + 1} of 8
                </div>
              </div>
            ))}
          </div>
        ))}
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px',
        color: 'white'
      }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
          ✅ All 8 stages displayed successfully
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          Total: 10 deals across Discovery → Qualification → Proposal → Demo → Trial → Negotiation → Closed Won → Closed Lost
        </p>
      </div>
    </div>
  );
};

export default DirectKanbanTest;