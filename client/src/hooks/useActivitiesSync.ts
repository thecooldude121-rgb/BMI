import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Activity, ActivityMetrics } from '@/types/crm';

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

  // Comprehensive cache invalidation function with enhanced Lead Gen sync
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
        // Invalidate deal detail queries that might show activities
        await queryClient.invalidateQueries({ queryKey: ['/api/deals', specificEntityId] });
        await queryClient.invalidateQueries({ queryKey: ['/api/deals', specificEntityId, 'activities'] });
      } else if (entityType === 'account') {
        await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.byAccount(specificEntityId) });
        // Invalidate account detail queries that might show activities
        await queryClient.invalidateQueries({ queryKey: ['/api/accounts', specificEntityId] });
        await queryClient.invalidateQueries({ queryKey: ['/api/accounts', specificEntityId, 'activities'] });
        // CRITICAL: Invalidate Lead Gen company detail queries for bidirectional sync
        await queryClient.invalidateQueries({ queryKey: ['/api/deals/by-account', specificEntityId] });
        await queryClient.invalidateQueries({ queryKey: ['/api/contacts/by-account', specificEntityId] });
      } else if (entityType === 'contact') {
        await queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.byContact(specificEntityId) });
        // Invalidate contact detail queries that might show activities
        await queryClient.invalidateQueries({ queryKey: ['/api/contacts', specificEntityId] });
        await queryClient.invalidateQueries({ queryKey: ['/api/contacts', specificEntityId, 'activities'] });
      }
    }
    
    // Invalidate any other related queries that might be affected
    await queryClient.invalidateQueries({ queryKey: ['/api/deals'] }); // Deal list might show activity counts
    await queryClient.invalidateQueries({ queryKey: ['/api/accounts'] }); // Account list might show activity counts
    await queryClient.invalidateQueries({ queryKey: ['/api/contacts'] }); // Contact list might show activity counts
    
    // ENHANCED: Invalidate Lead Generation module queries for bidirectional sync
    await queryClient.invalidateQueries({ queryKey: ['/api/deals/by-account'] }); // All account-deal relationships
    await queryClient.invalidateQueries({ queryKey: ['/api/contacts/by-account'] }); // All account-contact relationships
    await queryClient.invalidateQueries({ queryKey: ['/api/lead-generation'] }); // Lead gen specific queries
    
    console.log('🔄 Enhanced Activities Sync: Invalidated all CRM and Lead Gen caches for bidirectional sync');
  };

  // Enhanced create activity mutation with bidirectional sync
  const createActivityMutation = useMutation({
    mutationFn: async (newActivity: Partial<Activity> & { source?: 'crm' | 'leadgen' | 'deal' }) => {
      console.log(`🔄 Creating activity from ${newActivity.source || 'unknown'} module:`, newActivity);
      return apiRequest('/api/activities', {
        method: 'POST',
        body: newActivity, // Remove JSON.stringify - apiRequest handles this
      });
    },
    onSuccess: async (data, variables) => {
      console.log('✅ Activity created successfully:', data);
      
      // Optimistic update
      queryClient.setQueryData(ACTIVITY_QUERY_KEYS.all(), (old: Activity[] | undefined) => {
        if (!old) return [data];
        return [data, ...old];
      });
      
      // Comprehensive invalidation with source tracking for enhanced sync
      await invalidateActivitiesCache(
        variables.relatedToId || variables.accountId || variables.dealId || variables.contactId,
        variables.relatedToType || (variables.accountId ? 'account' : variables.dealId ? 'deal' : variables.contactId ? 'contact' : undefined)
      );
      
      // If created from Lead Gen, ensure CRM modules are notified
      if (variables.source === 'leadgen') {
        console.log('🔄 Activity created from Lead Gen - triggering enhanced CRM sync');
        await queryClient.invalidateQueries({ queryKey: ['/api/activities/by-assignee'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/crm'] });
      }
      
      // If created from CRM, ensure Lead Gen modules are notified
      if (variables.source === 'crm') {
        console.log('🔄 Activity created from CRM - triggering enhanced Lead Gen sync');
        await queryClient.invalidateQueries({ queryKey: ['lead-generation'], exact: false });
      }
    },
    onError: (error) => {
      console.error('❌ Failed to create activity:', error);
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEYS.all() });
    }
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Activity> & { id: string }) => {
      return apiRequest(`/api/activities/${id}`, {
        method: 'PATCH',
        body: updates, // Remove JSON.stringify - apiRequest handles this
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

  // Enhanced sync function to manually trigger cache refresh across all modules
  const syncActivities = async (triggeredFrom?: 'crm' | 'leadgen' | 'deal') => {
    console.log(`🔄 Syncing activities across all modules (triggered from: ${triggeredFrom || 'unknown'})`);
    
    await Promise.all([
      refetchActivities(),
      refetchMetrics(),
      invalidateActivitiesCache()
    ]);
    
    // Additional Lead Gen specific sync if triggered from Lead Gen
    if (triggeredFrom === 'leadgen') {
      // Force refresh of all Lead Gen related queries
      await queryClient.invalidateQueries({ 
        queryKey: ['lead-generation'], 
        exact: false 
      });
    }
    
    console.log('✅ Activities sync completed across all modules');
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