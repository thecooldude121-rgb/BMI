import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Building, ArrowLeft, ArrowRight, Check, AlertTriangle, 
  Globe, Phone, Mail, MapPin, Users, DollarSign, Brain,
  Sparkles, Search, ExternalLink, Loader, X, Plus,
  Target, Calendar, FileText, Tag, Shield, Award,
  Linkedin, Twitter, TrendingUp, Image, Link
} from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';

// Types
interface CreateAccountData {
  name: string;
  domain?: string;
  industry?: string;
  companySize?: string;
  annualRevenue?: number;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  accountType?: string;
  accountStatus?: string;
  accountSegment?: string;
  employees?: number;
  foundedYear?: number;
  
  // Enhanced contact and social fields
  linkedinUrl?: string;
  twitterHandle?: string;
  faxNumber?: string;
  stockSymbol?: string;
  logoUrl?: string;
  
  // Address fields
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  // Business intelligence fields
  healthScore?: number;
  customerSince?: string;
  parentAccountId?: string;
  
  // Technology and competitor data
  technologies?: string[];
  competitors?: string[];
  
  // Compliance and custom data
  customFields?: Record<string, any>;
  tags?: string[];
  gdprConsent?: boolean;
  
  // Assignment
  ownerId?: string;
}

interface EnrichmentData {
  name?: string;
  domain?: string;
  website?: string;
  description?: string;
  industry?: string;
  employees?: number;
  foundedYear?: number;
  annualRevenue?: number;
  logoUrl?: string;
  address?: any;
}

const UltimateCreateAccountPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateAccountData>({
    name: '',
    accountType: 'prospect',
    accountStatus: 'active',
    accountSegment: 'smb',
    address: {},
    billingAddress: {},
    shippingAddress: {},
    tags: [],
    technologies: [],
    competitors: [],
    customFields: {},
    healthScore: 50,
    gdprConsent: false
  });

  // Steps Configuration
  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Essential company details',
      icon: Building,
      fields: ['name', 'domain', 'website', 'accountType', 'logoUrl']
    },
    {
      id: 2,
      title: 'Company Profile',
      description: 'Industry and financial information',
      icon: Users,
      fields: ['industry', 'companySize', 'employees', 'foundedYear', 'annualRevenue', 'stockSymbol']
    },
    {
      id: 3,
      title: 'Contact & Social',
      description: 'Communication channels',
      icon: Phone,
      fields: ['phone', 'email', 'faxNumber', 'linkedinUrl', 'twitterHandle']
    },
    {
      id: 4,
      title: 'Address Information',
      description: 'Physical and billing addresses',
      icon: MapPin,
      fields: ['address', 'billingAddress', 'shippingAddress']
    },
    {
      id: 5,
      title: 'Business Intelligence',
      description: 'Classification and relationships',
      icon: Target,
      fields: ['accountSegment', 'accountStatus', 'healthScore', 'parentAccountId', 'customerSince']
    },
    {
      id: 6,
      title: 'Technology & Competition',
      description: 'Tech stack and competitors',
      icon: Brain,
      fields: ['technologies', 'competitors', 'description']
    },
    {
      id: 7,
      title: 'Tags & Compliance',
      description: 'Tags and data processing consent',
      icon: Shield,
      fields: ['tags', 'gdprConsent', 'customFields']
    },
    {
      id: 8,
      title: 'Review & Create',
      description: 'Confirm and create account',
      icon: Check,
      fields: []
    }
  ];

  // Mutations
  const createAccountMutation = useMutation({
    mutationFn: async (accountData: CreateAccountData) => {
      return apiRequest('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(accountData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      setLocation(`/crm/accounts/${newAccount.id}`);
    },
    onError: (error) => {
      console.error('Error creating account:', error);
    }
  });

  // Helper Functions
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Basic Information
        if (!formData.name?.trim()) {
          newErrors.name = 'Company name is required';
        }
        if (!formData.accountType) {
          newErrors.accountType = 'Account type is required';
        }
        break;
      case 2: // Company Profile
        if (formData.employees && formData.employees < 0) {
          newErrors.employees = 'Employee count must be positive';
        }
        if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
          newErrors.foundedYear = 'Please enter a valid founding year';
        }
        if (formData.annualRevenue && formData.annualRevenue < 0) {
          newErrors.annualRevenue = 'Annual revenue must be positive';
        }
        break;
      case 3: // Contact & Social
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
          newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
        }
        break;
      case 4: // Address Information - No required fields
        break;
      case 5: // Business Intelligence
        if (formData.healthScore && (formData.healthScore < 0 || formData.healthScore > 100)) {
          newErrors.healthScore = 'Health score must be between 0 and 100';
        }
        break;
      case 6: // Technology & Competition - No required fields
        break;
      case 7: // Tags & Compliance - No required fields
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateAccountData] as any || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // Array management utilities for technologies and competitors
  const handleArrayAdd = (field: 'technologies' | 'competitors', value: string) => {
    if (value.trim() && !formData[field]?.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field: 'technologies' | 'competitors', valueToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter(item => item !== valueToRemove) || []
    }));
  };

  // AI Enrichment (Mock implementation - Replace with actual API)
  const handleEnrichment = async () => {
    if (!formData.name && !formData.domain && !formData.website) return;
    
    setIsEnriching(true);
    
    try {
      // Mock AI enrichment - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockEnrichmentData: EnrichmentData = {
        name: formData.name || 'Enriched Company Name',
        domain: formData.domain || 'example.com',
        website: formData.website || 'https://example.com',
        description: 'AI-generated company description based on available data...',
        industry: 'technology',
        employees: 150,
        foundedYear: 2015,
        annualRevenue: 5000000,
        address: {
          street: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'United States'
        }
      };
      
      setEnrichmentData(mockEnrichmentData);
      setShowEnrichmentModal(true);
    } catch (error) {
      console.error('Enrichment error:', error);
    } finally {
      setIsEnriching(false);
    }
  };

  const applyEnrichment = () => {
    if (enrichmentData) {
      setFormData(prev => ({
        ...prev,
        ...enrichmentData,
        address: { ...prev.address, ...enrichmentData.address }
      }));
      setShowEnrichmentModal(false);
      setEnrichmentData(null);
    }
  };

  const handleSubmit = () => {
    if (validateStep(7)) {
      createAccountMutation.mutate(formData);
    }
  };

  const handleBack = () => {
    setLocation('/crm/accounts');
  };

  // Options for dropdowns
  const accountTypes = ['prospect', 'customer', 'partner', 'vendor', 'competitor', 'former_customer'];
  const accountStatuses = ['active', 'inactive', 'suspended', 'churned', 'potential'];
  const accountSegments = ['enterprise', 'mid_market', 'smb', 'startup', 'government', 'non_profit'];
  const industries = [
    'technology', 'healthcare', 'finance', 'education', 'manufacturing',
    'retail', 'real_estate', 'consulting', 'media', 'transportation',
    'energy', 'agriculture', 'biotechnology', 'fashion', 'other'
  ];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Create New Account
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h1>
              <p className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* AI Enrichment Button */}
          {currentStep <= 2 && (formData.name || formData.domain || formData.website) && (
            <button
              onClick={handleEnrichment}
              disabled={isEnriching}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              data-testid="button-enrich"
            >
              {isEnriching ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Enriching...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  AI Enrich
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-8 rounded ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                    <p className="text-gray-600 mb-6">Let's start with the essential company details</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter company name..."
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        data-testid="input-company-name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Domain
                      </label>
                      <input
                        type="text"
                        value={formData.domain || ''}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        placeholder="example.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-domain"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-website"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={formData.logoUrl || ''}
                          onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-logo-url"
                        />
                        <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type *
                      </label>
                      <select
                        value={formData.accountType}
                        onChange={(e) => handleInputChange('accountType', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.accountType ? 'border-red-500' : 'border-gray-300'
                        }`}
                        data-testid="select-account-type"
                      >
                        {accountTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      {errors.accountType && (
                        <p className="text-red-600 text-sm mt-1">{errors.accountType}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Company Profile */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Profile</h2>
                    <p className="text-gray-600 mb-6">Industry and financial information about the company</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        value={formData.industry || ''}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="select-industry"
                      >
                        <option value="">Select industry...</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>
                            {industry.charAt(0).toUpperCase() + industry.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <select
                        value={formData.companySize || ''}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="select-company-size"
                      >
                        <option value="">Select size...</option>
                        {companySizes.map(size => (
                          <option key={size} value={size}>
                            {size} employees
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Employees
                      </label>
                      <input
                        type="number"
                        value={formData.employees || ''}
                        onChange={(e) => handleInputChange('employees', parseInt(e.target.value) || undefined)}
                        placeholder="150"
                        min="1"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.employees ? 'border-red-500' : 'border-gray-300'
                        }`}
                        data-testid="input-employees"
                      />
                      {errors.employees && (
                        <p className="text-red-600 text-sm mt-1">{errors.employees}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Founded Year
                      </label>
                      <input
                        type="number"
                        value={formData.foundedYear || ''}
                        onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value) || undefined)}
                        placeholder="2020"
                        min="1800"
                        max={new Date().getFullYear()}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.foundedYear ? 'border-red-500' : 'border-gray-300'
                        }`}
                        data-testid="input-founded-year"
                      />
                      {errors.foundedYear && (
                        <p className="text-red-600 text-sm mt-1">{errors.foundedYear}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Revenue
                      </label>
                      <input
                        type="number"
                        value={formData.annualRevenue || ''}
                        onChange={(e) => handleInputChange('annualRevenue', parseInt(e.target.value) || undefined)}
                        placeholder="1000000"
                        min="0"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.annualRevenue ? 'border-red-500' : 'border-gray-300'
                        }`}
                        data-testid="input-annual-revenue"
                      />
                      {errors.annualRevenue && (
                        <p className="text-red-600 text-sm mt-1">{errors.annualRevenue}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Enter the annual revenue in USD</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Symbol
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.stockSymbol || ''}
                          onChange={(e) => handleInputChange('stockSymbol', e.target.value.toUpperCase())}
                          placeholder="AAPL"
                          maxLength={10}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                          data-testid="input-stock-symbol"
                        />
                        <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Ticker symbol if publicly traded</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Social */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact & Social</h2>
                    <p className="text-gray-600 mb-6">Contact information and social media presence</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-phone"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="contact@company.com"
                          className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          data-testid="input-email"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={formData.linkedinUrl || ''}
                          onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/company/example"
                          className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.linkedinUrl ? 'border-red-500' : 'border-gray-300'
                          }`}
                          data-testid="input-linkedin-url"
                        />
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4" />
                      </div>
                      {errors.linkedinUrl && (
                        <p className="text-red-600 text-sm mt-1">{errors.linkedinUrl}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={formData.twitterUrl || ''}
                          onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                          placeholder="https://twitter.com/company"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-twitter-url"
                        />
                        <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fax Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={formData.fax || ''}
                          onChange={(e) => handleInputChange('fax', e.target.value)}
                          placeholder="+1 (555) 123-4568"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-fax"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Website
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={formData.secondaryWebsite || ''}
                          onChange={(e) => handleInputChange('secondaryWebsite', e.target.value)}
                          placeholder="https://blog.example.com"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-secondary-website"
                        />
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Address Information */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
                    <p className="text-gray-600 mb-6">Primary and billing addresses for the company</p>
                  </div>

                  {/* Primary Address */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Primary Address
                    </h3>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={formData.address?.street || ''}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        placeholder="Street Address"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-primary-street"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={formData.address?.city || ''}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          placeholder="City"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-primary-city"
                        />
                        <input
                          type="text"
                          value={formData.address?.state || ''}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          placeholder="State"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-primary-state"
                        />
                        <input
                          type="text"
                          value={formData.address?.zipCode || ''}
                          onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                          placeholder="ZIP Code"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-primary-zip"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.address?.country || ''}
                        onChange={(e) => handleInputChange('address.country', e.target.value)}
                        placeholder="Country"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-primary-country"
                      />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Billing Address
                    </h3>
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={formData.billingAddressSameAsPrimary || false}
                        onChange={(e) => handleInputChange('billingAddressSameAsPrimary', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        data-testid="checkbox-same-billing"
                      />
                      <span className="text-sm text-gray-700">Same as primary address</span>
                    </label>
                    
                    {!formData.billingAddressSameAsPrimary && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={formData.billingAddress?.street || ''}
                          onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                          placeholder="Billing Street Address"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-billing-street"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={formData.billingAddress?.city || ''}
                            onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                            placeholder="City"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="input-billing-city"
                          />
                          <input
                            type="text"
                            value={formData.billingAddress?.state || ''}
                            onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                            placeholder="State"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="input-billing-state"
                          />
                          <input
                            type="text"
                            value={formData.billingAddress?.zipCode || ''}
                            onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                            placeholder="ZIP Code"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="input-billing-zip"
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.billingAddress?.country || ''}
                          onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                          placeholder="Country"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-billing-country"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Business Intelligence */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Intelligence</h2>
                    <p className="text-gray-600 mb-6">Account health, relationships, and business metrics</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Health Score
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.healthScore || ''}
                          onChange={(e) => handleInputChange('healthScore', parseInt(e.target.value) || undefined)}
                          placeholder="85"
                          className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.healthScore ? 'border-red-500' : 'border-gray-300'
                          }`}
                          data-testid="input-health-score"
                        />
                        <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      {errors.healthScore && (
                        <p className="text-red-600 text-sm mt-1">{errors.healthScore}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Score from 0-100</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Since
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.customerSince || ''}
                          onChange={(e) => handleInputChange('customerSince', e.target.value)}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-customer-since"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Segment
                      </label>
                      <select
                        value={formData.accountSegment}
                        onChange={(e) => handleInputChange('accountSegment', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="select-account-segment"
                      >
                        <option value="">Select segment...</option>
                        {accountSegments.map(segment => (
                          <option key={segment} value={segment}>
                            {segment.charAt(0).toUpperCase() + segment.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Status
                      </label>
                      <select
                        value={formData.accountStatus}
                        onChange={(e) => handleInputChange('accountStatus', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="select-account-status"
                      >
                        <option value="">Select status...</option>
                        {accountStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Account ID
                      </label>
                      <input
                        type="text"
                        value={formData.parentAccountId || ''}
                        onChange={(e) => handleInputChange('parentAccountId', e.target.value)}
                        placeholder="UUID of parent account"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-parent-account"
                      />
                      <p className="text-sm text-gray-500 mt-1">For subsidiary companies</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sister Account ID
                      </label>
                      <input
                        type="text"
                        value={formData.sisterAccountId || ''}
                        onChange={(e) => handleInputChange('sisterAccountId', e.target.value)}
                        placeholder="UUID of sister account"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-sister-account"
                      />
                      <p className="text-sm text-gray-500 mt-1">For related companies</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Brief description of the company and relationship..."
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="textarea-description"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Technology & Competition */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology & Competition</h2>
                    <p className="text-gray-600 mb-6">Tech stack, competitors, and market positioning</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Technologies */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technologies Used
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add technology (e.g., React, AWS, Salesforce)"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = (e.target as HTMLInputElement).value;
                                if (value.trim()) {
                                  handleArrayAdd('technologies', value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                            data-testid="input-technology"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input.value.trim()) {
                                handleArrayAdd('technologies', input.value);
                                input.value = '';
                              }
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            data-testid="button-add-technology"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.technologies && formData.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                              >
                                {tech}
                                <button
                                  onClick={() => handleArrayRemove('technologies', tech)}
                                  className="text-blue-600 hover:text-blue-800"
                                  data-testid={`remove-technology-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Competitors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Competitors
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add competitor company name"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = (e.target as HTMLInputElement).value;
                                if (value.trim()) {
                                  handleArrayAdd('competitors', value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                            data-testid="input-competitor"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input.value.trim()) {
                                handleArrayAdd('competitors', input.value);
                                input.value = '';
                              }
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            data-testid="button-add-competitor"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {formData.competitors && formData.competitors.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.competitors.map((competitor, index) => (
                              <span
                                key={index}
                                className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                              >
                                {competitor}
                                <button
                                  onClick={() => handleArrayRemove('competitors', competitor)}
                                  className="text-red-600 hover:text-red-800"
                                  data-testid={`remove-competitor-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Tags & Compliance */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags & Compliance</h2>
                    <p className="text-gray-600 mb-6">Categorization tags and compliance information</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <TagInput
                        tags={formData.tags || []}
                        onAdd={handleTagAdd}
                        onRemove={handleTagRemove}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          VAT Number
                        </label>
                        <input
                          type="text"
                          value={formData.vatNumber || ''}
                          onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                          placeholder="GB123456789"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-vat-number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={formData.gstNumber || ''}
                          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                          placeholder="22AAAAA0000A1Z5"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-gst-number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          D-U-N-S Number
                        </label>
                        <input
                          type="text"
                          value={formData.dunsNumber || ''}
                          onChange={(e) => handleInputChange('dunsNumber', e.target.value)}
                          placeholder="123456789"
                          maxLength={9}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-duns-number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Region
                        </label>
                        <select
                          value={formData.region || ''}
                          onChange={(e) => handleInputChange('region', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="select-region"
                        >
                          <option value="">Select region...</option>
                          <option value="north_america">North America</option>
                          <option value="europe">Europe</option>
                          <option value="asia_pacific">Asia Pacific</option>
                          <option value="latin_america">Latin America</option>
                          <option value="middle_east_africa">Middle East & Africa</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        GDPR Compliance
                      </h3>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.gdprConsent || false}
                          onChange={(e) => handleInputChange('gdprConsent', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          data-testid="checkbox-gdpr-consent"
                        />
                        <span className="text-sm text-gray-700">
                          Company has provided GDPR consent for data processing
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Review & Create */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Create</h2>
                    <p className="text-gray-600 mb-6">Please review all information before creating the account</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm text-gray-600">Company Name</dt>
                            <dd className="font-medium">{formData.name}</dd>
                          </div>
                          {formData.domain && (
                            <div>
                              <dt className="text-sm text-gray-600">Domain</dt>
                              <dd className="font-medium">{formData.domain}</dd>
                            </div>
                          )}
                          {formData.website && (
                            <div>
                              <dt className="text-sm text-gray-600">Website</dt>
                              <dd className="font-medium">{formData.website}</dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-sm text-gray-600">Account Type</dt>
                            <dd className="font-medium">{formData.accountType}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Company Details</h3>
                        <dl className="space-y-2">
                          {formData.industry && (
                            <div>
                              <dt className="text-sm text-gray-600">Industry</dt>
                              <dd className="font-medium">{formData.industry}</dd>
                            </div>
                          )}
                          {formData.employees && (
                            <div>
                              <dt className="text-sm text-gray-600">Employees</dt>
                              <dd className="font-medium">{formData.employees}</dd>
                            </div>
                          )}
                          {formData.foundedYear && (
                            <div>
                              <dt className="text-sm text-gray-600">Founded</dt>
                              <dd className="font-medium">{formData.foundedYear}</dd>
                            </div>
                          )}
                          {formData.annualRevenue && (
                            <div>
                              <dt className="text-sm text-gray-600">Annual Revenue</dt>
                              <dd className="font-medium">
                                ${formData.annualRevenue.toLocaleString()}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>

                    {(formData.phone || formData.email || (formData.address && Object.values(formData.address).some(v => v))) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <dl className="space-y-2">
                          {formData.phone && (
                            <div>
                              <dt className="text-sm text-gray-600">Phone</dt>
                              <dd className="font-medium">{formData.phone}</dd>
                            </div>
                          )}
                          {formData.email && (
                            <div>
                              <dt className="text-sm text-gray-600">Email</dt>
                              <dd className="font-medium">{formData.email}</dd>
                            </div>
                          )}
                          {formData.address && Object.values(formData.address).some(v => v) && (
                            <div>
                              <dt className="text-sm text-gray-600">Address</dt>
                              <dd className="font-medium">
                                {[
                                  formData.address.street,
                                  formData.address.city,
                                  formData.address.state,
                                  formData.address.zipCode
                                ].filter(Boolean).join(', ')}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}

                    {(formData.description || formData.tags?.length) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                        {formData.description && (
                          <div className="mb-4">
                            <dt className="text-sm text-gray-600 mb-1">Description</dt>
                            <dd className="font-medium">{formData.description}</dd>
                          </div>
                        )}
                        {formData.tags && formData.tags.length > 0 && (
                          <div>
                            <dt className="text-sm text-gray-600 mb-2">Tags</dt>
                            <dd>
                              <div className="flex flex-wrap gap-2">
                                {formData.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              data-testid="button-previous"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                data-testid="button-next"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={createAccountMutation.isPending}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                data-testid="button-create"
              >
                {createAccountMutation.isPending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Enrichment Modal */}
      <AnimatePresence>
        {showEnrichmentModal && enrichmentData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI Enrichment Results
                </h3>
                <button
                  onClick={() => setShowEnrichmentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  We found additional information about this company. Would you like to apply these enrichments?
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Enriched Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {enrichmentData.name && (
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{enrichmentData.name}</span>
                      </div>
                    )}
                    {enrichmentData.domain && (
                      <div>
                        <span className="text-gray-600">Domain:</span>
                        <span className="ml-2 font-medium">{enrichmentData.domain}</span>
                      </div>
                    )}
                    {enrichmentData.industry && (
                      <div>
                        <span className="text-gray-600">Industry:</span>
                        <span className="ml-2 font-medium">{enrichmentData.industry}</span>
                      </div>
                    )}
                    {enrichmentData.employees && (
                      <div>
                        <span className="text-gray-600">Employees:</span>
                        <span className="ml-2 font-medium">{enrichmentData.employees}</span>
                      </div>
                    )}
                    {enrichmentData.foundedYear && (
                      <div>
                        <span className="text-gray-600">Founded:</span>
                        <span className="ml-2 font-medium">{enrichmentData.foundedYear}</span>
                      </div>
                    )}
                    {enrichmentData.annualRevenue && (
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="ml-2 font-medium">
                          ${enrichmentData.annualRevenue.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {enrichmentData.description && (
                    <div className="mt-4">
                      <span className="text-gray-600">Description:</span>
                      <p className="mt-1 text-sm">{enrichmentData.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowEnrichmentModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyEnrichment}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply Enrichment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Tag Input Component
const TagInput: React.FC<{
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}> = ({ tags, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        onAdd(inputValue.trim());
        setInputValue('');
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => onRemove(tag)}
              className="text-yellow-600 hover:text-yellow-800 transition-colors"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a tag and press Enter..."
        className="w-full outline-none"
        data-testid="input-tags"
      />
      <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add tags</p>
    </div>
  );
};

export default UltimateCreateAccountPage;