import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, User, Building, TrendingUp, Plus, Filter, Search, Clock, Star } from 'lucide-react';

interface Deal {
  id: string;
  name: string;
  title: string;
  value: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  dealHealth: string;
  dealType: string;
  aiScore: number;
  lastActivityDate: string;
  followUpDate: string;
  teamMembers: string[];
  followers: string[];
  account?: {
    id: string;
    name: string;
  };
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const DEAL_STAGES = [
  { id: 'discovery', title: 'Discovery', color: 'bg-blue-500' },
  { id: 'qualification', title: 'Qualification', color: 'bg-purple-500' },
  { id: 'proposal', title: 'Proposal', color: 'bg-yellow-500' },
  { id: 'demo', title: 'Demo', color: 'bg-indigo-500' },
  { id: 'trial', title: 'Trial', color: 'bg-teal-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed-won', title: 'Closed Won', color: 'bg-green-500' },
  { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-500' }
];

const DEAL_HEALTH_COLORS = {
  healthy: 'bg-green-100 text-green-800',
  at_risk: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
  hot_opportunity: 'bg-blue-100 text-blue-800',
  stalled: 'bg-gray-100 text-gray-800'
};

const WorkingDealsKanban: React.FC = () => {
  console.log('WorkingDealsKanban component rendering - URL:', window.location.pathname);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        console.log('Fetching deals from /api/deals...');
        const response = await fetch('/api/deals');
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('Deals data received:', data.length, 'deals');
        setDeals(data);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure page is fully mounted
    setTimeout(fetchDeals, 100);
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🎯 Loading Deals Kanban...</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="w-72 h-96 bg-gray-200 rounded flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading deals: {error}
        </div>
      </div>
    );
  }

  // Group deals by stage
  const dealColumns = DEAL_STAGES.map(stage => ({
    ...stage,
    deals: deals.filter(deal => deal.stage === stage.id)
  }));

  const renderDealCard = (deal: Deal) => (
    <div key={deal.id} className="mb-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-gray-900 leading-tight">{deal.name}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS] || 'bg-gray-100 text-gray-800'}`}>
          {deal.dealHealth?.replace('_', ' ')}
        </span>
      </div>

      <div className="text-xs text-gray-600 mb-2">
        {deal.account?.name}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold text-green-600">
          {deal.value}
        </div>
        <div className="text-xs text-gray-500">
          {deal.probability}%
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">
              {deal.contact?.firstName?.[0]}{deal.contact?.lastName?.[0]}
            </span>
          </div>
          <span className="text-xs text-gray-600">
            {deal.contact?.firstName} {deal.contact?.lastName}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className={`w-3 h-3 ${deal.aiScore > 80 ? 'text-yellow-500' : 'text-gray-300'}`} />
          <span className="text-xs">{deal.aiScore}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{new Date(deal.lastActivityDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-2 bg-gray-200 rounded-full h-1">
        <div 
          className="bg-blue-500 h-1 rounded-full transition-all" 
          style={{ width: `${deal.probability}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-900">DEALS KANBAN - ALL 8 STAGES</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{deals.length} deals total</span>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Navigate:</span>
            <a href="/crm/deals" className="text-blue-600 hover:underline">List View</a>
            <span>•</span>
            <span className="font-medium text-gray-900">Kanban View</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board - 8 Columns with proper scrolling */}
      <div style={{
        width: '100%',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        backgroundColor: 'white',
        padding: '16px'
      }}>
        <div style={{
          overflowX: 'auto',
          overflowY: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            width: '2400px',
            minWidth: '2400px'
          }}>
            {dealColumns.map((column) => (
              <div 
                key={column.id} 
                style={{
                  width: '300px',
                  minWidth: '300px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  flexShrink: 0
                }}
              >
                <div style={{
                  backgroundColor: column.color,
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px 8px 0 0',
                  textAlign: 'center'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                    {column.title}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                    {column.deals.length} deals
                  </p>
                </div>

                <div style={{
                  padding: '12px',
                  minHeight: '300px'
                }}>
                  {column.deals.length > 0 ? (
                    column.deals.map(renderDealCard)
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Pipeline Value</div>
              <div className="text-xl font-bold text-gray-900">
                ${deals.reduce((sum, deal) => sum + parseFloat(deal.value.replace(/[^0-9.-]+/g, '') || '0'), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Avg Probability</div>
              <div className="text-xl font-bold text-gray-900">
                {Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Active Deals</div>
              <div className="text-xl font-bold text-gray-900">{deals.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-sm text-gray-600">Healthy Deals</div>
              <div className="text-xl font-bold text-gray-900">
                {deals.filter(d => d.dealHealth === 'healthy').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingDealsKanban;