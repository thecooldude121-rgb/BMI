import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  RefreshCw, Zap, Activity, Calendar, Phone, Video, 
  MessageSquare, CheckCircle, Clock, ArrowRight, 
  Badge, AlertCircle, Users, Database, Sync,
  TrendingUp, BarChart3, Eye, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ActivitySyncPanelProps {
  accountId?: string;
  dealId?: string;
  companyName?: string;
  onSyncComplete?: () => void;
}

interface SyncStatus {
  crm: number;
  leadGen: number;
  manual: number;
  total: number;
}

interface Activity {
  id: string;
  subject: string;
  type: 'call' | 'meeting' | 'task' | 'note' | 'email';
  status: string;
  priority: string;
  description: string;
  outcome?: string;
  duration?: number;
  scheduledAt: string;
  completedAt?: string;
  source: 'CRM' | 'LeadGen' | 'manual';
  createdAt: string;
  assignedToUser?: {
    firstName: string;
    lastName: string;
  };
  deal?: {
    name: string;
    value: string;
    stage: string;
  };
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call': return Phone;
    case 'meeting': return Video;
    case 'task': return CheckCircle;
    case 'note': return MessageSquare;
    case 'email': return MessageSquare;
    default: return Activity;
  }
};

const getSourceBadgeColor = (source: string) => {
  switch (source) {
    case 'CRM': return 'bg-blue-500 text-white';
    case 'LeadGen': return 'bg-green-500 text-white';
    case 'manual': return 'bg-gray-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

export const ActivitySyncPanel: React.FC<ActivitySyncPanelProps> = ({
  accountId,
  dealId,
  companyName,
  onSyncComplete
}) => {
  const [selectedModule, setSelectedModule] = useState<'CRM' | 'LeadGen'>('CRM');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sync status
  const { data: syncStatus, isLoading: syncStatusLoading } = useQuery({
    queryKey: ['activities-sync-status', accountId, dealId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);
      if (dealId) params.append('dealId', dealId);
      return apiRequest(`/api/activities/sync-status?${params.toString()}`);
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch activities for account or deal
  const { data: activities, isLoading: activitiesLoading, refetch: refetchActivities } = useQuery({
    queryKey: ['activities-for-entity', accountId, dealId],
    queryFn: async () => {
      if (accountId) {
        return apiRequest(`/api/activities/account/${accountId}`);
      } else if (dealId) {
        return apiRequest(`/api/activities/deal/${dealId}`);
      }
      return [];
    },
    enabled: !!(accountId || dealId)
  });

  // Bulk sync mutation
  const bulkSyncMutation = useMutation({
    mutationFn: async ({ entityId, entityType, targetModule }: { 
      entityId: string, 
      entityType: 'account' | 'deal', 
      targetModule: 'CRM' | 'LeadGen' 
    }) => {
      return apiRequest('/api/activities/bulk-sync', {
        method: 'POST',
        body: JSON.stringify({ entityId, entityType, targetModule })
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Sync Successful",
        description: `Synced ${data.syncedCount} activities to ${selectedModule}`,
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['activities-sync-status'] });
      queryClient.invalidateQueries({ queryKey: ['activities-for-entity'] });
      onSyncComplete?.();
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Failed to sync activities. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Individual activity sync mutation
  const activitySyncMutation = useMutation({
    mutationFn: async ({ activityId, targetModule }: { 
      activityId: string, 
      targetModule: 'CRM' | 'LeadGen' 
    }) => {
      const endpoint = targetModule === 'CRM' 
        ? `/api/activities/sync/to-crm/${activityId}`
        : `/api/activities/sync/to-leadgen/${activityId}`;
      return apiRequest(endpoint, { method: 'POST' });
    },
    onSuccess: () => {
      toast({
        title: "Activity Synced",
        description: `Activity synced to ${selectedModule} successfully`,
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['activities-sync-status'] });
      queryClient.invalidateQueries({ queryKey: ['activities-for-entity'] });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Failed to sync activity. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleBulkSync = () => {
    if (!accountId && !dealId) return;
    
    const entityId = accountId || dealId!;
    const entityType = accountId ? 'account' : 'deal';
    
    bulkSyncMutation.mutate({ entityId, entityType, targetModule: selectedModule });
  };

  const handleActivitySync = (activityId: string) => {
    activitySyncMutation.mutate({ activityId, targetModule: selectedModule });
  };

  const totalActivities = syncStatus?.total || 0;
  const crmPercentage = totalActivities > 0 ? Math.round((syncStatus?.crm || 0) / totalActivities * 100) : 0;
  const leadGenPercentage = totalActivities > 0 ? Math.round((syncStatus?.leadGen || 0) / totalActivities * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Sync Status Overview */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sync className="h-5 w-5 text-blue-600" />
            Activity Sync Status
            {companyName && (
              <span className="text-sm text-gray-500 font-normal">for {companyName}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {syncStatusLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading sync status...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Sync Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">{syncStatus?.crm || 0}</div>
                  <div className="text-sm text-gray-600">CRM Activities</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">{syncStatus?.leadGen || 0}</div>
                  <div className="text-sm text-gray-600">Lead Gen Activities</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-600">{syncStatus?.manual || 0}</div>
                  <div className="text-sm text-gray-600">Manual Activities</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50">
                  <div className="text-2xl font-bold text-purple-600">{syncStatus?.total || 0}</div>
                  <div className="text-sm text-gray-600">Total Activities</div>
                </div>
              </div>

              {/* Sync Distribution Bar */}
              {totalActivities > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sync Distribution</span>
                    <span>{totalActivities} total activities</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                    {crmPercentage > 0 && (
                      <div
                        className="bg-blue-500 h-3"
                        style={{ width: `${crmPercentage}%` }}
                        title={`CRM: ${crmPercentage}%`}
                      />
                    )}
                    {leadGenPercentage > 0 && (
                      <div
                        className="bg-green-500 h-3"
                        style={{ width: `${leadGenPercentage}%` }}
                        title={`Lead Gen: ${leadGenPercentage}%`}
                      />
                    )}
                    {(100 - crmPercentage - leadGenPercentage) > 0 && (
                      <div
                        className="bg-gray-500 h-3"
                        style={{ width: `${100 - crmPercentage - leadGenPercentage}%` }}
                        title={`Manual: ${100 - crmPercentage - leadGenPercentage}%`}
                      />
                    )}
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      CRM ({crmPercentage}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      Lead Gen ({leadGenPercentage}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-500 rounded"></div>
                      Manual ({100 - crmPercentage - leadGenPercentage}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Controls */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Bulk Sync Control
            </div>
            <Button
              onClick={refetchActivities}
              variant="outline"
              size="sm"
              className="text-gray-600"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sync to:</span>
              <div className="flex rounded-md border border-gray-200">
                <button
                  onClick={() => setSelectedModule('CRM')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    selectedModule === 'CRM'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  CRM
                </button>
                <button
                  onClick={() => setSelectedModule('LeadGen')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    selectedModule === 'LeadGen'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Lead Gen
                </button>
              </div>
            </div>
            <Button
              onClick={handleBulkSync}
              disabled={bulkSyncMutation.isPending || totalActivities === 0}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
            >
              {bulkSyncMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sync className="h-4 w-4 mr-2" />
              )}
              Sync All Activities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-purple-600" />
            Recent Activities ({(activities as Activity[])?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Loading activities...
            </div>
          ) : (activities as Activity[])?.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(activities as Activity[]).map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {activity.subject}
                          </h4>
                          {activity.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {activity.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(activity.scheduledAt).toLocaleDateString()}
                            </span>
                            {activity.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration}min
                              </span>
                            )}
                            {activity.assignedToUser && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {activity.assignedToUser.firstName} {activity.assignedToUser.lastName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <UIBadge className={`text-xs ${getSourceBadgeColor(activity.source)}`}>
                            {activity.source}
                          </UIBadge>
                          <UIBadge className={`text-xs ${getPriorityColor(activity.priority)}`} variant="outline">
                            {activity.priority}
                          </UIBadge>
                          <Button
                            onClick={() => handleActivitySync(activity.id)}
                            disabled={activitySyncMutation.isPending}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            {activitySyncMutation.isPending ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <ArrowRight className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No activities found</p>
              <p className="text-sm mt-1">Activities will appear here once created</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivitySyncPanel;