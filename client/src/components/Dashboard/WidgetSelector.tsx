import React, { useState } from 'react';
import { Plus, X, Settings, BarChart3, Users, DollarSign, CheckSquare, Target, Calendar, Activity } from 'lucide-react';

export interface WidgetConfig {
  id: string;
  type: 'stats' | 'chart' | 'list' | 'calendar' | 'activity';
  title: string;
  subtitle?: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  settings: Record<string, any>;
}

interface WidgetSelectorProps {
  onAddWidget: (widget: Omit<WidgetConfig, 'id' | 'position'>) => void;
  onClose: () => void;
}

const availableWidgets = [
  {
    type: 'stats' as const,
    title: 'Lead Statistics',
    subtitle: 'Track lead counts and conversion rates',
    icon: Users,
    defaultSize: 'small' as const,
    settings: { metric: 'leads', showTrend: true }
  },
  {
    type: 'stats' as const,
    title: 'Deal Pipeline Value',
    subtitle: 'Monitor total pipeline value',
    icon: DollarSign,
    defaultSize: 'small' as const,
    settings: { metric: 'pipeline_value', showTrend: true }
  },
  {
    type: 'chart' as const,
    title: 'Sales Funnel',
    subtitle: 'Visualize deal progression through stages',
    icon: BarChart3,
    defaultSize: 'medium' as const,
    settings: { chartType: 'funnel', period: '30d' }
  },
  {
    type: 'chart' as const,
    title: 'Lead Score Distribution',
    subtitle: 'View lead quality distribution',
    icon: Target,
    defaultSize: 'medium' as const,
    settings: { chartType: 'distribution', metric: 'lead_score' }
  },
  {
    type: 'list' as const,
    title: 'Recent Leads',
    subtitle: 'Latest leads added to pipeline',
    icon: Users,
    defaultSize: 'medium' as const,
    settings: { limit: 5, sortBy: 'created_at' }
  },
  {
    type: 'list' as const,
    title: 'Hot Deals',
    subtitle: 'High probability deals closing soon',
    icon: DollarSign,
    defaultSize: 'medium' as const,
    settings: { filter: 'high_probability', limit: 5 }
  },
  {
    type: 'list' as const,
    title: 'Pending Tasks',
    subtitle: 'Tasks requiring immediate attention',
    icon: CheckSquare,
    defaultSize: 'small' as const,
    settings: { status: 'pending', limit: 8 }
  },
  {
    type: 'activity' as const,
    title: 'Recent Activity',
    subtitle: 'Latest CRM activities and updates',
    icon: Activity,
    defaultSize: 'medium' as const,
    settings: { limit: 10, types: ['call', 'email', 'meeting'] }
  },
  {
    type: 'calendar' as const,
    title: 'Upcoming Events',
    subtitle: 'Scheduled meetings and tasks',
    icon: Calendar,
    defaultSize: 'large' as const,
    settings: { view: 'upcoming', days: 7 }
  }
];

export const WidgetSelector: React.FC<WidgetSelectorProps> = ({ onAddWidget, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Widgets' },
    { id: 'stats', name: 'Statistics' },
    { id: 'chart', name: 'Charts' },
    { id: 'list', name: 'Lists' },
    { id: 'calendar', name: 'Calendar' },
    { id: 'activity', name: 'Activity' }
  ];

  const filteredWidgets = selectedCategory === 'all' 
    ? availableWidgets 
    : availableWidgets.filter(w => w.type === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Dashboard Widget</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          {/* Category Sidebar */}
          <div className="w-48 border-r border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Widget Grid */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWidgets.map((widget, index) => {
                const Icon = widget.icon;
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      onAddWidget({
                        type: widget.type,
                        title: widget.title,
                        subtitle: widget.subtitle,
                        size: widget.defaultSize,
                        settings: widget.settings
                      });
                      onClose();
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{widget.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{widget.subtitle}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                            {widget.type}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                            {widget.defaultSize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};