import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, Upload, Download, CheckCircle, AlertCircle, 
  Clock, Settings, ArrowRightLeft
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';

interface SyncStatus {
  lastSync: string;
  syncEnabled: boolean;
  totalSynced: {
    leads: number;
    companies: number;
    activities: number;
  };
  errors: string[];
  webhookStatus: string;
}

interface SyncPanelProps {
  module: 'leads' | 'companies' | 'activities';
  selectedIds?: string[];
  onSyncComplete?: () => void;
}

const SyncPanel: React.FC<SyncPanelProps> = ({ module, selectedIds = [], onSyncComplete }) => {
  const [syncDirection, setSyncDirection] = useState<'to_crm' | 'from_crm'>('to_crm');
  const queryClient = useQueryClient();

  // Get sync status
  const { data: syncStatus, isLoading: statusLoading } = useQuery<SyncStatus>({
    queryKey: ['/api/sync/status'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Manual sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/sync/manual/${module}`, {
        method: 'POST',
        body: JSON.stringify({
          direction: syncDirection,
          ids: selectedIds.length > 0 ? selectedIds : undefined
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sync/status'] });
      onSyncComplete?.();
    }
  });

  const handleSync = () => {
    syncMutation.mutate();
  };

  const getModuleIcon = () => {
    switch (module) {
      case 'leads': return '👥';
      case 'companies': return '🏢';
      case 'activities': return '📋';
      default: return '🔄';
    }
  };

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-4 card-modern"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <ArrowRightLeft className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              CRM Sync - {module.charAt(0).toUpperCase() + module.slice(1)}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedIds.length > 0 
                ? `${selectedIds.length} items selected` 
                : 'All items'
              }
            </p>
          </div>
        </div>
        <span className="text-2xl">{getModuleIcon()}</span>
      </div>

      {/* Sync Status */}
      {syncStatus && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Sync Status</span>
            <div className="flex items-center space-x-1">
              {syncStatus.webhookStatus === 'active' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs text-gray-600">
                {syncStatus.webhookStatus}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-white rounded border">
              <div className="text-lg font-bold text-blue-600">
                {syncStatus.totalSynced.leads}
              </div>
              <div className="text-xs text-gray-600">Leads</div>
            </div>
            <div className="p-2 bg-white rounded border">
              <div className="text-lg font-bold text-purple-600">
                {syncStatus.totalSynced.companies}
              </div>
              <div className="text-xs text-gray-600">Companies</div>
            </div>
            <div className="p-2 bg-white rounded border">
              <div className="text-lg font-bold text-green-600">
                {syncStatus.totalSynced.activities}
              </div>
              <div className="text-xs text-gray-600">Activities</div>
            </div>
          </div>

          {syncStatus.lastSync && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Sync Direction */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sync Direction
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => setSyncDirection('to_crm')}
            className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
              syncDirection === 'to_crm'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="h-4 w-4 mx-auto mb-1" />
            Push to CRM
          </button>
          <button
            onClick={() => setSyncDirection('from_crm')}
            className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
              syncDirection === 'from_crm'
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Download className="h-4 w-4 mx-auto mb-1" />
            Pull from CRM
          </button>
        </div>
      </div>

      {/* Sync Actions */}
      <div className="space-y-2">
        <button
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="btn-primary w-full py-3 px-4 flex items-center justify-center space-x-2 hover-glow"
        >
          {syncMutation.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>
            {syncMutation.isPending 
              ? 'Syncing...' 
              : `Sync ${module.charAt(0).toUpperCase() + module.slice(1)}`
            }
          </span>
        </button>

        {syncMutation.isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Sync completed successfully!
              </span>
            </div>
          </motion.div>
        )}

        {syncMutation.isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Sync failed. Please try again.
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Advanced Settings */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
          <Settings className="h-3 w-3" />
          <span>Advanced Settings</span>
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p>• Webhook URL: /api/sync/webhook/{module}</p>
          <p>• Auto-sync: {syncStatus?.syncEnabled ? 'Enabled' : 'Disabled'}</p>
          <p>• Batch size: 50 items</p>
        </div>
      </details>
    </motion.div>
  );
};

export default SyncPanel;