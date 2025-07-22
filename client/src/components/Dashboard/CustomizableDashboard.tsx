import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Settings, X, Edit3, Move } from 'lucide-react';
import { WidgetSelector, type WidgetConfig } from './WidgetSelector';
import { DashboardWidget } from './DashboardWidget';

interface CustomizableDashboardProps {
  userId?: string;
}

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({ userId = 'default' }) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Load widgets from localStorage on component mount
  useEffect(() => {
    const savedWidgets = localStorage.getItem(`dashboard-widgets-${userId}`);
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      // Default widgets for new users
      setWidgets([
        {
          id: 'default-stats-1',
          type: 'stats',
          title: 'Total Leads',
          size: 'small',
          position: { x: 0, y: 0 },
          settings: { metric: 'leads', showTrend: true }
        },
        {
          id: 'default-stats-2',
          type: 'stats',
          title: 'Pipeline Value',
          size: 'small',
          position: { x: 1, y: 0 },
          settings: { metric: 'pipeline_value', showTrend: true }
        },
        {
          id: 'default-list-1',
          type: 'list',
          title: 'Recent Leads',
          size: 'medium',
          position: { x: 0, y: 1 },
          settings: { limit: 5, sortBy: 'created_at' }
        },
        {
          id: 'default-chart-1',
          type: 'chart',
          title: 'Sales Funnel',
          size: 'medium',
          position: { x: 1, y: 1 },
          settings: { chartType: 'funnel', period: '30d' }
        }
      ]);
    }
  }, [userId]);

  // Save widgets to localStorage whenever widgets change
  useEffect(() => {
    localStorage.setItem(`dashboard-widgets-${userId}`, JSON.stringify(widgets));
  }, [widgets, userId]);

  const addWidget = (newWidget: Omit<WidgetConfig, 'id' | 'position'>) => {
    const widget: WidgetConfig = {
      ...newWidget,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: { x: 0, y: Math.max(...widgets.map(w => w.position.y)) + 1 }
    };
    setWidgets(prev => [...prev, widget]);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const updateWidget = (widgetId: string, updates: Partial<WidgetConfig>) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    ));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions based on new order
    const updatedWidgets = items.map((widget, index) => ({
      ...widget,
      position: { 
        x: widget.position.x, 
        y: Math.floor(index / getColumnsPerRow(widget.size)) 
      }
    }));

    setWidgets(updatedWidgets);
  };

  const getColumnsPerRow = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 4;
      case 'medium': return 2;
      case 'large': return 1;
      default: return 2;
    }
  };

  const getWidgetClassName = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 'lg:col-span-1';
      case 'medium': return 'lg:col-span-2';
      case 'large': return 'lg:col-span-4';
      default: return 'lg:col-span-2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
              editMode 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            <span>{editMode ? 'Done Editing' : 'Edit Layout'}</span>
          </button>
          <button
            onClick={() => setShowWidgetSelector(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Widget</span>
          </button>
        </div>
      </div>

      {/* Edit Mode Notice */}
      {editMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Move className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Edit Mode Active</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Drag widgets to reorder them, click the X button to remove widgets, or click settings to configure them.
          </p>
        </div>
      )}

      {/* Widget Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard-widgets">
          {(provided: any) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {widgets.map((widget, index) => (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                  isDragDisabled={!editMode}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${getWidgetClassName(widget.size)} ${
                        snapshot.isDragging ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="relative">
                        {/* Edit Mode Controls */}
                        {editMode && (
                          <div className="absolute -top-2 -right-2 z-10 flex space-x-1">
                            <button
                              onClick={() => removeWidget(widget.id)}
                              className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <button
                              className="bg-gray-600 text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                            >
                              <Settings className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        
                        {/* Drag Handle */}
                        {editMode && (
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-2 left-2 z-10 p-1 bg-gray-600 text-white rounded cursor-move"
                          >
                            <Move className="h-3 w-3" />
                          </div>
                        )}

                        {/* Widget Content */}
                        <DashboardWidget
                          widget={widget}
                          editMode={editMode}
                          onUpdate={(updates: any) => updateWidget(widget.id, updates)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Widget Selector Modal */}
      {showWidgetSelector && (
        <WidgetSelector
          onAddWidget={addWidget}
          onClose={() => setShowWidgetSelector(false)}
        />
      )}
    </div>
  );
};