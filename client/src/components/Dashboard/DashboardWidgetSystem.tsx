import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  RefreshCw,
  Eye,
  EyeOff,
  Grid3X3,
  Layout,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
  CheckSquare,
  FileText,
  Zap
} from 'lucide-react';
import { DashboardWidget, WidgetTemplate } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface DashboardWidgetSystemProps {
  userId: string;
}

interface GridLayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

const widgetTypeIcons = {
  stats: BarChart3,
  chart: PieChart,
  recent_activities: CheckSquare,
  pipeline: TrendingUp,
  leaderboard: Users,
  calendar: Calendar,
  tasks: CheckSquare,
  notes: FileText,
  weather: Zap,
  news: FileText,
  team_performance: Users,
  deal_forecast: TrendingUp,
  lead_sources: PieChart,
  revenue_trend: BarChart3,
  activity_heatmap: Grid3X3,
  goal_progress: TrendingUp
};

const DashboardWidgetSystem: React.FC<DashboardWidgetSystemProps> = ({ userId }) => {
  const [editMode, setEditMode] = useState(false);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<DashboardWidget | null>(null);
  const [gridLayout, setGridLayout] = useState<GridLayoutItem[]>([]);
  const queryClient = useQueryClient();

  // Fetch user's widgets
  const { data: widgets = [], isLoading: widgetsLoading } = useQuery<DashboardWidget[]>({
    queryKey: ['/api/dashboard/widgets', userId],
    enabled: !!userId
  });

  // Fetch widget templates
  const { data: templates = [] } = useQuery<WidgetTemplate[]>({
    queryKey: ['/api/dashboard/templates']
  });

  // Create widget mutation
  const createWidgetMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/dashboard/widgets', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/widgets', userId] });
      setShowWidgetSelector(false);
    }
  });

  // Update widget mutation
  const updateWidgetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/dashboard/widgets/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/widgets', userId] });
    }
  });

  // Delete widget mutation
  const deleteWidgetMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/dashboard/widgets/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/widgets', userId] });
    }
  });

  // Initialize grid layout from widgets
  useEffect(() => {
    if (widgets.length > 0) {
      const layout = widgets.map((widget: DashboardWidget) => ({
        i: widget.id,
        x: (widget.position as any)?.x || 0,
        y: (widget.position as any)?.y || 0,
        w: (widget.position as any)?.w || 4,
        h: (widget.position as any)?.h || 3
      }));
      setGridLayout(layout);
    }
  }, [widgets]);

  const handleAddWidget = (template: WidgetTemplate) => {
    const newPosition = {
      x: 0,
      y: Math.max(...gridLayout.map(item => item.y + item.h), 0),
      w: template.defaultSize === 'small' ? 3 : template.defaultSize === 'large' ? 6 : 4,
      h: template.defaultSize === 'small' ? 2 : template.defaultSize === 'large' ? 4 : 3
    };

    createWidgetMutation.mutate({
      userId,
      widgetType: template.widgetType,
      title: template.name,
      description: template.description,
      size: template.defaultSize,
      position: newPosition,
      configuration: template.defaultConfig,
      isVisible: true,
      isMovable: true,
      isResizable: true,
      minWidth: 2,
      minHeight: 2,
      maxWidth: 12,
      maxHeight: 8
    });
  };

  const handleWidgetUpdate = (widgetId: string, updates: any) => {
    updateWidgetMutation.mutate({ id: widgetId, data: updates });
  };

  const handleDeleteWidget = (widgetId: string) => {
    deleteWidgetMutation.mutate(widgetId);
  };

  const toggleWidgetVisibility = (widget: DashboardWidget) => {
    handleWidgetUpdate(widget.id, { isVisible: !widget.isVisible });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newLayout = Array.from(gridLayout);
    const [reorderedItem] = newLayout.splice(result.source.index, 1);
    newLayout.splice(result.destination.index, 0, reorderedItem);

    setGridLayout(newLayout);

    // Update widget positions in database
    newLayout.forEach((item, index) => {
      const widget = widgets.find((w: DashboardWidget) => w.id === item.i);
      if (widget) {
        handleWidgetUpdate(widget.id, { 
          position: { x: item.x, y: index, w: item.w, h: item.h }
        });
      }
    });
  };

  const renderWidget = (widget: DashboardWidget) => {
    const IconComponent = widgetTypeIcons[widget.widgetType] || BarChart3;
    
    return (
      <motion.div
        key={widget.id}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: widget.isVisible ? 1 : 0.5, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`
          relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200
          ${editMode ? 'ring-2 ring-blue-100' : ''}
          ${!widget.isVisible ? 'opacity-50' : ''}
        `}
        style={{
          minHeight: `${(widget.position as any)?.h * 120 || 360}px`,
          height: `${(widget.position as any)?.h * 120 || 360}px`
        }}
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">{widget.title}</h3>
          </div>
          
          {editMode && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => toggleWidgetVisibility(widget)}
                className="p-1 hover:bg-gray-100 rounded"
                title={widget.isVisible ? 'Hide widget' : 'Show widget'}
              >
                {widget.isVisible ? (
                  <Eye className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => setSelectedWidget(widget)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Configure widget"
              >
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleDeleteWidget(widget.id)}
                className="p-1 hover:bg-red-100 rounded"
                title="Delete widget"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Widget Content */}
        <div className="p-4 h-full">
          {widget.isVisible && (
            <WidgetContent widget={widget} />
          )}
        </div>
      </motion.div>
    );
  };

  if (widgetsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Customize your workspace with widgets</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${editMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {editMode ? 'Done Editing' : 'Edit Dashboard'}
          </button>
          
          {editMode && (
            <button
              onClick={() => setShowWidgetSelector(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Widget</span>
            </button>
          )}
        </div>
      </div>

      {/* Widget Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard" isDropDisabled={!editMode}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {widgets.map((widget: DashboardWidget, index: number) => (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                    isDragDisabled={!editMode || !widget.isMovable}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                          ${snapshot.isDragging ? 'rotate-3 scale-105' : ''}
                          ${editMode ? 'cursor-move' : ''}
                        `}
                      >
                        {renderWidget(widget)}
                      </div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Widget Selector Modal */}
      {showWidgetSelector && (
        <WidgetSelectorModal
          templates={templates}
          onSelect={handleAddWidget}
          onClose={() => setShowWidgetSelector(false)}
        />
      )}

      {/* Widget Configuration Modal */}
      {selectedWidget && (
        <WidgetConfigModal
          widget={selectedWidget}
          onSave={(updates) => {
            handleWidgetUpdate(selectedWidget.id, updates);
            setSelectedWidget(null);
          }}
          onClose={() => setSelectedWidget(null)}
        />
      )}
    </div>
  );
};

// Widget Content Component
const WidgetContent: React.FC<{ widget: DashboardWidget }> = ({ widget }) => {
  switch (widget.widgetType) {
    case 'stats':
      return <StatsWidget widget={widget} />;
    case 'chart':
      return <ChartWidget widget={widget} />;
    case 'recent_activities':
      return <RecentActivitiesWidget widget={widget} />;
    case 'pipeline':
      return <PipelineWidget widget={widget} />;
    case 'leaderboard':
      return <LeaderboardWidget widget={widget} />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Widget content loading...</p>
          </div>
        </div>
      );
  }
};

// Individual Widget Components
const StatsWidget: React.FC<{ widget: DashboardWidget }> = ({ widget }) => {
  const { data: deals = [] } = useQuery<any[]>({ queryKey: ['/api/deals'] });
  const { data: leads = [] } = useQuery<any[]>({ queryKey: ['/api/leads'] });

  const stats = {
    totalDeals: deals.length,
    totalValue: deals.reduce((sum: number, deal: any) => sum + parseFloat(deal.value || 0), 0),
    qualifiedLeads: leads.filter((lead: any) => lead.stage === 'qualified').length,
    conversionRate: leads.length > 0 ? (deals.length / leads.length * 100).toFixed(1) : '0'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalDeals}</div>
          <div className="text-xs text-gray-500">Total Deals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            ${(stats.totalValue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-gray-500">Pipeline Value</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.qualifiedLeads}</div>
          <div className="text-xs text-gray-500">Qualified Leads</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.conversionRate}%</div>
          <div className="text-xs text-gray-500">Conversion</div>
        </div>
      </div>
    </div>
  );
};

const ChartWidget: React.FC<{ widget: DashboardWidget }> = ({ widget }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-gray-500">
        <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Chart visualization</p>
        <p className="text-xs">Coming soon</p>
      </div>
    </div>
  );
};

const RecentActivitiesWidget: React.FC<{ widget: DashboardWidget }> = ({ widget }) => {
  const { data: activities = [] } = useQuery<any[]>({ queryKey: ['/api/activities'] });

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-2">
      {recentActivities.length > 0 ? (
        recentActivities.map((activity: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-700 truncate">{activity.description || activity.title}</span>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 text-sm">
          No recent activities
        </div>
      )}
    </div>
  );
};

const PipelineWidget: React.FC<{ widget: DashboardWidget }> = ({ widget }) => {
  const { data: deals = [] } = useQuery<any[]>({ queryKey: ['/api/deals'] });

  const pipelineStages = ['qualification', 'proposal', 'negotiation', 'closed-won'];
  const stageData = pipelineStages.map(stage => ({
    stage,
    count: deals.filter((deal: any) => deal.stage === stage).length,
    value: deals
      .filter((deal: any) => deal.stage === stage)
      .reduce((sum: number, deal: any) => sum + parseFloat(deal.value || 0), 0)
  }));

  return (
    <div className="space-y-2">
      {stageData.map((stage, index) => (
        <div key={stage.stage} className="flex items-center justify-between text-sm">
          <span className="capitalize text-gray-700">{stage.stage.replace('-', ' ')}</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">{stage.count}</span>
            <span className="text-green-600 font-medium">
              ${(stage.value / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const LeaderboardWidget: React.FC<{ widget: DashboardWidget }> = ({ widget }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Team Leaderboard</p>
        <p className="text-xs">Coming soon</p>
      </div>
    </div>
  );
};

// Widget Selector Modal
const WidgetSelectorModal: React.FC<{
  templates: WidgetTemplate[];
  onSelect: (template: WidgetTemplate) => void;
  onClose: () => void;
}> = ({ templates, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Widget</h2>
          <p className="text-gray-600">Choose a widget to add to your dashboard</p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const IconComponent = widgetTypeIcons[template.widgetType] || BarChart3;
              
              return (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(template)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {template.defaultSize}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.category}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Widget Configuration Modal
const WidgetConfigModal: React.FC<{
  widget: DashboardWidget;
  onSave: (updates: any) => void;
  onClose: () => void;
}> = ({ widget, onSave, onClose }) => {
  const [title, setTitle] = useState(widget.title);
  const [refreshInterval, setRefreshInterval] = useState(widget.refreshInterval || 300);

  const handleSave = () => {
    onSave({
      title,
      refreshInterval
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Configure Widget</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refresh Interval (seconds)
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={1800}>30 minutes</option>
              <option value={3600}>1 hour</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardWidgetSystem;