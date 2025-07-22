import React, { useState } from 'react';
import { Plus, Settings, BarChart3, Filter, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import PipelineBoard from '../../components/CRM/PipelineBoard';
import DealForm from '../../components/CRM/DealForm';
import { Pipeline, Deal, PipelineStage } from '../../types/crm';

const PipelinePage: React.FC = () => {
  const { deals, updateDeal, addDeal } = useData();
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>();
  const [selectedStageId, setSelectedStageId] = useState<string>('');

  // Mock pipeline data - in a real app, this would come from the data context
  const mockPipeline: Pipeline = {
    id: '1',
    name: 'Sales Pipeline',
    description: 'Main sales pipeline for all deals',
    entityType: 'deal',
    isDefault: true,
    isActive: true,
    stages: [
      {
        id: 'qualification',
        name: 'Qualification',
        description: 'Initial qualification of the opportunity',
        color: '#6B7280',
        position: 1,
        probability: 10,
        isClosedWon: false,
        isClosedLost: false,
        requirements: ['Budget confirmed', 'Decision maker identified']
      },
      {
        id: 'proposal',
        name: 'Proposal',
        description: 'Proposal sent to prospect',
        color: '#3B82F6',
        position: 2,
        probability: 25,
        isClosedWon: false,
        isClosedLost: false,
        requirements: ['Proposal submitted', 'Requirements gathered']
      },
      {
        id: 'negotiation',
        name: 'Negotiation',
        description: 'Negotiating terms and pricing',
        color: '#F59E0B',
        position: 3,
        probability: 50,
        isClosedWon: false,
        isClosedLost: false,
        requirements: ['Terms discussed', 'Pricing agreed']
      },
      {
        id: 'closed-won',
        name: 'Closed Won',
        description: 'Deal successfully closed',
        color: '#10B981',
        position: 4,
        probability: 100,
        isClosedWon: true,
        isClosedLost: false
      },
      {
        id: 'closed-lost',
        name: 'Closed Lost',
        description: 'Deal lost to competitor or cancelled',
        color: '#EF4444',
        position: 5,
        probability: 0,
        isClosedWon: false,
        isClosedLost: true
      }
    ],
    settings: {
      autoRotting: true,
      rottingDays: 30,
      probabilityEnabled: true,
      forecastEnabled: true
    },
    createdBy: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Convert existing deals to match the new structure
  const pipelineDeals: Deal[] = deals.map(deal => ({
    id: deal.id,
    name: deal.title || deal.name || `Deal ${deal.id}`,
    accountId: undefined,
    contactId: deal.leadId,
    pipelineId: mockPipeline.id,
    stageId: deal.stage === 'closed-won' ? 'closed-won' : 
             deal.stage === 'closed-lost' ? 'closed-lost' :
             deal.stage === 'negotiation' ? 'negotiation' :
             deal.stage === 'proposal' ? 'proposal' : 'qualification',
    value: deal.value,
    currency: 'USD',
    probability: deal.probability,
    expectedCloseDate: deal.expectedCloseDate,
    actualCloseDate: undefined,
    closeReason: undefined,
    ownerId: deal.assignedTo,
    teamMembers: [deal.assignedTo],
    tags: [],
    customFields: {},
    products: [],
    competitors: [],
    description: deal.notes,
    nextStep: undefined,
    createdAt: deal.createdAt,
    updatedAt: deal.createdAt,
    lastActivityAt: undefined,
    stageHistory: [{
      stageId: deal.stage === 'closed-won' ? 'closed-won' : 
               deal.stage === 'closed-lost' ? 'closed-lost' :
               deal.stage === 'negotiation' ? 'negotiation' :
               deal.stage === 'proposal' ? 'proposal' : 'qualification',
      stageName: deal.stage === 'closed-won' ? 'Closed Won' : 
                 deal.stage === 'closed-lost' ? 'Closed Lost' :
                 deal.stage === 'negotiation' ? 'Negotiation' :
                 deal.stage === 'proposal' ? 'Proposal' : 'Qualification',
      enteredAt: deal.createdAt,
      userId: deal.assignedTo
    }]
  }));

  const handleDealMove = (dealId: string, newStageId: string) => {
    const deal = pipelineDeals.find(d => d.id === dealId);
    if (!deal) return;

    const stage = mockPipeline.stages.find(s => s.id === newStageId);
    if (!stage) return;

    // Update the deal in the original deals array
    const originalDeal = deals.find(d => d.id === dealId);
    if (originalDeal) {
      updateDeal(dealId, {
        stage: newStageId as any,
        probability: stage.probability
      });
    }
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealForm(true);
  };

  const handleAddDeal = (stageId: string) => {
    setSelectedDeal(undefined);
    setSelectedStageId(stageId);
    setShowDealForm(true);
  };

  const handleDealSubmit = (dealData: Partial<Deal>) => {
    if (selectedDeal) {
      // Update existing deal
      const originalDeal = deals.find(d => d.id === selectedDeal.id);
      if (originalDeal) {
        updateDeal(selectedDeal.id, {
          title: dealData.name,
          value: dealData.value || 0,
          probability: dealData.probability || 0,
          expectedCloseDate: dealData.expectedCloseDate,
          assignedTo: dealData.ownerId || originalDeal.assignedTo,
          notes: dealData.description
        });
      }
    } else {
      // Create new deal
      const stage = mockPipeline.stages.find(s => s.id === selectedStageId);
      addDeal({
        title: dealData.name || 'New Deal',
        leadId: dealData.contactId || '',
        value: dealData.value || 0,
        stage: selectedStageId as any,
        probability: dealData.probability || stage?.probability || 0,
        expectedCloseDate: dealData.expectedCloseDate || '',
        assignedTo: dealData.ownerId || '1',
        notes: dealData.description
      });
    }
    setShowDealForm(false);
    setSelectedDeal(undefined);
    setSelectedStageId('');
  };

  // Calculate pipeline metrics
  const totalValue = pipelineDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = pipelineDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  const avgDealSize = pipelineDeals.length > 0 ? totalValue / pipelineDeals.length : 0;
  const conversionRate = pipelineDeals.length > 0 ? 
    (pipelineDeals.filter(d => d.stageId === 'closed-won').length / pipelineDeals.length) * 100 : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600">Manage your deals through the sales process</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Settings className="h-4 w-4 mr-2" />
            Pipeline Settings
          </button>
          <button
            onClick={() => handleAddDeal('qualification')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50 border-b border-gray-200">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Pipeline</p>
              <p className="text-xl font-bold text-gray-900">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Weighted Pipeline</p>
              <p className="text-xl font-bold text-gray-900">
                ${weightedValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-xl font-bold text-gray-900">
                ${avgDealSize.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1">
        <PipelineBoard
          pipeline={mockPipeline}
          deals={pipelineDeals}
          onDealMove={handleDealMove}
          onDealClick={handleDealClick}
          onAddDeal={handleAddDeal}
        />
      </div>

      {/* Deal Form Modal */}
      {showDealForm && (
        <DealForm
          deal={selectedDeal}
          pipeline={mockPipeline}
          onClose={() => {
            setShowDealForm(false);
            setSelectedDeal(undefined);
            setSelectedStageId('');
          }}
          onSubmit={handleDealSubmit}
        />
      )}
    </div>
  );
};

export default PipelinePage;