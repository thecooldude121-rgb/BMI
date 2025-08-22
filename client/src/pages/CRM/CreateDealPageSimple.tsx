import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Building,
  User,
  DollarSign,
  Calendar,
  Zap
} from 'lucide-react';

interface DealFormData {
  name: string;
  accountId: string;
  contactId: string;
  amount: string;
  currency: string;
  closingDate: string;
  stage: string;
  probability: number;
  description: string;
}

const CreateDealPageSimple: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<DealFormData>({
    name: '',
    accountId: '',
    contactId: '',
    amount: '',
    currency: 'USD',
    closingDate: '',
    stage: 'discovery',
    probability: 10,
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Data queries
  const { data: accounts = [] } = useQuery({
    queryKey: ['/api/accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      return response.json();
    }
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    }
  });

  // Create deal mutation
  const createDealMutation = useMutation({
    mutationFn: async (dealData: any) => {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData)
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create deal: ${errorData}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      setLocation(`/crm/deals/${data.id}`);
    },
    onError: (error: any) => {
      console.error('Error creating deal:', error);
      setErrors({ submit: error.message || 'Failed to create deal' });
    }
  });

  const handleFieldChange = (field: keyof DealFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Deal name is required';
    if (!formData.accountId) newErrors.accountId = 'Account is required';
    if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    if (!formData.closingDate) newErrors.closingDate = 'Closing date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Find selected account
    const selectedAccount = accounts.find((acc: any) => acc.id === formData.accountId);
    
    const dealData = {
      name: formData.name,
      accountId: formData.accountId,
      accountName: selectedAccount?.name || '',
      contactId: formData.contactId || null,
      value: formData.amount,
      currency: formData.currency,
      stage: formData.stage,
      probability: formData.probability,
      expectedCloseDate: formData.closingDate,
      description: formData.description,
      dealType: 'new_business',
      priority: 'medium',
      assignedTo: 'f310c13c-3edf-4f46-a6ec-46503ed02377', // Default user
      createdBy: 'f310c13c-3edf-4f46-a6ec-46503ed02377'
    };

    createDealMutation.mutate(dealData);
  };

  const DEAL_STAGES = [
    { id: 'discovery', title: 'Discovery', probability: 10 },
    { id: 'qualification', title: 'Qualification', probability: 25 },
    { id: 'proposal', title: 'Proposal', probability: 50 },
    { id: 'negotiation', title: 'Negotiation', probability: 75 },
    { id: 'closed-won', title: 'Closed Won', probability: 100 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/crm/deals')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="back-button"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create New Deal</h1>
              <p className="text-sm text-gray-600">Add a new deal to your pipeline</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deal Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="e.g. Acme Corp - Enterprise License"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-testid="deal-name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account *
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => handleFieldChange('accountId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.accountId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-testid="account-select"
                  >
                    <option value="">Select an account...</option>
                    {accounts.map((account: any) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                  {errors.accountId && <p className="text-sm text-red-600 mt-1">{errors.accountId}</p>}
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Contact
                  </label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => handleFieldChange('contactId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="contact-select"
                  >
                    <option value="">Select a contact...</option>
                    {contacts.map((contact: any) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal Value *
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={formData.currency}
                      onChange={(e) => handleFieldChange('currency', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      data-testid="currency-select"
                    >
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="GBP">£ GBP</option>
                    </select>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleFieldChange('amount', e.target.value)}
                      placeholder="0.00"
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min="0"
                      step="0.01"
                      data-testid="deal-amount"
                    />
                  </div>
                  {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                </div>

                {/* Closing Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Closing Date *
                  </label>
                  <input
                    type="date"
                    value={formData.closingDate}
                    onChange={(e) => handleFieldChange('closingDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.closingDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-testid="closing-date"
                  />
                  {errors.closingDate && <p className="text-sm text-red-600 mt-1">{errors.closingDate}</p>}
                </div>

                {/* Stage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => {
                      handleFieldChange('stage', e.target.value);
                      const stage = DEAL_STAGES.find(s => s.id === e.target.value);
                      if (stage) {
                        handleFieldChange('probability', stage.probability);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="deal-stage"
                  >
                    {DEAL_STAGES.map(stage => (
                      <option key={stage.id} value={stage.id}>
                        {stage.title} ({stage.probability}% probability)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Probability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Win Probability: {formData.probability}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => handleFieldChange('probability', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    data-testid="probability-slider"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Deal Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe the deal details, requirements, and opportunity..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  data-testid="deal-description"
                />
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setLocation('/crm/deals')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createDealMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                data-testid="create-deal-button"
              >
                {createDealMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Create Deal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateDealPageSimple;