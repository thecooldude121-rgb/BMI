import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

// Generic API hooks for CRM entities
export function useLeads() {
  return useQuery({ 
    queryKey: ['/api/leads'],
    queryFn: () => apiRequest('/api/leads')
  });
}

export function useLead(id: string) {
  return useQuery({ 
    queryKey: ['/api/leads', id],
    queryFn: () => apiRequest(`/api/leads/${id}`)
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/leads', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    }
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/leads/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    }
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/api/leads/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    }
  });
}

// Accounts (Companies)
export function useAccounts() {
  return useQuery({ queryKey: ['/api/accounts'] });
}

export function useAccount(id: string) {
  return useQuery({ 
    queryKey: ['/api/accounts', id],
    queryFn: () => apiRequest(`/api/accounts/${id}`)
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/accounts', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    }
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/accounts/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    }
  });
}

// Contacts
export function useContacts() {
  return useQuery({ queryKey: ['/api/contacts'] });
}

export function useContact(id: string) {
  return useQuery({ 
    queryKey: ['/api/contacts', id],
    queryFn: () => apiRequest(`/api/contacts/${id}`)
  });
}

export function useContactsByAccount(accountId: string) {
  return useQuery({ 
    queryKey: ['/api/contacts', 'by-account', accountId],
    queryFn: () => apiRequest(`/api/contacts/by-account/${accountId}`)
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/contacts', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    }
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/contacts/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    }
  });
}

// Deals
export function useDeals() {
  return useQuery({ queryKey: ['/api/deals'] });
}

export function useDeal(id: string) {
  return useQuery({ 
    queryKey: ['/api/deals', id],
    queryFn: () => apiRequest(`/api/deals/${id}`)
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/deals', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
    }
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/deals/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
    }
  });
}

// Tasks
export function useTasks() {
  return useQuery({ queryKey: ['/api/tasks'] });
}

export function useTask(id: string) {
  return useQuery({ 
    queryKey: ['/api/tasks', id],
    queryFn: () => apiRequest(`/api/tasks/${id}`)
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/tasks', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/tasks/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    }
  });
}

// Activities
export function useActivities() {
  return useQuery({ queryKey: ['/api/activities'] });
}

export function useActivity(id: string) {
  return useQuery({ 
    queryKey: ['/api/activities', id],
    queryFn: () => apiRequest(`/api/activities/${id}`)
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/activities', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    }
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/activities/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    }
  });
}

// Meetings
export function useMeetings() {
  return useQuery({ queryKey: ['/api/meetings'] });
}

export function useMeeting(id: string) {
  return useQuery({ 
    queryKey: ['/api/meetings', id],
    queryFn: () => apiRequest(`/api/meetings/${id}`)
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/meetings', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
    }
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest(`/api/meetings/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meetings'] });
    }
  });
}