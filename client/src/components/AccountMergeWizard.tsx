import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  GitMerge, ArrowRight, ArrowLeft, Check, X, AlertTriangle, 
  Users, Building, Phone, Mail, Globe, MapPin, Calendar,
  FileText, DollarSign, TrendingUp, Database, Shield,
  ChevronRight, ChevronDown, Eye, Edit, Copy, Trash2,
  Zap, Brain, Star, Info
} from 'lucide-react';
import { apiRequest } from '../lib/queryClient';

interface Account {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  companySize?: string;
  annualRevenue?: number;
  website?: string;
  phone?: string;
  description?: string;
  address?: string;
  accountType?: string;
  accountStatus?: string;
  accountSegment?: string;
  healthScore?: number;
  employees?: number;
  foundedYear?: number;
  logoUrl?: string;
  tags?: string[];
  totalDeals?: number;
  totalRevenue?: string;
  lastContactDate?: string;
  lastActivityDate?: string;
  ownerId?: string;
  contacts?: any[];
  deals?: any[];
  createdAt: string;
  updatedAt: string;
}

interface DuplicateGroup {
  id: string;
  accounts: Account[];
  duplicateCount: number;
  criteria: string[];
}

interface MergeDecision {
  field: string;
  selectedAccountId: string;
  selectedValue: any;
  conflictResolution?: 'keep_primary' | 'keep_secondary' | 'merge' | 'custom';
}

interface AccountMergeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateGroups?: DuplicateGroup[];
  onMergeComplete?: () => void;
}

