import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  FileText as FileTemplate, 
  Plus,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Building,
  DollarSign,
  Calendar,
  Target,
  Activity,
  Mail,
  Paperclip,
  HelpCircle,
  Wand2,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  Globe,
  Phone,
  Package,
  Zap
} from 'lucide-react';
// Import deal creation components
import { 
  BasicInformationSection,
  OwnershipSection, 
  DetailsSection,
  FeesSection,
  ActivitiesSection
} from '../../components/Deal/CreateDealSections';
import DealSummaryCard from '../../components/Deal/DealSummaryCard';

// Define comprehensive deal form data structure
interface DealFormData {
  // Basic Information
  name: string;
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
  pipeline: string;
  
  // Additional Details
  description: string;
  nextStep: string;
  products: string[];
  
  // Fees
  platformFee: string;
  customFee: string;
  licenseFee: string;
  onboardingFee: string;
  
  // Advanced
  source: string;
  competitorIds: string[];
  tags: string[];
  priority: string;
}

// Form sections configuration
const FORM_SECTIONS = [
  {
    id: 'basic',
    title: 'Basic Information',
    icon: Building,
    description: 'Essential deal details',
    required: true,
    fields: ['name', 'accountName', 'contactName', 'amount', 'closingDate', 'stage']
  },
  {
    id: 'ownership',
    title: 'Ownership & Classification', 
    icon: User,
    description: 'Deal ownership and categorization',
    required: false,
    fields: ['ownerId', 'dealType', 'country', 'pipeline']
  },
  {
    id: 'details',
    title: 'Additional Details',
    icon: FileTemplate,
    description: 'Extended deal information',
    required: false,
    fields: ['description', 'nextStep', 'products', 'priority']
  },
  {
    id: 'fees',
    title: 'Financial Details',
    icon: DollarSign,
    description: 'Pricing and fee structure',
    required: false,
    fields: ['platformFee', 'customFee', 'licenseFee', 'onboardingFee']
  },
  {
    id: 'activities',
    title: 'Activity Planning',
    icon: Activity,
    description: 'Schedule follow-up actions',
    required: false,
    fields: []
  }
];

