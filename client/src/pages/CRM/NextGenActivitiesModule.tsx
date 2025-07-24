import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, Clock, Users, Phone, Mail, Video, MessageSquare, 
  CheckCircle, AlertCircle, TrendingUp, Plus, Filter, Search,
  Grid3X3, List, Kanban, Settings, Download, Upload, Bell,
  Target, Activity, Star, Flag, Tag, User, Building, DollarSign,
  Eye, Edit, MoreHorizontal, ArrowRight, Zap, Brain, PlayCircle,
  FileText, Link, Paperclip, MessageCircle, UserPlus, RefreshCw,
  Calendar as CalendarIcon, Smartphone, Linkedin, Globe, Hash
} from 'lucide-react';
import Fuse from 'fuse.js';

// Types
interface Activity {
  id: string;
  subject: string;
  type: 'task' | 'call' | 'meeting' | 'email' | 'sms' | 'whatsapp' | 'note' | 'linkedin' | 'demo' | 'proposal' | 'follow_up' | 'presentation' | 'training' | 'webinar' | 'custom';
  status: 'open' | 'in_progress' | 'completed' | 'overdue' | 'cancelled' | 'on_hold' | 'recurring';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  description?: string;
  outcome?: string;
  duration?: number;
  scheduledAt?: string;
  completedAt?: string;
  dueDate?: string;
  assignedTo?: string;
  assignedToUser?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  createdBy?: string;
  createdByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  
  // Related entities
  relatedToType?: 'lead' | 'deal' | 'contact' | 'account';
  relatedToId?: string;
  relatedTo?: {
    id: string;
    name: string;
    type: string;
  };
  
  // Enhanced fields
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  nextAction?: string;
  tags?: string[];
  followers?: string[];
  attachments?: any[];
  source?: string;
  
  createdAt: string;
  updatedAt: string;
}

interface ActivityMetrics {
  totalActivities: number;
  openActivities: number;
  completedToday: number;
  overdueActivities: number;
  avgCompletionTime: number;
  completionRate: number;
}

