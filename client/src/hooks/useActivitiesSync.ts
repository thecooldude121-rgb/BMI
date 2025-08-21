import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'sms' | 'whatsapp' | 'linkedin' | 'demo' | 'proposal' | 'document';
  subject: string;
  description?: string;
  status: 'open' | 'completed' | 'cancelled' | 'planned' | 'in_progress';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  outcome?: string;
  duration?: number;
  dueDate?: string;
  scheduledAt?: string;
  completedAt?: string;
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
  
  // Additional relationship fields
  accountId?: string;
  dealId?: string;
  contactId?: string;
  leadId?: string;
  
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

export interface ActivityMetrics {
  totalActivities: number;
  openActivities: number;
  completedToday: number;
  overdueActivities: number;
  avgCompletionTime: number;
  completionRate: number;
}

// Activity query keys for consistent caching
export const ACTIVITY_QUERY_KEYS = {
  all: () => ['/api/activities'] as const,
  metrics: () => ['/api/activities/metrics'] as const,
  byEntity: (entityType: string, entityId: string) => ['/api/activities', entityType, entityId] as const,
  byDeal: (dealId: string) => ['/api/deals', dealId, 'activities'] as const,
  byAccount: (accountId: string) => ['/api/accounts', accountId, 'activities'] as const,
  byContact: (contactId: string) => ['/api/contacts', contactId, 'activities'] as const,
};

export const useActivitiesSync = () => {
  const queryClient = useQueryClient();

  // Fetch all activities
  const {
    data: activities = [],
    isLoading,
    error,
    refetch: refetchActivities
  } = useQuery<Activity[]>({
    queryKey: ACTIVITY_QUERY_KEYS.all(),
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute background refresh
  });

  // Fetch activity metrics
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery<ActivityMetrics>({
    queryKey: ACTIVITY_QUERY_KEYS.metrics(),
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
    refetchInterval: 30000, // 30 seconds
  });

  // Comprehensive cache invalidation function
  const invalidateActivitiesCache = async (specificEntityId?: string, entityType?: string) => {
    // Invalidate main activities queries
    await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all() });
    await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.metrics() });
    
    // Invalidate entity-specific queries if provided
    if (specificEntityId && entityType) {
      await queryClient.invalidateQueries({ 
        queryKey: ACTIVITY_QUERY_KEYS.byEntity(entityType, specificEntityId) 
      });
      
      // Invalidate specific entity queries based on type
      if (entityType === 'deal') {
        await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.byDeal(specificEntityId) });
      } else if (entityType === 'account') {
        await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.byAccount(specificEntityId) });
      } else if (entityType === 'contact') {
        await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.byContact(specificEntityId) });
      }
    }
    
    // Invalidate any other related queries that might be affected
    await queryClient.invalidateQueries({ queryKey: ['/api/deals'] }); // Deal list might show activity counts
    await queryClient.invalidateQueries({ queryKey: ['/api/accounts'] }); // Account list might show activity counts
    await queryClient.invalidateQueries({ queryKey: ['/api/contacts'] }); // Contact list might show activity counts
  };

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: async (newActivity: Partial<Activity>) => {
      return apiRequest('/api/activities', {
        method: 'POST',
        body: JSON.stringify(newActivity),
      });
    },
    onSuccess: async (data, variables) => {
      // Optimistic update
      queryClient.setQueryData(ACTIVITY_QUERY_KEYS.all(), (old: Activity[] | undefined) => {
        if (!old) return [data];
        return [data, ...old];
      });
      
      // Comprehensive invalidation
      await invalidateActivitiesCache(
        variables.relatedToId || variables.accountId || variables.dealId || variables.contactId,
        variables.relatedToType || (variables.accountId ? 'account' : variables.dealId ? 'deal' : variables.contactId ? 'contact' : undefined)
      );
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all() });
    }
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Activity> & { id: string }) => {
      return apiRequest(`/api/activities/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: async (data, variables) => {
      // Optimistic update
      queryClient.setQueryData(ACTIVITY_QUERY_KEYS.all(), (old: Activity[] | undefined) => {
        if (!old) return [data];
        return old.map(activity => activity.id === variables.id ? { ...activity, ...data } : activity);
      });
      
      // Comprehensive invalidation
      await invalidateActivitiesCache(
        variables.relatedToId || variables.accountId || variables.dealId || variables.contactId,
        variables.relatedToType || (variables.accountId ? 'account' : variables.dealId ? 'deal' : variables.contactId ? 'contact' : undefined)
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all() });
    }
  });

  // Complete activity mutation
  const completeActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      return apiRequest(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ completedAt: new Date().toISOString() }),
      });
    },
    onSuccess: async (data, activityId) => {
      // Optimistic update
      queryClient.setQueryData(ACTIVITY_QUERY_KEYS.all(), (old: Activity[] | undefined) => {
        if (!old) return old;
        return old.map(activity => 
          activity.id === activityId 
            ? { ...activity, status: 'completed' as const, completedAt: new Date().toISOString() }
            : activity
        );
      });
      
      // Find the activity to get related entity info
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        await invalidateActivitiesCache(
          activity.relatedToId || activity.accountId || activity.dealId || activity.contactId,
          activity.relatedToType || (activity.accountId ? 'account' : activity.dealId ? 'deal' : activity.contactId ? 'contact' : undefined)
        );
      } else {
        await invalidateActivitiesCache();
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all() });
    }
  });

  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      return apiRequest(`/api/activities/${activityId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: async (data, activityId) => {
      // Find the activity before deletion for cache invalidation
      const activity = activities.find(a => a.id === activityId);
      
      // Optimistic update
      queryClient.setQueryData(ACTIVITY_QUERY_KEYS.all(), (old: Activity[] | undefined) => {
        if (!old) return old;
        return old.filter(activity => activity.id !== activityId);
      });
      
      // Comprehensive invalidation
      if (activity) {
        await invalidateActivitiesCache(
          activity.relatedToId || activity.accountId || activity.dealId || activity.contactId,
          activity.relatedToType || (activity.accountId ? 'account' : activity.dealId ? 'deal' : activity.contactId ? 'contact' : undefined)
        );
      } else {
        await invalidateActivitiesCache();
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all() });
    }
  });

  // Sync function to manually trigger cache refresh across all modules
  const syncActivities = async () => {
    await Promise.all([
      refetchActivities(),
      refetchMetrics(),
      invalidateActivitiesCache()
    ]);
  };

  // Get activities filtered by entity
  const getActivitiesByEntity = (entityType: string, entityId: string) => {
    return activities.filter(activity => {
      // Direct relationship
      if (activity.relatedToType === entityType && activity.relatedToId === entityId) return true;
      
      // Specific field relationships
      if (entityType === 'account' && activity.accountId === entityId) return true;
      if (entityType === 'deal' && activity.dealId === entityId) return true;
      if (entityType === 'contact' && activity.contactId === entityId) return true;
      if (entityType === 'lead' && activity.leadId === entityId) return true;
      
      return false;
    });
  };

  return {
    // Data
    activities,
    metrics,
    isLoading,
    metricsLoading,
    error,
    metricsError,
    
    // Mutations
    createActivity: createActivityMutation,
    updateActivity: updateActivityMutation,
    completeActivity: completeActivityMutation,
    deleteActivity: deleteActivityMutation,
    
    // Utilities
    syncActivities,
    invalidateActivitiesCache,
    getActivitiesByEntity,
    refetchActivities,
    refetchMetrics,
    
    // Query keys for external use
    queryKeys: ACTIVITY_QUERY_KEYS
  };
};