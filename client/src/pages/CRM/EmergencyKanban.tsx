import React, { useState, useEffect } from 'react';

// Emergency working Kanban with minimal dependencies
const EmergencyKanban: React.FC = () => {
  const [deals] = useState([
    { id: '1', name: 'AWS Migration', stage: 'discovery', value: '$500K' },
    { id: '2', name: 'Apple Enterprise', stage: 'qualification', value: '$750K' },
    { id: '3', name: 'Google Workspace', stage: 'qualification', value: '$300K' },
    { id: '4', name: 'Microsoft Teams', stage: 'proposal', value: '$400K' },
    { id: '5', name: 'Salesforce Integration', stage: 'proposal', value: '$200K' },
    { id: '6', name: 'Oracle Database', stage: 'negotiation', value: '$600K' },
    { id: '7', name: 'Adobe Creative Suite', stage: 'proposal', value: '$150K' },
    { id: '8', name: 'Netflix Enterprise', stage: 'negotiation', value: '$1.2M' },
    { id: '9', name: 'Meta Business Suite', stage: 'closed-won', value: '$800K' },
    { id: '10', name: 'Tesla Energy', stage: 'closed-lost', value: '$2M' }
  ]);

  const stages = [
    { id: 'discovery', title: 'Discovery', color: '#3B82F6' },
    { id: 'qualification', title: 'Qualification', color: '#8B5CF6' },
    { id: 'proposal', title: 'Proposal', color: '#F59E0B' },
    { id: 'negotiation', title: 'Negotiation', color: '#F97316' },
    { id: 'closed-won', title: 'Closed Won', color: '#10B981' },
    { id: 'closed-lost', title: 'Closed Lost', color: '#EF4444' }
  ];

  useEffect(() => {
    console.log('EmergencyKanban mounted with', deals.length, 'deals');
  }, []);

  const dealColumns = stages.map(stage => ({
    ...stage,
    deals: deals.filter(deal => deal.stage === stage.id)
  }));

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    marginBottom: '24px',
    textAlign: 'center' as const
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0'
  };

  const subtitleStyle = {
    color: '#64748b',
    fontSize: '1rem',
    margin: 0
  };

  const scrollContainerStyle = {
    width: '100%',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    backgroundColor: 'white',
    padding: '16px',
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const
  };

  const boardStyle = {
    display: 'flex',
    gap: '16px',
    width: '1800px', // 6 columns * 300px each
    minWidth: '1800px'
  };

  const columnStyle = {
    width: '300px',
    minWidth: '300px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    flexShrink: 0
  };

  const columnHeaderStyle = (color: string) => ({
    backgroundColor: color,
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center' as const
  });

  const columnBodyStyle = {
    padding: '12px',
    minHeight: '300px'
  };

  const dealCardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer'
  };

  const dealNameStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px'
  };

  const dealValueStyle = {
    fontSize: '0.8rem',
    color: '#64748b'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Emergency Kanban Board</h1>
        <p style={subtitleStyle}>
          Working version • {deals.length} deals • 6 stages (Demo/Trial removed)
        </p>
      </div>

      <div style={scrollContainerStyle}>
        <div style={boardStyle}>
          {dealColumns.map((column) => (
            <div key={column.id} style={columnStyle}>
              <div style={columnHeaderStyle(column.color)}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>
                  {column.title}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                  {column.deals.length} deals
                </p>
              </div>
              
              <div style={columnBodyStyle}>
                {column.deals.length > 0 ? (
                  column.deals.map((deal) => (
                    <div 
                      key={deal.id} 
                      style={dealCardStyle}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#f1f5f9';
                        console.log('Hover working on deal:', deal.name);
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'white';
                      }}
                    >
                      <div style={dealNameStyle}>{deal.name}</div>
                      <div style={dealValueStyle}>{deal.value}</div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    padding: '20px 10px'
                  }}>
                    No deals
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '6px',
        textAlign: 'center' as const
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>Success Indicators:</h3>
        <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.9rem' }}>
          ✓ Can scroll horizontally to see all 6 stages | ✓ Hover effects work on cards | ✓ Console logs interactions
        </p>
      </div>
    </div>
  );
};

export default EmergencyKanban;