const NextGenActivitiesModule = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban' | 'timeline'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    type?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    relatedToType?: string;
    dateRange?: string;
  }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch activities data
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  // Fetch activity metrics
  const { data: metrics } = useQuery<ActivityMetrics>({
    queryKey: ['/api/activities/metrics'],
  });

  // Fuzzy search setup
  const fuse = useMemo(() => {
    if (!activities.length) return null;
    return new Fuse(activities, {
      keys: [
        'subject',
        'description',
        'type',
        'assignedToUser.firstName',
        'assignedToUser.lastName',
        'relatedTo.name'
      ],
      threshold: 0.3,
    });
  }, [activities]);

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Apply search
    if (searchQuery && fuse) {
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map(result => result.item);
    }

    // Apply filters
    if (selectedFilters.type) {
      filtered = filtered.filter(activity => activity.type === selectedFilters.type);
    }
    if (selectedFilters.status) {
      filtered = filtered.filter(activity => activity.status === selectedFilters.status);
    }
    if (selectedFilters.priority) {
      filtered = filtered.filter(activity => activity.priority === selectedFilters.priority);
    }
    if (selectedFilters.assignedTo) {
      filtered = filtered.filter(activity => activity.assignedTo === selectedFilters.assignedTo);
    }
    if (selectedFilters.relatedToType) {
      filtered = filtered.filter(activity => activity.relatedToType === selectedFilters.relatedToType);
    }

    return filtered;
  }, [activities, searchQuery, selectedFilters, fuse]);

  // Get filter options
  const filterOptions = useMemo(() => {
    return {
      types: Array.from(new Set(activities.map(a => a.type))),
      statuses: Array.from(new Set(activities.map(a => a.status))),
      priorities: Array.from(new Set(activities.map(a => a.priority))),
      assignees: Array.from(new Set(activities.filter(a => a.assignedToUser).map(a => ({
        id: a.assignedTo!,
        name: `${a.assignedToUser!.firstName} ${a.assignedToUser!.lastName}`
      })))),
      relatedTypes: Array.from(new Set(activities.filter(a => a.relatedToType).map(a => a.relatedToType!)))
    };
  }, [activities]);

  // Activity type icons
  const getActivityIcon = (type: string) => {
    const icons = {
      task: CheckCircle,
      call: Phone,
      meeting: Video,
      email: Mail,
      sms: Smartphone,
      whatsapp: MessageSquare,
      note: FileText,
      linkedin: Linkedin,
      demo: PlayCircle,
      proposal: FileText,
      follow_up: RefreshCw,
      presentation: Grid3X3,
      training: Users,
      webinar: Globe,
      custom: Hash
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  // Activity status colors
  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
      on_hold: 'bg-orange-100 text-orange-700',
      recurring: 'bg-purple-100 text-purple-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  // Priority colors
  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
      critical: 'text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  // Mark activity as completed
  const markCompletedMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedAt: new Date().toISOString() })
      });
      if (!response.ok) throw new Error('Failed to complete activity');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities/metrics'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activity Command Center</h1>
            <p className="text-gray-600">Unified dashboard for all business interactions and workflows</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create Activity
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              AI Automation
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Smart Insights
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium text-sm">Total Activities</p>
                <p className="text-blue-900 text-2xl font-bold">{metrics?.totalActivities || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium text-sm">Open Activities</p>
                <p className="text-green-900 text-2xl font-bold">{metrics?.openActivities || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium text-sm">Completed Today</p>
                <p className="text-purple-900 text-2xl font-bold">{metrics?.completedToday || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 font-medium text-sm">Overdue</p>
                <p className="text-red-900 text-2xl font-bold">{metrics?.overdueActivities || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 font-medium text-sm">Avg Time</p>
                <p className="text-orange-900 text-2xl font-bold">{metrics?.avgCompletionTime || 0}m</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-700 font-medium text-sm">Completion Rate</p>
                <p className="text-indigo-900 text-2xl font-bold">{metrics?.completionRate || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities by subject, description, assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {Object.keys(selectedFilters).length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {Object.keys(selectedFilters).length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 ${viewMode === 'timeline' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-4"
            >
              <select
                value={selectedFilters.type || ''}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Types</option>
                {filterOptions.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedFilters.status || ''}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Statuses</option>
                {filterOptions.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={selectedFilters.priority || ''}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priority: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Priorities</option>
                {filterOptions.priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>

              <select
                value={selectedFilters.assignedTo || ''}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, assignedTo: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Assignees</option>
                {filterOptions.assignees.map((assignee: any) => (
                  <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                ))}
              </select>

              <select
                value={selectedFilters.relatedToType || ''}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, relatedToType: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Relations</option>
                {filterOptions.relatedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedFilters.dateRange || ''}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, dateRange: e.target.value || undefined }))}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="overdue">Overdue</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Activities List/Grid */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Activity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned To</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Related To</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity, index) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      
                      return (
                        <motion.tr
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${activity.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                <ActivityIcon className={`w-4 h-4 ${activity.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{activity.subject}</p>
                                {activity.description && (
                                  <p className="text-sm text-gray-500 truncate max-w-xs">{activity.description}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                              {activity.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} capitalize`}>
                              {activity.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <Flag className={`w-4 h-4 mr-1 ${getPriorityColor(activity.priority)}`} />
                              <span className={`text-sm font-medium ${getPriorityColor(activity.priority)} capitalize`}>
                                {activity.priority}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {activity.assignedToUser ? (
                              <div className="flex items-center space-x-2">
                                {activity.assignedToUser.avatarUrl ? (
                                  <img 
                                    src={activity.assignedToUser.avatarUrl} 
                                    alt={`${activity.assignedToUser.firstName} ${activity.assignedToUser.lastName}`}
                                    className="w-6 h-6 rounded-full"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-3 h-3 text-blue-600" />
                                  </div>
                                )}
                                <span className="text-sm text-gray-700">
                                  {activity.assignedToUser.firstName} {activity.assignedToUser.lastName}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">Unassigned</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {activity.relatedTo ? (
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 capitalize">
                                  {activity.relatedToType}
                                </span>
                                <span className="text-sm text-gray-700">{activity.relatedTo.name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : 
                             activity.scheduledAt ? new Date(activity.scheduledAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {activity.status !== 'completed' && (
                                <button 
                                  onClick={() => markCompletedMutation.mutate(activity.id)}
                                  className="text-gray-400 hover:text-green-600"
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button className="text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500">
              {searchQuery || Object.keys(selectedFilters).length > 0
                ? "Try adjusting your search or filters"
                : "Get started by creating your first activity"
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NextGenActivitiesModule;