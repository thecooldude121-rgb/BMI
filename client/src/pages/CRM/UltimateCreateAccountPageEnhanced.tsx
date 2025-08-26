import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Building, ArrowLeft, ArrowRight, Check, AlertTriangle, 
  Globe, Phone, Mail, MapPin, Users, DollarSign, Brain,
  Sparkles, Search, ExternalLink, Loader, X, Plus,
  Target, Calendar, FileText, Tag, Shield, Award,
  Linkedin, Twitter, TrendingUp, Image, Link,
  Save, Eye, Upload, Camera, Zap, BarChart3
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
  linkedinUrl?: string;
  twitterUrl?: string;
  fax?: string;
  logoUrl?: string;
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
  billingAddressSameAsPrimary?: boolean;
  healthScore?: number;
  tags?: string[];
  technologies?: string[];
  competitors?: string[];
  vatNumber?: string;
  dunsNumber?: string;
  gdprConsent?: boolean;
  customFields?: Record<string, any>;
}

interface EnrichmentData {
  name: string;
  domain: string;
  website: string;
  industry: string;
  employees: number;
  annualRevenue: number;
  description: string;
  logoUrl: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  technologies: string[];
  competitors: string[];
}

const UltimateCreateAccountPageEnhanced: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // State Management
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);

  const [formData, setFormData] = useState<CreateAccountData>({
    name: '',
    accountType: 'prospect',
    accountStatus: 'active',
    accountSegment: 'smb',
    address: {},
    billingAddress: {},
    tags: [],
    technologies: [],
    competitors: [],
    customFields: {},
    healthScore: 50,
    gdprConsent: false
  });

  // Navigation sections for full-page layout
  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Essential company details and contact',
      icon: Building,
      color: 'blue'
    },
    {
      id: 'profile',
      title: 'Company Profile',
      description: 'Industry, size, and financial data',
      icon: Users,
      color: 'purple'
    },
    {
      id: 'contact',
      title: 'Contact & Social',
      description: 'Communication channels and social media',
      icon: Phone,
      color: 'green'
    },
    {
      id: 'address',
      title: 'Address Information',
      description: 'Physical and billing addresses',
      icon: MapPin,
      color: 'orange'
    },
    {
      id: 'intelligence',
      title: 'Business Intelligence',
      description: 'Classification and relationships',
      icon: Brain,
      color: 'indigo'
    },
    {
      id: 'technology',
      title: 'Technology & Competition',
      description: 'Tech stack and competitive landscape',
      icon: Zap,
      color: 'yellow'
    },
    {
      id: 'compliance',
      title: 'Tags & Compliance',
      description: 'Data processing and legal information',
      icon: Shield,
      color: 'red'
    }
  ];

  // Options for dropdowns
  const accountTypes = ['prospect', 'customer', 'partner', 'vendor', 'competitor'];
  const accountStatuses = ['active', 'inactive', 'prospect', 'customer', 'closed'];
  const accountSegments = ['smb', 'mid_market', 'enterprise', 'startup'];
  const industries = [
    'technology', 'healthcare', 'finance', 'education', 'manufacturing', 
    'retail', 'consulting', 'media', 'real_estate', 'transportation',
    'energy', 'agriculture', 'construction', 'hospitality', 'other'
  ];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
    'Australia', 'Japan', 'India', 'China', 'Brazil', 'Other'
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
      setErrors({ submit: 'Failed to create account. Please try again.' });
    }
  });

  // Helper Functions
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (addressType: 'address' | 'billingAddress', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (field: 'tags' | 'technologies' | 'competitors', value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = (field: 'tags' | 'technologies' | 'competitors', tag: string) => {
    if (tag.trim() && !formData[field]?.includes(tag.trim())) {
      handleArrayFieldChange(field, [...(formData[field] || []), tag.trim()]);
    }
  };

  const removeTag = (field: 'tags' | 'technologies' | 'competitors', index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    handleArrayFieldChange(field, newArray);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Company name is required';
    }
    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (basic)
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // URL validation
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    // Numeric validation
    if (formData.employees && formData.employees < 0) {
      newErrors.employees = 'Employee count must be positive';
    }
    if (formData.annualRevenue && formData.annualRevenue < 0) {
      newErrors.annualRevenue = 'Annual revenue must be positive';
    }
    if (formData.foundedYear && (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
      newErrors.foundedYear = 'Please enter a valid founding year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createAccountMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    // In a real implementation, this would save to localStorage or backend
    setTimeout(() => setIsDraft(false), 2000);
  };

  const mockEnrichment = async (domain: string) => {
    setIsEnriching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData: EnrichmentData = {
      name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) + ' Inc',
      domain,
      website: `https://${domain}`,
      industry: 'technology',
      employees: Math.floor(Math.random() * 500) + 50,
      annualRevenue: Math.floor(Math.random() * 10000000) + 1000000,
      description: `${domain.split('.')[0]} is a leading company in the technology sector, providing innovative solutions to businesses worldwide.`,
      logoUrl: `https://logo.clearbit.com/${domain}`,
      phone: '+1 (555) 123-4567',
      email: `contact@${domain}`,
      linkedinUrl: `https://linkedin.com/company/${domain.split('.')[0]}`,
      address: {
        street: '123 Business Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      },
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      competitors: ['Competitor A', 'Competitor B', 'Competitor C']
    };

    setEnrichmentData(mockData);
    setIsEnriching(false);
  };

  const applyEnrichmentData = () => {
    if (!enrichmentData) return;
    
    setFormData(prev => ({
      ...prev,
      ...enrichmentData,
      accountType: prev.accountType, // Keep user selection
      accountStatus: prev.accountStatus,
      accountSegment: prev.accountSegment
    }));
    setEnrichmentData(null);
  };

  // Auto-save draft functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name) {
        localStorage.setItem('createAccountDraft', JSON.stringify(formData));
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('createAccountDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'ring') => {
    const colorMap = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', ring: 'ring-blue-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', ring: 'ring-purple-500' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200', ring: 'ring-green-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', ring: 'ring-orange-500' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'ring-indigo-500' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200', ring: 'ring-yellow-500' },
      red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200', ring: 'ring-red-500' }
    };
    return colorMap[color as keyof typeof colorMap]?.[type] || colorMap.blue[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Fixed Header */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLocation('/crm/accounts')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Accounts
              </motion.button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Account</h1>
                <p className="text-sm text-gray-500">Build a comprehensive company profile</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveDraft}
                disabled={isDraft}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                data-testid="button-save-draft"
              >
                {isDraft ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {isDraft ? 'Saved' : 'Save Draft'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-create-account"
              >
                {isSubmitting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Content with top padding to account for fixed header */}
      <div className="pt-28 max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-32">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Form Sections</h3>
                  <p className="text-sm text-gray-500">Complete all sections to create a comprehensive account</p>
                </div>
                
                <div className="p-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const isCompleted = false; // You could add completion logic here
                    
                    return (
                      <motion.button
                        key={section.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? `${getColorClasses(section.color, 'bg')} bg-opacity-10 ${getColorClasses(section.color, 'border')} border` 
                            : 'hover:bg-gray-50'
                        }`}
                        data-testid={`nav-${section.id}`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive ? getColorClasses(section.color, 'bg') : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isActive ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className={`font-medium ${
                            isActive ? getColorClasses(section.color, 'text') : 'text-gray-900'
                          }`}>
                            {section.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {section.description}
                          </div>
                        </div>
                        
                        {isCompleted && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* AI Enrichment Panel */}
                {formData.domain && (
                  <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">AI Data Enrichment</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Let AI automatically populate company information using the domain
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => mockEnrichment(formData.domain!)}
                      disabled={isEnriching}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                      data-testid="button-enrich-data"
                    >
                      {isEnriching ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Brain className="w-4 h-4" />
                      )}
                      {isEnriching ? 'Enriching...' : 'Enrich Data'}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200"
            >
              <div className="p-8">
                {/* Basic Information Section */}
                {activeSection === 'basic' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                      <p className="text-gray-600">Essential company details and primary contact information</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter company name"
                          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          data-testid="input-company-name"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm mt-2">{errors.name}</p>
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
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          data-testid="input-domain"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={formData.website || ''}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            placeholder="https://example.com"
                            className={`w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.website ? 'border-red-500' : 'border-gray-300'
                            }`}
                            data-testid="input-website"
                          />
                          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                        {errors.website && (
                          <p className="text-red-600 text-sm mt-2">{errors.website}</p>
                        )}
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
                            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            data-testid="input-logo-url"
                          />
                          <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Type *
                        </label>
                        <select
                          value={formData.accountType}
                          onChange={(e) => handleInputChange('accountType', e.target.value)}
                          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
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
                          <p className="text-red-600 text-sm mt-2">{errors.accountType}</p>
                        )}
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Brief description of the company..."
                          rows={4}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          data-testid="textarea-description"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Company Profile Section */}
                {activeSection === 'profile' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h2>
                      <p className="text-gray-600">Industry classification and financial information</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry
                        </label>
                        <select
                          value={formData.industry || ''}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.employees || ''}
                            onChange={(e) => handleInputChange('employees', parseInt(e.target.value) || undefined)}
                            placeholder="150"
                            min="1"
                            className={`w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                              errors.employees ? 'border-red-500' : 'border-gray-300'
                            }`}
                            data-testid="input-employees"
                          />
                          <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                        {errors.employees && (
                          <p className="text-red-600 text-sm mt-2">{errors.employees}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Founded Year
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.foundedYear || ''}
                            onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value) || undefined)}
                            placeholder="2010"
                            min="1800"
                            max={new Date().getFullYear()}
                            className={`w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                              errors.foundedYear ? 'border-red-500' : 'border-gray-300'
                            }`}
                            data-testid="input-founded-year"
                          />
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                        {errors.foundedYear && (
                          <p className="text-red-600 text-sm mt-2">{errors.foundedYear}</p>
                        )}
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Revenue
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.annualRevenue || ''}
                            onChange={(e) => handleInputChange('annualRevenue', parseFloat(e.target.value) || undefined)}
                            placeholder="5000000"
                            min="0"
                            step="10000"
                            className={`w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                              errors.annualRevenue ? 'border-red-500' : 'border-gray-300'
                            }`}
                            data-testid="input-annual-revenue"
                          />
                          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                        {errors.annualRevenue && (
                          <p className="text-red-600 text-sm mt-2">{errors.annualRevenue}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact & Social Section */}
                {activeSection === 'contact' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact & Social Media</h2>
                      <p className="text-gray-600">Communication channels and social media presence</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                            className={`w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            data-testid="input-phone"
                          />
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                        {errors.phone && (
                          <p className="text-red-600 text-sm mt-2">{errors.phone}</p>
                        )}
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
                            placeholder="contact@example.com"
                            className={`w-full p-4 pl-12 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            data-testid="input-email"
                          />
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                        {errors.email && (
                          <p className="text-red-600 text-sm mt-2">{errors.email}</p>
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
                            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            data-testid="input-linkedin"
                          />
                          <Linkedin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
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
                            placeholder="https://twitter.com/example"
                            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            data-testid="input-twitter"
                          />
                          <Twitter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fax Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.fax || ''}
                            onChange={(e) => handleInputChange('fax', e.target.value)}
                            placeholder="+1 (555) 123-4568"
                            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            data-testid="input-fax"
                          />
                          <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Information Section */}
                {activeSection === 'address' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Address Information</h2>
                      <p className="text-gray-600">Physical location and billing address details</p>
                    </div>

                    {/* Primary Address */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        Primary Address
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={formData.address?.street || ''}
                            onChange={(e) => handleAddressChange('address', 'street', e.target.value)}
                            placeholder="123 Business Avenue"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            data-testid="input-address-street"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.address?.city || ''}
                            onChange={(e) => handleAddressChange('address', 'city', e.target.value)}
                            placeholder="San Francisco"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            data-testid="input-address-city"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                          </label>
                          <input
                            type="text"
                            value={formData.address?.state || ''}
                            onChange={(e) => handleAddressChange('address', 'state', e.target.value)}
                            placeholder="CA"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            data-testid="input-address-state"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code
                          </label>
                          <input
                            type="text"
                            value={formData.address?.zipCode || ''}
                            onChange={(e) => handleAddressChange('address', 'zipCode', e.target.value)}
                            placeholder="94105"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            data-testid="input-address-zip"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            value={formData.address?.country || ''}
                            onChange={(e) => handleAddressChange('address', 'country', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            data-testid="select-address-country"
                          >
                            <option value="">Select country...</option>
                            {countries.map(country => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-gray-600" />
                          Billing Address
                        </h3>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.billingAddressSameAsPrimary || false}
                            onChange={(e) => {
                              const isSame = e.target.checked;
                              handleInputChange('billingAddressSameAsPrimary', isSame);
                              if (isSame) {
                                handleInputChange('billingAddress', formData.address);
                              }
                            }}
                            className="rounded text-orange-600 focus:ring-orange-500"
                            data-testid="checkbox-billing-same"
                          />
                          <span className="text-sm text-gray-700">Same as primary address</span>
                        </label>
                      </div>

                      {!formData.billingAddressSameAsPrimary && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address
                            </label>
                            <input
                              type="text"
                              value={formData.billingAddress?.street || ''}
                              onChange={(e) => handleAddressChange('billingAddress', 'street', e.target.value)}
                              placeholder="123 Billing Street"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              data-testid="input-billing-street"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={formData.billingAddress?.city || ''}
                              onChange={(e) => handleAddressChange('billingAddress', 'city', e.target.value)}
                              placeholder="New York"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              data-testid="input-billing-city"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State/Province
                            </label>
                            <input
                              type="text"
                              value={formData.billingAddress?.state || ''}
                              onChange={(e) => handleAddressChange('billingAddress', 'state', e.target.value)}
                              placeholder="NY"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              data-testid="input-billing-state"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP/Postal Code
                            </label>
                            <input
                              type="text"
                              value={formData.billingAddress?.zipCode || ''}
                              onChange={(e) => handleAddressChange('billingAddress', 'zipCode', e.target.value)}
                              placeholder="10001"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              data-testid="input-billing-zip"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <select
                              value={formData.billingAddress?.country || ''}
                              onChange={(e) => handleAddressChange('billingAddress', 'country', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                              data-testid="select-billing-country"
                            >
                              <option value="">Select country...</option>
                              {countries.map(country => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Business Intelligence Section */}
                {activeSection === 'intelligence' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Intelligence</h2>
                      <p className="text-gray-600">Classification, relationships, and business insights</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Segment
                        </label>
                        <select
                          value={formData.accountSegment}
                          onChange={(e) => handleInputChange('accountSegment', e.target.value)}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          data-testid="select-account-segment"
                        >
                          {accountSegments.map(segment => (
                            <option key={segment} value={segment}>
                              {segment.replace('_', ' ').toUpperCase()}
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
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          data-testid="select-account-status"
                        >
                          {accountStatuses.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Health Score
                        </label>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.healthScore || 50}
                            onChange={(e) => handleInputChange('healthScore', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            data-testid="range-health-score"
                          />
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Poor (0)</span>
                            <span className="font-medium text-indigo-600">{formData.healthScore || 50}</span>
                            <span>Excellent (100)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technology & Competition Section */}
                {activeSection === 'technology' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Technology & Competition</h2>
                      <p className="text-gray-600">Technology stack and competitive landscape information</p>
                    </div>

                    <div className="space-y-6">
                      {/* Technologies */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-600" />
                          Technologies Used
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter technology (e.g., React, AWS, Salesforce)"
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.target as HTMLInputElement;
                                  addTag('technologies', target.value);
                                  target.value = '';
                                }
                              }}
                              data-testid="input-add-technology"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                                if (input) {
                                  addTag('technologies', input.value);
                                  input.value = '';
                                }
                              }}
                              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                              data-testid="button-add-technology"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {formData.technologies?.map((tech, index) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                              >
                                {tech}
                                <button
                                  onClick={() => removeTag('technologies', index)}
                                  className="ml-1 hover:text-yellow-600 transition-colors"
                                  data-testid={`remove-technology-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Competitors */}
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-red-600" />
                          Competitors
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter competitor name"
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.target as HTMLInputElement;
                                  addTag('competitors', target.value);
                                  target.value = '';
                                }
                              }}
                              data-testid="input-add-competitor"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                                if (input) {
                                  addTag('competitors', input.value);
                                  input.value = '';
                                }
                              }}
                              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              data-testid="button-add-competitor"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {formData.competitors?.map((competitor, index) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                              >
                                {competitor}
                                <button
                                  onClick={() => removeTag('competitors', index)}
                                  className="ml-1 hover:text-red-600 transition-colors"
                                  data-testid={`remove-competitor-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compliance Section */}
                {activeSection === 'compliance' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tags & Compliance</h2>
                      <p className="text-gray-600">Data processing consent and account categorization</p>
                    </div>

                    <div className="space-y-6">
                      {/* Tags */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Tag className="w-5 h-5 text-blue-600" />
                          Account Tags
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter tag (e.g., high-value, tech-startup)"
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.target as HTMLInputElement;
                                  addTag('tags', target.value);
                                  target.value = '';
                                }
                              }}
                              data-testid="input-add-tag"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={(e) => {
                                const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                                if (input) {
                                  addTag('tags', input.value);
                                  input.value = '';
                                }
                              }}
                              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              data-testid="button-add-tag"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {formData.tags?.map((tag, index) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag('tags', index)}
                                  className="ml-1 hover:text-blue-600 transition-colors"
                                  data-testid={`remove-tag-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Compliance */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-gray-600" />
                          Data Compliance
                        </h3>
                        
                        <div className="space-y-4">
                          <label className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={formData.gdprConsent || false}
                              onChange={(e) => handleInputChange('gdprConsent', e.target.checked)}
                              className="mt-1 rounded text-red-600 focus:ring-red-500"
                              data-testid="checkbox-gdpr-consent"
                            />
                            <div>
                              <div className="font-medium text-gray-900">GDPR Consent</div>
                              <div className="text-sm text-gray-600">
                                The company has provided consent for data processing under GDPR regulations
                              </div>
                            </div>
                          </label>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                VAT Number
                              </label>
                              <input
                                type="text"
                                value={formData.vatNumber || ''}
                                onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                                placeholder="GB123456789"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                data-testid="input-vat-number"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                DUNS Number
                              </label>
                              <input
                                type="text"
                                value={formData.dunsNumber || ''}
                                onChange={(e) => handleInputChange('dunsNumber', e.target.value)}
                                placeholder="123456789"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                data-testid="input-duns-number"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enrichment Modal */}
      <AnimatePresence>
        {enrichmentData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Enrichment Results</h3>
                    <p className="text-gray-600">Review and apply the enriched data</p>
                  </div>
                  <button
                    onClick={() => setEnrichmentData(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    data-testid="button-close-enrichment"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Company:</strong> {enrichmentData.name}</div>
                  <div><strong>Industry:</strong> {enrichmentData.industry}</div>
                  <div><strong>Employees:</strong> {enrichmentData.employees}</div>
                  <div><strong>Revenue:</strong> ${enrichmentData.annualRevenue.toLocaleString()}</div>
                  <div><strong>Location:</strong> {enrichmentData.address.city}, {enrichmentData.address.state}</div>
                  <div><strong>Website:</strong> {enrichmentData.website}</div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEnrichmentData(null)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    data-testid="button-cancel-enrichment"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyEnrichmentData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    data-testid="button-apply-enrichment"
                  >
                    Apply Data
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {errors.submit}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UltimateCreateAccountPageEnhanced;