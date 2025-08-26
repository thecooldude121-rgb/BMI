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
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        console.log('🚀 Fetching deals for Kanban...');
        const response = await fetch('/api/deals');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Deals loaded for Kanban:', data.length);
        setDeals(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Deals Kanban</h1>
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Deals</h3>
          <p className="text-red-600 mt-1">{error}</p>
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
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1 line-clamp-2">{deal.name}</h4>
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{deal.title}</p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <span className={`px-2 py-1 rounded-full text-xs border ${DEAL_HEALTH_COLORS[deal.dealHealth as keyof typeof DEAL_HEALTH_COLORS] || 'bg-gray-100 text-gray-800'}`}>
            {deal.dealHealth}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold text-green-600">
          ${parseInt(deal.value).toLocaleString()}
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs">{deal.probability}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Kanban</h1>
          <p className="text-gray-600 mt-1">
            {deals.length} deals • Total Pipeline Value: ${deals.reduce((sum, deal) => sum + parseInt(deal.value), 0).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board with All 8 Stages */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex" style={{ minWidth: `${DEAL_STAGES.length * 320}px` }}>
            {dealColumns.map((column, index) => (
              <div key={column.id} className="flex-shrink-0 w-80 border-r border-gray-200 last:border-r-0">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                      <h3 className="font-semibold text-gray-900 text-sm">{column.title}</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {column.deals.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 space-y-3 min-h-96 max-h-screen overflow-y-auto">
                  {column.deals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-2xl mb-2">📋</div>
                      <p className="text-sm">No deals in this stage</p>
                    </div>
                  ) : (
                    column.deals.map(deal => renderDealCard(deal))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
          Scroll horizontally to view all {DEAL_STAGES.length} stages → Discovery • Qualification • Proposal • Demo • Trial • Negotiation • Closed Won • Closed Lost
        </div>
      </div>

    </div>
  );
};

export default WorkingDealsKanban;