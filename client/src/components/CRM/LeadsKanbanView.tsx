import React from 'react';
import { User, Phone, Mail, Building, Star, Calendar, DollarSign } from 'lucide-react';

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

interface LeadsKanbanViewProps {
  leads: Lead[];
  selectedLeads: string[];
  onSelectLead: (leadId: string) => void;
  onLeadClick: (lead: Lead) => void;
  isSelectionMode: boolean;
}

const LeadsKanbanView: React.FC<LeadsKanbanViewProps> = ({
  leads,
  selectedLeads,
  onSelectLead,
  onLeadClick,
  isSelectionMode
}) => {
  const stages = [
    { key: 'new', label: 'New Leads', color: 'bg-blue-50 border-blue-200' },
    { key: 'qualified', label: 'Qualified', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'proposal', label: 'Proposal', color: 'bg-purple-50 border-purple-200' },
    { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-50 border-orange-200' },
    { key: 'closed_won', label: 'Closed Won', color: 'bg-green-50 border-green-200' },
    { key: 'closed_lost', label: 'Closed Lost', color: 'bg-red-50 border-red-200' }
  ];

  const getLeadsByStage = (stage: string) => {
    return leads.filter(lead => lead.stage === stage);
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

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {stages.map(stage => {
        const stageLeads = getLeadsByStage(stage.key);
        
        return (
          <div key={stage.key} className={`flex-shrink-0 w-80 ${stage.color} rounded-lg border-2 border-dashed`}>
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
              <h3 className="font-semibold text-gray-900">{stage.label}</h3>
              <p className="text-sm text-gray-500">{stageLeads.length} leads</p>
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {stageLeads.map(lead => (
                <div
                  key={lead.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onLeadClick(lead)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{lead.contact}</h4>
                      <p className="text-sm text-gray-600 truncate">{lead.title} at {lead.company}</p>
                    </div>
                    
                    {isSelectionMode && (
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead.id);
                        }}
                        className="ml-2 rounded border-gray-300"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{lead.phone}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span className="text-sm text-gray-600">{lead.rating}/5</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatValue(lead.value)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                      
                      <span className="text-xs text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {stageLeads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No leads in this stage</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadsKanbanView;