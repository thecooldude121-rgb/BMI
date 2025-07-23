import React from 'react';
import { User, Phone, Mail, Building, Star, Calendar, DollarSign, MapPin } from 'lucide-react';

interface Lead {
  id: string;
  company: string;
  contact: string;
  title: string;
  email: string;
  phone: string;
  stage: string;
  source: string;
  priority: string;
  rating: number;
  value: number;
  created_at: string;
}

interface LeadsTileViewProps {
  leads: Lead[];
  selectedLeads: string[];
  onSelectLead: (leadId: string) => void;
  onLeadClick: (lead: Lead) => void;
  isSelectionMode: boolean;
}

const LeadsTileView: React.FC<LeadsTileViewProps> = ({
  leads,
  selectedLeads,
  onSelectLead,
  onLeadClick,
  isSelectionMode
}) => {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'qualified': return 'text-yellow-600 bg-yellow-100';
      case 'proposal': return 'text-purple-600 bg-purple-100';
      case 'negotiation': return 'text-orange-600 bg-orange-100';
      case 'closed_won': return 'text-green-600 bg-green-100';
      case 'closed_lost': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {leads.map(lead => (
        <div
          key={lead.id}
          className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
            selectedLeads.includes(lead.id)
              ? 'border-blue-500 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onLeadClick(lead)}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{lead.contact}</h3>
                    <p className="text-sm text-gray-600 truncate">{lead.title}</p>
                  </div>
                </div>
              </div>
              
              {isSelectionMode && (
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectLead(lead.id);
                  }}
                  className="rounded border-gray-300"
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Company */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="truncate">{lead.company}</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="truncate">{lead.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-3 w-3 text-gray-400" />
                <span>{lead.phone}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              {renderStars(lead.rating)}
              <span className="text-sm text-gray-600 ml-2">({lead.rating}/5)</span>
            </div>

            {/* Value */}
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-green-600">{formatValue(lead.value)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(lead.stage)}`}>
                  {lead.stage.replace('_', ' ')}
                </span>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                  {lead.priority}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Source: <span className="capitalize">{lead.source.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadsTileView;