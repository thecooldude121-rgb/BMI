import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Building, ArrowLeft, ArrowRight, Check, AlertTriangle, 
  Globe, Phone, Mail, MapPin, Users, DollarSign, Brain,
  Sparkles, Search, ExternalLink, Loader, X, Plus,
  Target, Calendar, FileText, Tag, Shield, Award
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  tags?: string[];
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
    tags: []
  });

  // Steps Configuration
  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Essential company details',
      icon: Building,
      fields: ['name', 'domain', 'website', 'accountType']
    },
    {
      id: 2,
      title: 'Company Details',
      description: 'Industry and size information',
      icon: Users,
      fields: ['industry', 'companySize', 'employees', 'foundedYear', 'annualRevenue']
    },
    {
      id: 3,
      title: 'Contact Information',
      description: 'Address and contact details',
      icon: Phone,
      fields: ['phone', 'email', 'address']
    },
    {
      id: 4,
      title: 'Classification',
      description: 'Account type and segmentation',
      icon: Target,
      fields: ['accountSegment', 'accountStatus', 'description', 'tags']
    },
    {
      id: 5,
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
      case 1:
        if (!formData.name?.trim()) {
          newErrors.name = 'Company name is required';
        }
        if (!formData.accountType) {
          newErrors.accountType = 'Account type is required';
        }
        break;
      case 2:
        // Optional validations for step 2
        if (formData.employees && formData.employees < 0) {
          newErrors.employees = 'Employee count must be positive';
        }
        if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
          newErrors.foundedYear = 'Please enter a valid founding year';
        }
        break;
      case 3:
        // Optional validations for step 3
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 4:
        // Optional validations for step 4
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
          ...prev[parent as keyof CreateAccountData],
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
    if (validateStep(4)) {
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

                    <div className="md:col-span-2">
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

              {/* Step 2: Company Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h2>
                    <p className="text-gray-600 mb-6">Tell us more about the company's industry and size</p>
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

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Revenue
                      </label>
                      <input
                        type="number"
                        value={formData.annualRevenue || ''}
                        onChange={(e) => handleInputChange('annualRevenue', parseInt(e.target.value) || undefined)}
                        placeholder="1000000"
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-annual-revenue"
                      />
                      <p className="text-sm text-gray-500 mt-1">Enter the annual revenue in USD</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                    <p className="text-gray-600 mb-6">How can we reach this company?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@company.com"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        data-testid="input-email"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Address
                      </label>
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={formData.address?.street || ''}
                          onChange={(e) => handleInputChange('address.street', e.target.value)}
                          placeholder="Street Address"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="input-street"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={formData.address?.city || ''}
                            onChange={(e) => handleInputChange('address.city', e.target.value)}
                            placeholder="City"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="input-city"
                          />
                          <input
                            type="text"
                            value={formData.address?.state || ''}
                            onChange={(e) => handleInputChange('address.state', e.target.value)}
                            placeholder="State"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="input-state"
                          />
                          <input
                            type="text"
                            value={formData.address?.zipCode || ''}
                            onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                            placeholder="ZIP Code"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            data-testid="input-zip"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Classification */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Classification</h2>
                    <p className="text-gray-600 mb-6">Categorize this account for better management</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {accountStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
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

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <TagInput
                        tags={formData.tags || []}
                        onAdd={handleTagAdd}
                        onRemove={handleTagRemove}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Create */}
              {currentStep === 5 && (
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