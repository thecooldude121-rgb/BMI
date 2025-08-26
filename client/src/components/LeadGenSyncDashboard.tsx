import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, Users, Settings, Building, DollarSign,
  Clock, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';

interface LeadGenSyncDashboardProps {
  accountId: string;
  leadGenData?: any;
  syncStatus?: any;
  onSync: () => void;
  isSyncing: boolean;
}

export const LeadGenSyncDashboard: React.FC<LeadGenSyncDashboardProps> = ({
  accountId,
  leadGenData,
  syncStatus,
  onSync,
  isSyncing
}) => {
  const getSyncStatusColor = () => {
    if (!syncStatus) return 'bg-gray-100 text-gray-700';
    switch (syncStatus.status) {
      case 'synced': return 'bg-green-100 text-green-700';
      case 'partial': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSyncStatusIcon = () => {
    if (isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (!syncStatus) return <AlertCircle className="w-4 h-4" />;
    switch (syncStatus.status) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!leadGenData && !syncStatus) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Generation Sync Available</h3>
          <p className="text-gray-600 mb-4">
            Sync this account with Lead Generation to access enriched company data, 
            technology stack information, and executive details.
          </p>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center mx-auto"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isSyncing ? 'Syncing...' : 'Sync with Lead Generation'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Sync Status Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lead Generation Integration</h3>
              <p className="text-sm text-gray-600">
                Enhanced with company intelligence and market data
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getSyncStatusColor()}`}>
              {getSyncStatusIcon()}
              <span>{isSyncing ? 'Syncing...' : syncStatus?.status || 'Not Synced'}</span>
            </div>
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Sync Now
            </button>
          </div>
        </div>

        {syncStatus?.lastSyncAt && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Last synced: {new Date(syncStatus.lastSyncAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Enrichment Metrics */}
      {leadGenData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium text-sm">Technologies</p>
                <p className="text-blue-900 text-xl font-bold">
                  {leadGenData.technologies?.length || 0}
                </p>
              </div>
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium text-sm">Executives</p>
                <p className="text-green-900 text-xl font-bold">
                  {leadGenData.executives?.length || 0}
                </p>
              </div>
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium text-sm">Enrichment</p>
                <p className="text-purple-900 text-xl font-bold">
                  {syncStatus?.enrichmentLevel || 'Basic'}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Indicators */}
      {leadGenData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Overview</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Company Information</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Technology Stack</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: `${leadGenData.technologies?.length ? Math.min(100, leadGenData.technologies.length * 10) : 0}%`}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{leadGenData.technologies?.length || 0} items</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Executive Team</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: `${leadGenData.executives?.length ? Math.min(100, leadGenData.executives.length * 20) : 0}%`}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{leadGenData.executives?.length || 0} profiles</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};