import React, { useState, useEffect } from 'react';

const FixedKanbanPage: React.FC = () => {
  const [deals] = useState([
    { id: '1', name: 'AWS Migration', stage: 'discovery', value: '$500K', probability: 25 },
    { id: '2', name: 'Apple Enterprise', stage: 'qualification', value: '$750K', probability: 40 },
    { id: '3', name: 'Google Workspace', stage: 'qualification', value: '$300K', probability: 35 },
    { id: '4', name: 'Microsoft Teams', stage: 'proposal', value: '$400K', probability: 60 },
    { id: '5', name: 'Salesforce Integration', stage: 'proposal', value: '$200K', probability: 55 },
    { id: '6', name: 'Oracle Database', stage: 'demo', value: '$600K', probability: 70 },
    { id: '7', name: 'Adobe Creative Suite', stage: 'trial', value: '$150K', probability: 80 },
    { id: '8', name: 'Netflix Enterprise', stage: 'negotiation', value: '$1.2M', probability: 85 },
    { id: '9', name: 'Meta Business Suite', stage: 'closed-won', value: '$800K', probability: 100 },
    { id: '10', name: 'Tesla Energy', stage: 'closed-lost', value: '$2M', probability: 0 }
  ]);

  const stages = [
    { id: 'discovery', title: 'Discovery', color: '#3B82F6' },
    { id: 'qualification', title: 'Qualification', color: '#8B5CF6' },
    { id: 'proposal', title: 'Proposal', color: '#F59E0B' },
    { id: 'demo', title: 'Demo', color: '#6366F1' },
    { id: 'trial', title: 'Trial', color: '#14B8A6' },
    { id: 'negotiation', title: 'Negotiation', color: '#F97316' },
    { id: 'closed-won', title: 'Closed Won', color: '#10B981' },
    { id: 'closed-lost', title: 'Closed Lost', color: '#EF4444' }
  ];

  const dealColumns = stages.map(stage => ({
    ...stage,
    deals: deals.filter(deal => deal.stage === stage.id)
  }));

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Deals Kanban Board
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          All 8 stages • {deals.length} total deals • Fully scrollable
        </p>
      </div>

      {/* Navigation Links */}
      <div style={{ marginBottom: '24px' }}>
        <a 
          href="/crm/deals" 
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            marginRight: '12px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          ← Back to Deals List
        </a>
        <span style={{ color: '#64748b' }}>Click to test navigation</span>
      </div>

      {/* Kanban Board */}
      <div style={{
        width: '100%',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <p style={{ 
            margin: 0, 
            fontWeight: '600', 
            color: '#1e293b'
          }}>
            Scroll horizontally to see all 8 stages →
          </p>
        </div>
        
        <div style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '24px',
          cursor: 'grab'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            width: '2400px',
            minWidth: '2400px'
          }}>
            {dealColumns.map((column, index) => (
              <div 
                key={column.id} 
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  width: '280px',
                  minWidth: '280px',
                  flexShrink: 0,
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Column Header */}
                <div style={{
                  backgroundColor: column.color,
                  color: 'white',
                  padding: '16px',
                  borderRadius: '8px 8px 0 0',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {column.title}
                  </h3>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.875rem',
                    opacity: 0.9
                  }}>
                    {column.deals.length} deals
                  </p>
                </div>

                {/* Deals */}
                <div style={{
                  padding: '16px',
                  minHeight: '400px'
                }}>
                  {column.deals.length > 0 ? (
                    column.deals.map((deal, dealIndex) => (
                      <div 
                        key={deal.id}
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '12px',
                          marginBottom: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.borderColor = column.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <h4 style={{
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {deal.name}
                        </h4>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: column.color
                          }}>
                            {deal.value}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            backgroundColor: '#e2e8f0',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {deal.probability}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      padding: '32px 16px'
                    }}>
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>Test Instructions:</h3>
        <ul style={{ margin: 0, color: '#0c4a6e' }}>
          <li>Try scrolling horizontally in the white area above</li>
          <li>Click the "Back to Deals List" link to test navigation</li>
          <li>Hover over deal cards to see interaction effects</li>
          <li>All 8 stages should be visible with scrolling</li>
        </ul>
      </div>
    </div>
  );
};

export default FixedKanbanPage;