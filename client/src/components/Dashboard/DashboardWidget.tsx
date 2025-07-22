import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Activity, 
  CheckSquare,
  Calendar,
  BarChart3
} from 'lucide-react';
import type { WidgetConfig } from './WidgetSelector';

interface DashboardWidgetProps {
  widget: WidgetConfig;
  editMode: boolean;
  onUpdate: (updates: Partial<WidgetConfig>) => void;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({ 
  widget, 
  editMode, 
  onUpdate 
}) => {
  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
    enabled: widget.type === 'stats' || widget.type === 'list' || widget.type === 'chart'
  });
  
  const { data: deals = [] } = useQuery({
    queryKey: ['/api/deals'],
    enabled: widget.type === 'stats' || widget.type === 'list' || widget.type === 'chart'
  });
  
  const { data: tasks = [] } = useQuery({
    queryKey: ['/api/tasks'],
    enabled: widget.type === 'stats' || widget.type === 'list'
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities'],
    enabled: widget.type === 'activity' || widget.type === 'list'
  });

  const renderStatsWidget = () => {
    const { metric } = widget.settings;
    
    let value = '0';
    let icon = Users;
    let color = 'blue';
    let change = '+0%';
    
    const leadsArray = Array.isArray(leads) ? leads : [];
    const dealsArray = Array.isArray(deals) ? deals : [];
    
    switch (metric) {
      case 'leads':
        value = leadsArray.length.toString();
        icon = Users;
        color = 'blue';
        change = '+12%';
        break;
      case 'qualified_leads':
        value = leadsArray.filter((lead: any) => 
          lead.stage === 'qualified' || lead.stage === 'proposal'
        ).length.toString();
        icon = Target;
        color = 'green';
        change = '+8%';
        break;
      case 'pipeline_value':
        const totalValue = dealsArray.reduce((sum: number, deal: any) => 
          sum + parseFloat(deal.value || 0), 0
        );
        value = `$${(totalValue / 1000).toFixed(0)}K`;
        icon = DollarSign;
        color = 'yellow';
        change = '+15%';
        break;
      case 'won_deals':
        value = dealsArray.filter((deal: any) => deal.stage === 'closed-won').length.toString();
        icon = TrendingUp;
        color = 'purple';
        change = '+5%';
        break;
    }
    
    const Icon = icon;
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
            <p className="text-sm font-medium text-gray-600">{widget.title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {widget.settings.showTrend && (
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">{change}</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        )}
      </div>
    );
  };

  const renderListWidget = () => {
    const { limit = 5, sortBy = 'created_at', filter, status } = widget.settings;
    
    let items: any[] = [];
    
    if (widget.title.includes('Lead')) {
      items = Array.isArray(leads) ? leads.slice(0, limit) : [];
    } else if (widget.title.includes('Deal')) {
      const dealsArray = Array.isArray(deals) ? deals : [];
      if (filter === 'high_probability') {
        items = dealsArray.filter((deal: any) => 
          parseFloat(deal.probability) >= 70
        ).slice(0, limit);
      } else {
        items = dealsArray.slice(0, limit);
      }
    } else if (widget.title.includes('Task')) {
      const tasksArray = Array.isArray(tasks) ? tasks : [];
      items = status 
        ? tasksArray.filter((task: any) => task.status === status).slice(0, limit)
        : tasksArray.slice(0, limit);
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
        <div className="space-y-3">
          {items.map((item: any, index: number) => (
            <div key={item.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium text-gray-900">
                  {item.name || item.title || 'Unnamed'}
                </p>
                <p className="text-sm text-gray-600">
                  {item.company || item.stage || item.status || 'No details'}
                </p>
              </div>
              {item.value && (
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${parseInt(item.value || 0).toLocaleString()}
                  </p>
                  {item.probability && (
                    <p className="text-sm text-gray-600">{item.probability}%</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No items to display
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChartWidget = () => {
    const { chartType, period = '30d' } = widget.settings;
    
    if (chartType === 'funnel') {
      const dealsArray = Array.isArray(deals) ? deals : [];
      const stages = [
        { name: 'Qualification', count: dealsArray.filter((d: any) => d.stage === 'qualification').length },
        { name: 'Proposal', count: dealsArray.filter((d: any) => d.stage === 'proposal').length },
        { name: 'Negotiation', count: dealsArray.filter((d: any) => d.stage === 'negotiation').length },
        { name: 'Closed Won', count: dealsArray.filter((d: any) => d.stage === 'closed-won').length }
      ];
      
      const maxCount = Math.max(...stages.map(s => s.count));
      
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
          <div className="space-y-3">
            {stages.map((stage, index) => {
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
      );
    }
    
    if (chartType === 'distribution') {
      const leadsArray = Array.isArray(leads) ? leads : [];
      const scoreRanges = [
        { range: '0-20', count: leadsArray.filter((l: any) => l.score >= 0 && l.score < 21).length },
        { range: '21-40', count: leadsArray.filter((l: any) => l.score >= 21 && l.score < 41).length },
        { range: '41-60', count: leadsArray.filter((l: any) => l.score >= 41 && l.score < 61).length },
        { range: '61-80', count: leadsArray.filter((l: any) => l.score >= 61 && l.score < 81).length },
        { range: '81-100', count: leadsArray.filter((l: any) => l.score >= 81 && l.score <= 100).length }
      ];
      
      const maxCount = Math.max(...scoreRanges.map(r => r.count));
      
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
          <div className="grid grid-cols-5 gap-2">
            {scoreRanges.map((range, index) => {
              const height = maxCount > 0 ? (range.count / maxCount) * 100 : 0;
              return (
                <div key={range.range} className="text-center">
                  <div className="h-24 flex items-end justify-center">
                    <div 
                      className="bg-blue-500 rounded-t w-full flex items-end justify-center pb-1"
                      style={{ height: `${height}%`, minHeight: range.count > 0 ? '20px' : '0' }}
                    >
                      {range.count > 0 && (
                        <span className="text-white text-xs font-medium">{range.count}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{range.range}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <BarChart3 className="h-8 w-8 mr-2" />
          <span>Chart visualization</span>
        </div>
      </div>
    );
  };

  const renderActivityWidget = () => {
    const { limit = 10 } = widget.settings;
    const activitiesArray = Array.isArray(activities) ? activities.slice(0, limit) : [];

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
        <div className="space-y-3">
          {activitiesArray.map((activity: any, index: number) => (
            <div key={activity.id || index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-md">
              <div className="flex-shrink-0 p-2 rounded-full bg-gray-100">
                <Activity className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.subject || 'Activity'}</p>
                <p className="text-sm text-gray-600">{activity.description || 'No description'}</p>
                <p className="text-xs text-gray-500">
                  {activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 'Scheduled'}
                </p>
              </div>
            </div>
          ))}
          {activitiesArray.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No recent activities
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendarWidget = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{widget.title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <Calendar className="h-8 w-8 mr-2" />
          <span>Calendar view coming soon</span>
        </div>
      </div>
    );
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'stats':
        return renderStatsWidget();
      case 'list':
        return renderListWidget();
      case 'chart':
        return renderChartWidget();
      case 'activity':
        return renderActivityWidget();
      case 'calendar':
        return renderCalendarWidget();
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">{widget.title}</h3>
            <p className="text-gray-500">Widget type not supported</p>
          </div>
        );
    }
  };

  return (
    <div className={`${editMode ? 'ring-2 ring-blue-200' : ''} transition-all`}>
      {renderWidget()}
    </div>
  );
};