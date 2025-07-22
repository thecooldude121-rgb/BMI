import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, User, CheckSquare, Square } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BulkActionsDropdown from '../../components/CRM/BulkActionsDropdown';
import { apiRequest } from '../../lib/queryClient';

const DealsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: deals = [], isLoading: dealsLoading } = useQuery({
    queryKey: ['/api/deals'],
  });
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
  });
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const deleteDealsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiRequest('/api/deals', {
        method: 'DELETE',
        body: { ids }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      setSelectedDeals([]);
      setIsSelectionMode(false);
    }
  });

  const dealsArray = Array.isArray(deals) ? deals : [];
  const leadsArray = Array.isArray(leads) ? leads : [];

  const getStageColor = (stage: string) => {
    const colors = {
      proposal: 'bg-blue-100 text-blue-800',
      negotiation: 'bg-yellow-100 text-yellow-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLeadName = (leadId: string) => {
    const lead = leadsArray.find((l: any) => l.id === leadId);
    return lead ? lead.name : 'Unknown Lead';
  };

  const totalValue = dealsArray.reduce((sum: number, deal: any) => sum + parseFloat(deal.value || 0), 0);
  const wonDeals = dealsArray.filter((deal: any) => deal.stage === 'closed-won');
  const wonValue = wonDeals.reduce((sum: number, deal: any) => sum + parseFloat(deal.value || 0), 0);

  const handleSelectDeal = (dealId: string) => {
    setSelectedDeals(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDeals.length === dealsArray.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(dealsArray.map((deal: any) => deal.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDeals.length > 0 && window.confirm(`Delete ${selectedDeals.length} selected deals?`)) {
      deleteDealsMutation.mutate(selectedDeals);
    }
  };

  const handleBulkTransfer = () => {
    alert(`Bulk Transfer feature for ${selectedDeals.length} deals - Coming Soon!`);
  };

  const handleBulkUpdate = () => {
    alert(`Bulk Update feature for ${selectedDeals.length} deals - Coming Soon!`);
  };

  const handleBulkEmail = () => {
    alert(`Bulk Email feature for ${selectedDeals.length} deals - Coming Soon!`);
  };

  const handlePrintView = () => {
    alert(`Print View feature for ${selectedDeals.length} deals - Coming Soon!`);
  };

  if (dealsLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading deals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Won Deals</p>
              <p className="text-2xl font-bold text-gray-900">${wonValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">
                {dealsArray.filter((d: any) => !d.stage.startsWith('closed')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <User className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {dealsArray.length > 0 ? Math.round((wonDeals.length / dealsArray.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Deals</h2>
          <p className="text-gray-600">{dealsArray.length} deals</p>
        </div>
        <div className="flex space-x-3">
          {isSelectionMode ? (
            <>
              <button
                onClick={handleSelectAll}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                {selectedDeals.length === dealsArray.length ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
                Select All
              </button>
              <BulkActionsDropdown
                selectedItems={selectedDeals}
                itemType="deals"
                onBulkTransfer={handleBulkTransfer}
                onBulkUpdate={handleBulkUpdate}
                onBulkDelete={handleDeleteSelected}
                onBulkEmail={handleBulkEmail}
                onPrintView={handlePrintView}
                isVisible={true}
              />
              <button
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedDeals([]);
                }}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSelectionMode(true)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Select
            </button>
          )}
        </div>
      </div>

      {/* Deals List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Deals ({dealsArray.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isSelectionMode && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <CheckSquare className="h-4 w-4" />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Close
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dealsArray.length === 0 ? (
                <tr>
                  <td colSpan={isSelectionMode ? 8 : 7} className="px-6 py-8 text-center text-gray-500">
                    No deals found
                  </td>
                </tr>
              ) : (
                dealsArray.map((deal: any) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  {isSelectionMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSelectDeal(deal.id)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        {selectedDeals.includes(deal.id) ? 
                          <CheckSquare className="h-5 w-5 text-blue-600" /> : 
                          <Square className="h-5 w-5" />
                        }
                      </button>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{deal.title || deal.name}</div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(deal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getLeadName(deal.leadId || deal.contactId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${parseInt(deal.value || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                      {deal.stage.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">{deal.probability}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : 'No date set'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.assignedTo || 'Unassigned'}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;