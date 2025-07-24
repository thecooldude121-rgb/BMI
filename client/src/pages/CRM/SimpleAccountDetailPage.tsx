import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'wouter';
import { 
  Building, ArrowLeft, Users, Target, Activity, Brain, FileText, Link
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { GrowthRecommendations } from '@/components/GrowthRecommendations';

interface Account {
  id: string;
  name: string;
  industry?: string;
  companySize?: string;
  website?: string;
  phone?: string;
  description?: string;
  healthScore?: number;
  contacts?: any[];
  deals?: any[];
  leads?: any[];
}

const SimpleAccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch account data
  const { data: account, isLoading, error } = useQuery({
    queryKey: ['account-simple', id],
    queryFn: () => apiRequest(`/api/accounts/${id}/with-relations`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Account</h3>
          <p className="text-red-600 mt-1">{String(error) || 'Account not found'}</p>
          <p className="text-sm text-gray-600 mt-2">Account ID: {id}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'deals', label: 'Deals', icon: Target },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'growth', label: 'AI Growth', icon: Brain },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'hierarchy', label: 'Hierarchy', icon: Link },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-gray-600">{account.industry || 'Unknown Industry'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{account.companySize || 'Unknown Size'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium text-sm">Contacts</p>
                <p className="text-blue-900 text-xl font-bold">{account.contacts?.length || 0}</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium text-sm">Deals</p>
                <p className="text-green-900 text-xl font-bold">{account.deals?.length || 0}</p>
              </div>
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium text-sm">Health Score</p>
                <p className="text-purple-900 text-xl font-bold">{account.healthScore || 0}</p>
              </div>
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 font-medium text-sm">Leads</p>
                <p className="text-orange-900 text-xl font-bold">{account.leads?.length || 0}</p>
              </div>
              <Building className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-2" />
                {tab.label}
                {tab.id === 'growth' && (
                  <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{account.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Industry:</span>
                    <span className="ml-2 text-gray-900">{account.industry || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Company Size:</span>
                    <span className="ml-2 text-gray-900">{account.companySize || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Website:</span>
                    {account.website ? (
                      <a href={account.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                        {account.website}
                      </a>
                    ) : (
                      <span className="ml-2 text-gray-900">Not specified</span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="ml-2 text-gray-900">{account.phone || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{account.description || 'No description available'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <GrowthRecommendations accountId={id!} />
        )}

        {activeTab !== 'overview' && activeTab !== 'growth' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="py-12">
              <div className="text-gray-400 mb-4">
                {activeTab === 'contacts' && <Users className="w-12 h-12 mx-auto" />}
                {activeTab === 'deals' && <Target className="w-12 h-12 mx-auto" />}
                {activeTab === 'activities' && <Activity className="w-12 h-12 mx-auto" />}
                {activeTab === 'documents' && <FileText className="w-12 h-12 mx-auto" />}
                {activeTab === 'hierarchy' && <Link className="w-12 h-12 mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 capitalize">{activeTab} View</h3>
              <p className="text-gray-500">
                {activeTab === 'contacts' && `${account.contacts?.length || 0} contacts found`}
                {activeTab === 'deals' && `${account.deals?.length || 0} deals found`}
                {activeTab === 'activities' && 'Activity management coming soon'}
                {activeTab === 'documents' && 'Document management coming soon'}
                {activeTab === 'hierarchy' && 'Account hierarchy coming soon'}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SimpleAccountDetailPage;