// Deal stages configuration
const DEAL_STAGES = [
  { id: 'discovery', title: 'Discovery', color: 'bg-blue-500', probability: 10 },
  { id: 'qualification', title: 'Qualification', color: 'bg-purple-500', probability: 25 },
  { id: 'proposal', title: 'Proposal', color: 'bg-yellow-500', probability: 50 },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500', probability: 75 },
  { id: 'closed-won', title: 'Closed Won', color: 'bg-green-500', probability: 100 },
  { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-500', probability: 0 }
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
];

const CreateDealPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Simple toast function (can be replaced with a proper toast library)
  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type}: ${title} - ${description}`);
    // In a real app, this would show a proper toast notification
  };

  // Form state
  const [formData, setFormData] = useState<DealFormData>({
    name: '',
    accountId: '',
    accountName: '',
    contactId: '',
    contactName: '',
    amount: '',
    currency: 'USD',
    closingDate: '',
    stage: 'discovery',
    probability: 10,
    ownerId: '',
    dealType: 'new_business',
    country: '',
    pipeline: 'sales',
    description: '',
    nextStep: '',
    products: [],
    platformFee: '',
    customFee: '',
    licenseFee: '',
    onboardingFee: '',
    source: 'inbound',
    competitorIds: [],
    tags: [],
    priority: 'medium'
  });

  // UI state
  const [currentSection, setCurrentSection] = useState('basic');
  const [expandedSections, setExpandedSections] = useState(['basic']);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Search states for dropdowns
  const [accountSearchTerm, setAccountSearchTerm] = useState('');
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  
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

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
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
      if (!response.ok) throw new Error('Failed to create deal');
      return response.json();
    },
    onSuccess: (data) => {
      showToast(
        "Deal created successfully!",
        `${formData.name} has been created and saved.`,
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      setLocation(`/crm/deals/${data.id}`);
    },
    onError: (error: any) => {
      showToast(
        "Error creating deal",
        error.message || "Please try again.",
        'error'
      );
    }
  });

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formData.name) return;
    
    setAutoSaveStatus('saving');
    try {
      const draftKey = `deal-draft-${Date.now()}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
    }
  }, [formData]);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [formData, autoSave]);

  // Form validation
  const validateSection = (sectionId: string): boolean => {
    const section = FORM_SECTIONS.find(s => s.id === sectionId);
    if (!section) return true;

    const errors: Record<string, string> = {};

    if (sectionId === 'basic') {
      if (!formData.name) errors.name = 'Deal name is required';
      if (!formData.accountName) errors.accountName = 'Account is required';
      if (!formData.amount) errors.amount = 'Amount is required';
      if (!formData.closingDate) errors.closingDate = 'Closing date is required';
    }

    setValidationErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof DealFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Auto-update probability based on stage
    if (field === 'stage') {
      const stage = DEAL_STAGES.find(s => s.id === value);
      if (stage) {
        setFormData(prev => ({ ...prev, probability: stage.probability }));
      }
    }
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Handle section navigation
  const navigateToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    if (!expandedSections.includes(sectionId)) {
      toggleSection(sectionId);
    }
  };

  // Submit form
  const handleSubmit = async (action: 'create' | 'template' | 'draft') => {
    // Validate all required sections
    const isValid = FORM_SECTIONS
      .filter(section => section.required)
      .every(section => validateSection(section.id));

    if (!isValid) {
      showToast(
        "Please fix validation errors",
        "Complete all required fields before creating the deal.",
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const dealData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        probability: formData.probability / 100, // Convert percentage to decimal
        platformFee: parseFloat(formData.platformFee) || 0,
        customFee: parseFloat(formData.customFee) || 0,
        licenseFee: parseFloat(formData.licenseFee) || 0,
        onboardingFee: parseFloat(formData.onboardingFee) || 0,
        assignedTo: formData.ownerId || 'f310c13c-3edf-4f46-a6ec-46503ed02377', // Default user
        createdBy: 'f310c13c-3edf-4f46-a6ec-46503ed02377'
      };

      if (action === 'template') {
        // Save as template logic would go here
        showToast(
          "Template saved!",
          "Deal template has been saved for future use.",
          'success'
        );
        return;
      }

      if (action === 'draft') {
        autoSave();
        showToast(
          "Draft saved!",
          "Your progress has been saved.",
          'success'
        );
        return;
      }

      await createDealMutation.mutateAsync(dealData);
    } catch (error) {
      console.error('Error submitting deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered data for dropdowns
  const filteredAccounts = accounts.filter((account: any) =>
    account.name.toLowerCase().includes(accountSearchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter((contact: any) =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(contactSearchTerm.toLowerCase())
  );

  // Calculate completion percentage
  const completionPercentage = () => {
    const totalFields = FORM_SECTIONS.reduce((sum, section) => sum + section.fields.length, 0);
    const completedFields = FORM_SECTIONS.reduce((sum, section) => {
      return sum + section.fields.filter(field => formData[field as keyof DealFormData]).length;
    }, 0);
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/crm/deals" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New Deal</h1>
                <p className="text-sm text-gray-500">Build your next opportunity</p>
              </div>
            </div>

            {/* Auto-save status */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                )}
                {autoSaveStatus === 'saved' && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved</span>
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Save failed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {FORM_SECTIONS.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    data-testid={`section-${section.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${currentSection === section.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                          <span>{section.title}</span>
                          {section.required && <span className="text-red-500 text-sm">*</span>}
                        </h3>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {section.required && !validateSection(section.id) && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {expandedSections.includes(section.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Section Content */}
                  <AnimatePresence>
                    {expandedSections.includes(section.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-6">
                          {section.id === 'basic' && (
                            <BasicInformationSection 
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                              validationErrors={validationErrors}
                              accounts={filteredAccounts}
                              contacts={filteredContacts}
                              accountSearchTerm={accountSearchTerm}
                              setAccountSearchTerm={setAccountSearchTerm}
                              contactSearchTerm={contactSearchTerm}
                              setContactSearchTerm={setContactSearchTerm}
                            />
                          )}
                          {section.id === 'ownership' && (
                            <OwnershipSection
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                              users={users}
                            />
                          )}
                          {section.id === 'details' && (
                            <DetailsSection
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                            />
                          )}
                          {section.id === 'fees' && (
                            <FeesSection
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                            />
                          )}
                          {section.id === 'activities' && (
                            <ActivitiesSection
                              formData={formData}
                              handleFieldChange={handleFieldChange}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="w-80">
            <div className="sticky top-24">
              <DealSummaryCard
                formData={formData}
                completionPercentage={completionPercentage()}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <button
            onClick={() => handleSubmit('draft')}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            data-testid="save-draft-mobile"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('create')}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            data-testid="create-deal-mobile"
          >
            {isSubmitting ? 'Creating...' : 'Create Deal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDealPage;