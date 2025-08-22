import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Building,
  User,
  DollarSign,
  Calendar,
  Zap,
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  FileText,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  CheckCircle,
  Info,
  Upload,
  Paperclip,
  Wand2,
  Target,
  Activity,
  Package,
  HelpCircle,
  Globe
} from 'lucide-react';
import DealSummaryCard from '../../components/Deal/DealSummaryCardNew';

interface DealFormData {
  // Basic Information
  name: string;
  pipeline: string;
  accountId: string;
  accountName: string;
  contactId: string;
  contactName: string;
  amount: string;
  currency: string;
  closingDate: string;
  stage: string;
  probability: number;
  
  // Ownership & Classification
  ownerId: string;
  dealType: string;
  country: string;
  
  // Deal Details
  description: string;
  nextStep: string;
  products: Array<{id: string, name: string, quantity: number, price: number}>;
  platformFee: string;
  customFee: string;
  licenseFee: string;
  onboardingFee: string;
  
  // Activities
  activities: Array<{type: string, title: string, dueDate: string, priority: string}>;
  
  // Advanced
  priority: string;
  source: string;
  tags: string[];
}

// Section configuration for the form wizard
const FORM_SECTIONS = [
  {
    id: 'basic',
    title: 'Basic Information',
    icon: Building,
    description: 'Essential deal details',
    required: true,
    fields: ['name', 'pipeline', 'accountId', 'contactId', 'amount', 'closingDate', 'stage']
  },
  {
    id: 'ownership',
    title: 'Ownership & Classification',
    icon: User,
    description: 'Deal ownership and categorization',
    required: false,
    fields: ['ownerId', 'dealType', 'country']
  },
  {
    id: 'details',
    title: 'Deal Details',
    icon: FileText,
    description: 'Extended deal information',
    required: false,
    fields: ['description', 'nextStep', 'products', 'platformFee', 'customFee', 'licenseFee', 'onboardingFee']
  },
  {
    id: 'activities',
    title: 'Activity Planning',
    icon: Activity,
    description: 'Schedule follow-up actions',
    required: false,
    fields: ['activities']
  }
];

const CreateDealPageFixed: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<DealFormData>({
    // Basic Information
    name: '',
    pipeline: 'sales',
    accountId: '',
    accountName: '',
    contactId: '',
    contactName: '',
    amount: '',
    currency: 'USD',
    closingDate: '',
    stage: 'discovery',
    probability: 10,
    
    // Ownership & Classification
    ownerId: '',
    dealType: 'new_business',
    country: '',
    
    // Deal Details
    description: '',
    nextStep: '',
    products: [],
    platformFee: '',
    customFee: '',
    licenseFee: '',
    onboardingFee: '',
    
    // Activities
    activities: [],
    
    // Advanced
    priority: 'medium',
    source: 'inbound',
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);
  const [currentSection, setCurrentSection] = useState('basic');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showAIHelper, setShowAIHelper] = useState(false);
  
  // Search states for smart dropdowns
  const [accountSearch, setAccountSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);

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

  // Auto-save functionality
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    if (formData.name.trim()) {
      setAutoSaveStatus('saving');
      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem('deal-draft-current', JSON.stringify(formData));
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } catch (error) {
          setAutoSaveStatus('error');
        }
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData.name, formData.amount, formData.closingDate]);

  // Filter accounts and contacts based on search
  useEffect(() => {
    if (accounts && accountSearch) {
      const filtered = accounts.filter((account: any) =>
        account.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
        (account.industry && account.industry.toLowerCase().includes(accountSearch.toLowerCase()))
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts || []);
    }
  }, [accounts, accountSearch]);

  useEffect(() => {
    if (contacts && contactSearch) {
      const filtered = contacts.filter((contact: any) =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(contactSearch.toLowerCase()) ||
        (contact.email && contact.email.toLowerCase().includes(contactSearch.toLowerCase()))
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts || []);
    }
  }, [contacts, contactSearch]);

  const DEAL_STAGES = [
    { id: 'discovery', title: 'Discovery', probability: 10, color: 'bg-blue-500' },
    { id: 'qualification', title: 'Qualification', probability: 25, color: 'bg-purple-500' },
    { id: 'proposal', title: 'Proposal', probability: 50, color: 'bg-yellow-500' },
    { id: 'negotiation', title: 'Negotiation', probability: 75, color: 'bg-orange-500' },
    { id: 'closed-won', title: 'Closed Won', probability: 100, color: 'bg-green-500' }
  ];

  const DEAL_TYPES = [
    { value: 'new_business', label: 'New Business' },
    { value: 'existing_business', label: 'Existing Business' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'expansion', label: 'Expansion' }
  ];

  const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' }
  ];

  const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const PIPELINES = [
    { id: 'sales', name: 'Sales Pipeline' },
    { id: 'enterprise', name: 'Enterprise Pipeline' },
    { id: 'partner', name: 'Partner Pipeline' }
  ];

  const handleFieldChange = (field: keyof DealFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-update probability based on stage
      if (field === 'stage') {
        const stage = DEAL_STAGES.find(s => s.id === value);
        if (stage) {
          newData.probability = stage.probability;
        }
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Section management
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const navigateToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    if (!expandedSections.includes(sectionId)) {
      toggleSection(sectionId);
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const requiredFields = ['name', 'accountId', 'amount', 'closingDate'];
    const completedFields = requiredFields.filter(field => {
      const value = formData[field as keyof DealFormData];
      return value && value.toString().trim() !== '';
    });
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Add product
  const addProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0
    };
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  // Remove product
  const removeProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  // Update product
  const updateProduct = (productId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === productId ? { ...p, [field]: value } : p
      )
    }));
  };

  // Add activity
  const addActivity = (type: string) => {
    const newActivity = {
      type,
      title: '',
      dueDate: '',
      priority: 'medium'
    };
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  // AI Helper suggestions
  const getAISuggestions = () => {
    const suggestions = [];
    
    if (!formData.nextStep) {
      suggestions.push({
        field: 'nextStep',
        suggestion: 'Schedule discovery call',
        reason: 'Based on deal stage'
      });
    }
    
    if (formData.products.length === 0) {
      suggestions.push({
        field: 'products',
        suggestion: 'Add primary product/service',
        reason: 'Most deals include products'
      });
    }
    
    return suggestions;
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

  const handleSubmit = async (action: 'create' | 'template' | 'draft' = 'create') => {    
    if (!validateForm() && action === 'create') return;

    if (action === 'draft') {
      try {
        const draftKey = `deal-draft-${Date.now()}`;
        localStorage.setItem(draftKey, JSON.stringify(formData));
        return;
      } catch (error) {
        return;
      }
    }

    if (action === 'template') {
      try {
        const templateKey = `deal-template-${Date.now()}`;
        localStorage.setItem(templateKey, JSON.stringify({
          ...formData,
          name: `${formData.name} Template`
        }));
        return;
      } catch (error) {
        return;
      }
    }

    // Create deal
    const selectedAccount = accounts.find((acc: any) => acc.id === formData.accountId);
    
    const dealData = {
      name: formData.name,
      accountId: formData.accountId,
      accountName: selectedAccount?.name || formData.accountName,
      contactId: formData.contactId || null,
      value: parseFloat(formData.amount) || 0,
      currency: formData.currency,
      stage: formData.stage,
      probability: formData.probability,
      expectedCloseDate: formData.closingDate,
      description: formData.description,
      dealType: formData.dealType,
      priority: formData.priority,
      assignedTo: 'f310c13c-3edf-4f46-a6ec-46503ed02377', // Default user
      createdBy: 'f310c13c-3edf-4f46-a6ec-46503ed02377'
    };

    createDealMutation.mutate(dealData);
  };

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
          
          {/* Auto-save status */}
          <div className="flex items-center space-x-3">
            {autoSaveStatus !== 'idle' && (
              <div className="flex items-center space-x-2 text-sm">
                {autoSaveStatus === 'saving' && (
                  <>
                    <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Saving...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Draft saved</span>
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    <span className="text-red-600">Save failed</span>
                  </>
                )}
              </div>
            )}
            
            {/* AI Helper Button */}
            <button
              onClick={() => setShowAIHelper(!showAIHelper)}
              className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                showAIHelper 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-testid="ai-helper-button"
            >
              <Wand2 className="w-4 h-4" />
              <span>Help me fill this</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Form Content */}
        <div className="flex-1 max-w-4xl mx-auto p-6">
          {/* Section Navigation */}
          <div className="mb-6">
            <div className="flex items-center space-x-1 overflow-x-auto pb-2">
              {FORM_SECTIONS.map((section, index) => {
                const Icon = section.icon;
                const isActive = currentSection === section.id;
                const isCompleted = section.required ? 
                  section.fields.every(field => {
                    const value = formData[field as keyof DealFormData];
                    return value && value.toString().trim() !== '';
                  }) : false;

                return (
                  <button
                    key={section.id}
                    onClick={() => navigateToSection(section.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    data-testid={`section-nav-${section.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                    {isCompleted && <CheckCircle className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            {FORM_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                      isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                    data-testid={`section-header-${section.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                      {section.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Section Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-6">
                          {section.id === 'basic' && renderBasicSection()}
                          {section.id === 'ownership' && renderOwnershipSection()}
                          {section.id === 'details' && renderDetailsSection()}
                          {section.id === 'activities' && renderActivitiesSection()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sticky Summary Sidebar */}
        <div className="w-80 pl-6">
          <div className="sticky top-6">
            <DealSummaryCard 
              formData={formData}
              completionPercentage={getCompletionPercentage()}
              onSubmit={handleSubmit}
              isSubmitting={createDealMutation.isPending}
              errors={errors}
            />
            
            {/* AI Helper Panel */}
            {showAIHelper && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm border border-purple-200"
              >
                <div className="p-4">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Suggestions
                  </h3>
                  
                  {getAISuggestions().length > 0 ? (
                    <div className="space-y-2">
                      {getAISuggestions().map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded-lg border border-purple-200"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {suggestion.suggestion}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {suggestion.reason}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (suggestion.field === 'nextStep') {
                                handleFieldChange('nextStep', suggestion.suggestion);
                              }
                            }}
                            className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Apply suggestion
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-purple-700">
                      Looking good! No suggestions at the moment.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLocation('/crm/deals')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {getCompletionPercentage()}% complete
            </span>
            <button
              type="button"
              onClick={() => handleSubmit('create')}
              disabled={createDealMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
            >
              {createDealMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>Create Deal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render section components
  function renderBasicSection() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deal Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Name *
            <Info className="w-4 h-4 inline ml-1 text-gray-400" title="A descriptive name for this deal opportunity" />
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

        {/* Pipeline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pipeline *
          </label>
          <select
            value={formData.pipeline}
            onChange={(e) => handleFieldChange('pipeline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="pipeline-select"
          >
            {PIPELINES.map(pipeline => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
        </div>

        {/* Deal Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Stage *
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

        {/* Account Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account *
          </label>
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <Search className="w-4 h-4 text-gray-400 ml-3" />
              <input
                type="text"
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                placeholder="Search for an account..."
                className="flex-1 px-3 py-2 outline-none"
                data-testid="account-search"
              />
            </div>
            
            {accountSearch && filteredAccounts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {filteredAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => {
                      handleFieldChange('accountId', account.id);
                      handleFieldChange('accountName', account.name);
                      setAccountSearch(account.name);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.industry || 'No industry'}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.accountId && <p className="text-sm text-red-600 mt-1">{errors.accountId}</p>}
        </div>

        {/* Contact Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Contact
          </label>
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <Search className="w-4 h-4 text-gray-400 ml-3" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search for a contact..."
                className="flex-1 px-3 py-2 outline-none"
                data-testid="contact-search"
              />
            </div>
            
            {contactSearch && filteredContacts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => {
                      handleFieldChange('contactId', contact.id);
                      handleFieldChange('contactName', `${contact.firstName} ${contact.lastName}`);
                      setContactSearch(`${contact.firstName} ${contact.lastName}`);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deal Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Value *
          </label>
          <div className="flex space-x-2">
            <select
              value={formData.currency}
              onChange={(e) => handleFieldChange('currency', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code}
                </option>
              ))}
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
          />
          {errors.closingDate && <p className="text-sm text-red-600 mt-1">{errors.closingDate}</p>}
        </div>

        {/* Win Probability */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Win Probability: {formData.probability}%
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => handleFieldChange('probability', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0%</span>
              <span className="font-medium text-gray-900">{formData.probability}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderOwnershipSection() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deal Owner</label>
          <input
            type="text"
            value={formData.ownerId}
            onChange={(e) => handleFieldChange('ownerId', e.target.value)}
            placeholder="Select deal owner..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deal Type</label>
          <select
            value={formData.dealType}
            onChange={(e) => handleFieldChange('dealType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {DEAL_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <select
            value={formData.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select country...</option>
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>{country.name}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  function renderDetailsSection() {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Describe the deal opportunity..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Next Step</label>
          <input
            type="text"
            value={formData.nextStep}
            onChange={(e) => handleFieldChange('nextStep', e.target.value)}
            placeholder="What's the next action?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    );
  }

  function renderActivitiesSection() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Quick Add Activities</h4>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => addActivity('call')}
              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm flex items-center space-x-1"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
            <button
              type="button"
              onClick={() => addActivity('meeting')}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center space-x-1"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Meeting</span>
            </button>
          </div>
        </div>

        {formData.activities.length > 0 ? (
          <div className="space-y-3">
            {formData.activities.map((activity, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={activity.title}
                    onChange={(e) => {
                      const newActivities = [...formData.activities];
                      newActivities[index].title = e.target.value;
                      handleFieldChange('activities', newActivities);
                    }}
                    placeholder="Activity title"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="date"
                    value={activity.dueDate}
                    onChange={(e) => {
                      const newActivities = [...formData.activities];
                      newActivities[index].dueDate = e.target.value;
                      handleFieldChange('activities', newActivities);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <select
                    value={activity.priority}
                    onChange={(e) => {
                      const newActivities = [...formData.activities];
                      newActivities[index].priority = e.target.value;
                      handleFieldChange('activities', newActivities);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No activities scheduled yet</p>
          </div>
        )}
      </div>
    );
  }
};

export default CreateDealPageFixed;