const AccountMergeWizard: React.FC<AccountMergeWizardProps> = ({
  isOpen,
  onClose,
  duplicateGroups = [],
  onMergeComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [primaryAccount, setPrimaryAccount] = useState<Account | null>(null);
  const [secondaryAccounts, setSecondaryAccounts] = useState<Account[]>([]);
  const [mergeDecisions, setMergeDecisions] = useState<MergeDecision[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const queryClient = useQueryClient();

  // Fetch detailed account data with relationships
  const { data: accountsWithRelations } = useQuery({
    queryKey: ['/api/accounts/with-relations', selectedGroup?.accounts.map(a => a.id)],
    queryFn: async () => {
      if (!selectedGroup) return [];
      const promises = selectedGroup.accounts.map(account =>
        apiRequest(`/api/accounts/${account.id}/with-relations`)
      );
      return Promise.all(promises);
    },
    enabled: !!selectedGroup
  });

  const mergeMutation = useMutation({
    mutationFn: async (mergeData: any) => {
      return apiRequest('/api/accounts/merge', {
        method: 'POST',
        body: mergeData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/duplicates'] });
      onMergeComplete?.();
      onClose();
    }
  });

  const steps = [
    { 
      id: 'select', 
      title: 'Select Duplicates', 
      description: 'Choose which duplicate group to merge' 
    },
    { 
      id: 'primary', 
      title: 'Choose Primary', 
      description: 'Select the account to keep as primary' 
    },
    { 
      id: 'conflicts', 
      title: 'Resolve Conflicts', 
      description: 'Handle conflicting data between accounts' 
    },
    { 
      id: 'relationships', 
      title: 'Merge Relationships', 
      description: 'Consolidate contacts, deals, and activities' 
    },
    { 
      id: 'review', 
      title: 'Review & Confirm', 
      description: 'Final review before merging' 
    }
  ];

  // Initialize merge decisions when primary account changes
  useEffect(() => {
    if (primaryAccount && secondaryAccounts.length > 0) {
      const fields = [
        'name', 'website', 'phone', 'description', 'address', 'industry',
        'companySize', 'annualRevenue', 'employees', 'foundedYear', 'tags'
      ];
      
      const decisions = fields.map(field => {
        const hasConflict = secondaryAccounts.some(acc => 
          acc[field as keyof Account] && 
          acc[field as keyof Account] !== primaryAccount[field as keyof Account]
        );
        
        return {
          field,
          selectedAccountId: primaryAccount.id,
          selectedValue: primaryAccount[field as keyof Account],
          conflictResolution: hasConflict ? 'keep_primary' as const : undefined
        };
      });
      
      setMergeDecisions(decisions);
    }
  }, [primaryAccount, secondaryAccounts]);

  const handleGroupSelect = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setCurrentStep(1);
  };

  const handlePrimarySelect = (account: Account) => {
    setPrimaryAccount(account);
    setSecondaryAccounts(selectedGroup?.accounts.filter(a => a.id !== account.id) || []);
    setCurrentStep(2);
  };

  const handleFieldDecision = (field: string, accountId: string, value: any) => {
    setMergeDecisions(prev => 
      prev.map(decision => 
        decision.field === field 
          ? { ...decision, selectedAccountId: accountId, selectedValue: value }
          : decision
      )
    );
  };

  const generatePreview = () => {
    if (!primaryAccount) return;
    
    const mergedData = { ...primaryAccount };
    mergeDecisions.forEach(decision => {
      if (decision.selectedValue !== undefined) {
        (mergedData as any)[decision.field] = decision.selectedValue;
      }
    });
    
    // Calculate relationship counts
    const totalContacts = accountsWithRelations?.reduce((sum, acc) => sum + (acc.contacts?.length || 0), 0) || 0;
    const totalDeals = accountsWithRelations?.reduce((sum, acc) => sum + (acc.deals?.length || 0), 0) || 0;
    
    setPreviewData({
      ...mergedData,
      totalContacts,
      totalDeals,
      accountsToRemove: secondaryAccounts.length
    });
  };

  const handleMerge = async () => {
    if (!primaryAccount || !selectedGroup) return;
    
    const mergeData = {
      primaryAccountId: primaryAccount.id,
      secondaryAccountIds: secondaryAccounts.map(a => a.id),
      fieldDecisions: mergeDecisions,
      preserveRelationships: true
    };
    
    await mergeMutation.mutateAsync(mergeData);
  };

  const nextStep = () => {
    if (currentStep === 3) {
      generatePreview();
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <GitMerge className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Account Merge Wizard</h2>
                <p className="text-blue-100">Intelligently merge duplicate accounts with precision</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  index <= currentStep ? 'text-white' : 'text-blue-300'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index < currentStep 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-white text-blue-600' 
                        : 'bg-blue-500 bg-opacity-50'
                  }`}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs text-blue-200">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2 text-blue-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Duplicate Group */}
            {currentStep === 0 && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Brain className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Choose Duplicate Group to Merge</h3>
                  <p className="text-gray-600">Select which set of duplicate accounts you'd like to merge</p>
                </div>
                
                {duplicateGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    onClick={() => handleGroupSelect(group)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                          <Copy className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {group.accounts[0]?.name || 'Unnamed Group'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {group.duplicateCount} duplicate accounts • 
                            Criteria: {group.criteria.join(', ')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {group.accounts.slice(0, 6).map((account) => (
                        <div key={account.id} className="text-xs bg-gray-100 rounded px-2 py-1">
                          <div className="font-medium truncate">{account.name}</div>
                          <div className="text-gray-500 truncate">{account.website}</div>
                        </div>
                      ))}
                      {group.accounts.length > 6 && (
                        <div className="text-xs bg-gray-100 rounded px-2 py-1 text-center text-gray-500">
                          +{group.accounts.length - 6} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Step 2: Choose Primary Account */}
            {currentStep === 1 && selectedGroup && (
              <motion.div
                key="primary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Choose Primary Account</h3>
                  <p className="text-gray-600">This account will be kept and others will be merged into it</p>
                </div>
                
                <div className="grid gap-4">
                  {selectedGroup.accounts.map((account) => (
                    <motion.div
                      key={account.id}
                      onClick={() => handlePrimarySelect(account)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Building className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{account.name}</h4>
                              <p className="text-sm text-gray-600">
                                Created {new Date(account.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Website</div>
                              <div className="font-medium truncate">{account.website || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Phone</div>
                              <div className="font-medium">{account.phone || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Industry</div>
                              <div className="font-medium capitalize">{account.industry || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Revenue</div>
                              <div className="font-medium">${account.totalRevenue || '0'}</div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Resolve Conflicts */}
            {currentStep === 2 && primaryAccount && (
              <motion.div
                key="conflicts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Resolve Data Conflicts</h3>
                  <p className="text-gray-600">Choose which values to keep for conflicting fields</p>
                </div>
                
                <div className="space-y-4">
                  {mergeDecisions.map((decision) => {
                    const hasConflict = secondaryAccounts.some(acc => 
                      acc[decision.field as keyof Account] && 
                      acc[decision.field as keyof Account] !== primaryAccount[decision.field as keyof Account]
                    );
                    
                    if (!hasConflict) return null;
                    
                    return (
                      <div key={decision.field} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {decision.field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </h4>
                        </div>
                        
                        <div className="grid gap-3">
                          {/* Primary Account Option */}
                          <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input
                              type="radio"
                              name={`field-${decision.field}`}
                              checked={decision.selectedAccountId === primaryAccount.id}
                              onChange={() => handleFieldDecision(
                                decision.field, 
                                primaryAccount.id, 
                                primaryAccount[decision.field as keyof Account]
                              )}
                              className="text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="font-medium">Primary: {primaryAccount.name}</div>
                              <div className="text-sm text-gray-600">
                                {String(primaryAccount[decision.field as keyof Account] || 'N/A')}
                              </div>
                            </div>
                          </label>
                          
                          {/* Secondary Account Options */}
                          {secondaryAccounts.map((account) => {
                            const value = account[decision.field as keyof Account];
                            if (!value || value === primaryAccount[decision.field as keyof Account]) return null;
                            
                            return (
                              <label key={account.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                                <input
                                  type="radio"
                                  name={`field-${decision.field}`}
                                  checked={decision.selectedAccountId === account.id}
                                  onChange={() => handleFieldDecision(decision.field, account.id, value)}
                                  className="text-blue-600"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">From: {account.name}</div>
                                  <div className="text-sm text-gray-600">{String(value)}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Relationships */}
            {currentStep === 3 && (
              <motion.div
                key="relationships"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Database className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Relationship Consolidation</h3>
                  <p className="text-gray-600">All relationships will be transferred to the primary account</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Contacts</h4>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {accountsWithRelations?.reduce((sum, acc) => sum + (acc.contacts?.length || 0), 0) || 0}
                    </div>
                    <p className="text-sm text-blue-700">Total contacts to merge</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Deals</h4>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {accountsWithRelations?.reduce((sum, acc) => sum + (acc.deals?.length || 0), 0) || 0}
                    </div>
                    <p className="text-sm text-green-700">Total deals to merge</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">Activities</h4>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {accountsWithRelations?.reduce((sum, acc) => sum + (acc.activities?.length || 0), 0) || 0}
                    </div>
                    <p className="text-sm text-purple-700">Total activities to merge</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">Merge Process</h4>
                  </div>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• All contacts will be transferred to the primary account</li>
                    <li>• Deal ownership will be updated to the primary account</li>
                    <li>• Activity history will be consolidated</li>
                    <li>• Duplicate relationships will be automatically deduplicated</li>
                    <li>• Secondary accounts will be permanently deleted</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Confirm */}
            {currentStep === 4 && previewData && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Eye className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Review Merge Preview</h3>
                  <p className="text-gray-600">Final check before executing the merge</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                  <h4 className="font-bold text-indigo-900 mb-4">Merged Account Preview</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Name</div>
                      <div className="font-semibold">{previewData.name}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Website</div>
                      <div className="font-semibold">{previewData.website || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Phone</div>
                      <div className="font-semibold">{previewData.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Industry</div>
                      <div className="font-semibold capitalize">{previewData.industry || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total Contacts</div>
                      <div className="font-semibold text-blue-600">{previewData.totalContacts}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Total Deals</div>
                      <div className="font-semibold text-green-600">{previewData.totalDeals}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Warning</h4>
                  </div>
                  <p className="text-sm text-red-800">
                    This action will permanently delete {previewData.accountsToRemove} duplicate account(s). 
                    This cannot be undone. All data will be safely transferred to the primary account.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <div className="space-x-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 0 && !selectedGroup) ||
                  (currentStep === 1 && !primaryAccount)
                }
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleMerge}
                disabled={mergeMutation.isPending}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {mergeMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Merging...</span>
                  </>
                ) : (
                  <>
                    <GitMerge className="w-4 h-4" />
                    <span>Execute Merge</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountMergeWizard;