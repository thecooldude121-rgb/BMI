import React, { useState } from 'react';
import { X, User, Building, Phone, Mail, Star, Calendar, Tag, Edit, Activity, Clock } from 'lucide-react';

interface LeadDetailPanelProps {
  lead: any;
  onClose: () => void;
  onEdit: () => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({ lead, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStageColor = (stage: string) => {
    const colors = {
      new: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-yellow-100 text-yellow-800',
      proposal: 'bg-purple-100 text-purple-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSourceLabel = (source: string) => {
    const labels = {
      website: 'Website',
      social_media: 'Social Media',
      email_campaign: 'Email Campaign',
      referral: 'Referral',
      cold_call: 'Cold Call',
      trade_show: 'Trade Show',
      advertisement: 'Advertisement',
      partner: 'Partner'
    };
    return labels[source as keyof typeof labels] || source;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'timeline', name: 'Timeline', icon: Clock }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-6">
            {/* Lead Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
              <p className="text-gray-600">{lead.position} at {lead.company}</p>
              
              {/* Status Badges */}
              <div className="flex justify-center space-x-2 mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(lead.stage)}`}>
                  {lead.stage?.charAt(0).toUpperCase() + lead.stage?.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                  {lead.priority?.charAt(0).toUpperCase() + lead.priority?.slice(1)} Priority
                </span>
              </div>
            </div>

            {/* Lead Rating */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Rating</label>
              <div className="flex justify-center items-center space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (lead.rating || 1) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{lead.rating || 1}/5</span>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{lead.email}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{lead.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">{lead.company}</span>
                </div>
              </div>
            </div>

            {/* Lead Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Lead Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Source</span>
                  <span className="text-sm text-gray-900">{getSourceLabel(lead.source)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Industry</span>
                  <span className="text-sm text-gray-900">{lead.industry || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Lead Value</span>
                  <span className="text-sm text-gray-900">${parseInt(lead.value || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Probability</span>
                  <span className="text-sm text-gray-900">{lead.probability || 0}%</span>
                </div>
                {lead.expectedCloseDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Expected Close</span>
                    <span className="text-sm text-gray-900">
                      {new Date(lead.expectedCloseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {lead.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{lead.notes}</p>
              </div>
            )}

            {/* Creation Date */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created</span>
                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="p-4">
            <div className="text-center text-gray-500 py-8">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No activities recorded yet</p>
              <button className="mt-2 text-blue-600 text-sm hover:text-blue-500">
                + Add Activity
              </button>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="p-4">
            <div className="text-center text-gray-500 py-8">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No timeline events yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetailPanel;