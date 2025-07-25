// Gamification integration hooks for CRM events
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GamificationAction {
  actionType: string;
  targetEntity: string;
  entityId: string;
  userId: string;
  points?: number;
  context?: any;
}

export const useGamificationTrigger = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (actionData: GamificationAction) => {
      const response = await fetch('/api/gamification/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger gamification action');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refresh UI
      queryClient.invalidateQueries({ 
        queryKey: [`/api/gamification/profile/${variables.userId}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/gamification/notifications/${variables.userId}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/gamification/leaderboard'] 
      });
    }
  });
};

// Hook for common CRM actions
export const useCRMGamification = (userId: string = 'f310c13c-3edf-4f46-a6ec-46503ed02377') => {
  const triggerAction = useGamificationTrigger();
  
  const triggerLeadCreated = (leadId: string, leadData?: any) => {
    triggerAction.mutate({
      actionType: 'lead_created',
      targetEntity: 'leads',
      entityId: leadId,
      userId,
      points: 20,
      context: { leadName: leadData?.name, source: leadData?.source }
    });
  };
  
  const triggerDealCreated = (dealId: string, dealData?: any) => {
    triggerAction.mutate({
      actionType: 'deal_created',
      targetEntity: 'deals',
      entityId: dealId,
      userId,
      points: 30,
      context: { dealName: dealData?.name, value: dealData?.value }
    });
  };
  
  const triggerDealWon = (dealId: string, dealValue?: number) => {
    const points = dealValue ? Math.min(Math.floor(dealValue / 1000), 200) : 50;
    triggerAction.mutate({
      actionType: 'deal_won',
      targetEntity: 'deals',
      entityId: dealId,
      userId,
      points,
      context: { dealValue, winDate: new Date().toISOString() }
    });
  };
  
  const triggerActivityCompleted = (activityId: string, activityType?: string) => {
    const pointMap: Record<string, number> = {
      'call': 15,
      'email': 10,
      'meeting': 25,
      'task': 12,
      'note': 8
    };
    
    triggerAction.mutate({
      actionType: 'activity_completed',
      targetEntity: 'activities',
      entityId: activityId,
      userId,
      points: pointMap[activityType || 'task'] || 10,
      context: { activityType, completedAt: new Date().toISOString() }
    });
  };
  
  const triggerContactCreated = (contactId: string, contactData?: any) => {
    triggerAction.mutate({
      actionType: 'contact_created',
      targetEntity: 'contacts',
      entityId: contactId,
      userId,
      points: 12,
      context: { contactName: contactData?.name, company: contactData?.company }
    });
  };
  
  const triggerAccountCreated = (accountId: string, accountData?: any) => {
    triggerAction.mutate({
      actionType: 'account_created',
      targetEntity: 'accounts',
      entityId: accountId,
      userId,
      points: 25,
      context: { accountName: accountData?.name, industry: accountData?.industry }
    });
  };
  
  const triggerCallMade = (activityId: string, outcome?: string) => {
    const outcomePoints: Record<string, number> = {
      'successful': 15,
      'voicemail': 8,
      'no_answer': 5,
      'busy': 3
    };
    
    triggerAction.mutate({
      actionType: 'call_made',
      targetEntity: 'activities',
      entityId: activityId,
      userId,
      points: outcomePoints[outcome || 'successful'] || 10,
      context: { outcome, callDate: new Date().toISOString() }
    });
  };
  
  const triggerEmailSent = (activityId: string, emailData?: any) => {
    triggerAction.mutate({
      actionType: 'email_sent',
      targetEntity: 'activities',
      entityId: activityId,
      userId,
      points: 8,
      context: { subject: emailData?.subject, recipients: emailData?.recipients }
    });
  };
  
  const triggerMeetingScheduled = (meetingId: string, meetingData?: any) => {
    triggerAction.mutate({
      actionType: 'meeting_scheduled',
      targetEntity: 'meetings',
      entityId: meetingId,
      userId,
      points: 20,
      context: { 
        meetingType: meetingData?.type, 
        participants: meetingData?.participants,
        scheduledFor: meetingData?.scheduledDate
      }
    });
  };
  
  const triggerDailyLogin = () => {
    triggerAction.mutate({
      actionType: 'daily_login',
      targetEntity: 'user',
      entityId: userId,
      userId,
      points: 5,
      context: { loginTime: new Date().toISOString() }
    });
  };
  
  return {
    triggerLeadCreated,
    triggerDealCreated,
    triggerDealWon,
    triggerActivityCompleted,
    triggerContactCreated,
    triggerAccountCreated,
    triggerCallMade,
    triggerEmailSent,
    triggerMeetingScheduled,
    triggerDailyLogin,
    isLoading: triggerAction.isPending
  };
};

// Badge earning notification component
export const GamificationToast = ({ notification, onClose }: any) => {
  if (!notification) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">{notification.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
            {notification.data?.points && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                +{notification.data.points} XP
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};