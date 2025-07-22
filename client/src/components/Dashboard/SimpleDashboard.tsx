import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Users, DollarSign, Target, TrendingUp, BarChart3 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  change: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-100',
    green: 'bg-green-500 text-green-100',
    yellow: 'bg-yellow-500 text-yellow-100',
    purple: 'bg-purple-500 text-purple-100',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm font-medium text-green-600">{change}</span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );
};

export const SimpleDashboard: React.FC = () => {
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
    enabled: true
  });
  
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
    enabled: true
  });

  const leadsArray = Array.isArray(leads) ? leads : [];
  const dealsArray = Array.isArray(deals) ? deals : [];

  const stats = {
    totalLeads: leadsArray.length,
    qualifiedLeads: leadsArray.filter((lead: any) => 
      lead.stage === 'qualified' || lead.stage === 'proposal'
    ).length,
    totalDeals: dealsArray.reduce((sum: number, deal: any) => 
      sum + parseFloat(deal.value || 0), 0
    ),
    wonDeals: dealsArray.filter((deal: any) => deal.stage === 'closed-won').length
  };

  if (leadsLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setShowWidgetSelector(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Widget</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads.toString()}
          icon={Users}
          change="+12%"
          color="blue"
        />
        <StatCard
          title="Qualified Leads"
          value={stats.qualifiedLeads.toString()}
          icon={Target}
          change="+8%"
          color="green"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${(stats.totalDeals / 1000).toFixed(0)}K`}
          icon={DollarSign}
          change="+15%"
          color="yellow"
        />
        <StatCard
          title="Won Deals"
          value={stats.wonDeals.toString()}
          icon={TrendingUp}
          change="+5%"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {leadsArray.slice(0, 5).map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-600">{lead.company} - {lead.stage}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${parseInt(lead.value || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{lead.probability}% probability</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Funnel</h3>
          <div className="space-y-3">
            {[
              { name: 'Qualification', count: dealsArray.filter((d: any) => d.stage === 'qualification').length },
              { name: 'Proposal', count: dealsArray.filter((d: any) => d.stage === 'proposal').length },
              { name: 'Negotiation', count: dealsArray.filter((d: any) => d.stage === 'negotiation').length },
              { name: 'Closed Won', count: dealsArray.filter((d: any) => d.stage === 'closed-won').length }
            ].map((stage) => {
              const maxCount = Math.max(...[
                dealsArray.filter((d: any) => d.stage === 'qualification').length,
                dealsArray.filter((d: any) => d.stage === 'proposal').length,
                dealsArray.filter((d: any) => d.stage === 'negotiation').length,
                dealsArray.filter((d: any) => d.stage === 'closed-won').length
              ]);
              const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
              
              return (
                <div key={stage.name} className="flex items-center space-x-3">
                  <div className="w-20 text-sm text-gray-600">{stage.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div 
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${width}%` }}
                    >
                      {stage.count > 0 && (
                        <span className="text-white text-xs font-medium">{stage.count}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealsArray.slice(0, 4).map((deal: any) => (
            <div key={deal.id} className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium text-gray-900">{deal.name}</p>
              <p className="text-sm text-gray-600">{deal.stage}</p>
              <p className="text-sm font-medium text-green-600">${parseInt(deal.value || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};