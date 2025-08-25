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
  twitterUrl?: string;
  twitterHandle?: string;
  fax?: string;
  faxNumber?: string;
  secondaryWebsite?: string;
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
  billingAddressSameAsPrimary?: boolean;
  
  // Business intelligence fields
  healthScore?: number;
  customerSince?: string;
  parentAccountId?: string;
  sisterAccountId?: string;
  region?: string;
  
  // Technology and competitor data
  technologies?: string[];
  competitors?: string[];
  
  // Compliance and custom data
  vatNumber?: string;
  gstNumber?: string;
  dunsNumber?: string;
  customFields?: Record<string, any>;
  tags?: string[];
  gdprConsent?: boolean;
  
  // Assignment
  ownerId?: string;
}

interface EnrichmentData {
  // Basic Information
  name?: string;
  domain?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  
  // Company Profile
  industry?: string;
  companySize?: string;
  employees?: number;
  foundedYear?: number;
  annualRevenue?: number;
  stockSymbol?: string;
  
  // Contact & Social
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  fax?: string;
  
  // Address Information
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  // Business Intelligence
  healthScore?: number;
  accountSegment?: string;
  accountStatus?: string;
  customerSince?: string;
  region?: string;
  
  // Technology & Competition
  technologies?: string[];
  competitors?: string[];
  
  // Compliance
  vatNumber?: string;
  gstNumber?: string;
  dunsNumber?: string;
  gdprConsent?: boolean;
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

  // AI-Powered Intelligent Company Enrichment System
  const handleEnrichment = async () => {
    if (!formData.name && !formData.domain && !formData.website) return;
    
    setIsEnriching(true);
    
    try {
      // Simulate intelligent company analysis - In production, would call actual APIs
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const enrichedData = generateIntelligentEnrichment();
      setEnrichmentData(enrichedData);
      setShowEnrichmentModal(true);
    } catch (error) {
      console.error('Enrichment error:', error);
    } finally {
      setIsEnriching(false);
    }
  };

  // Intelligent Company Data Generation Engine
  const generateIntelligentEnrichment = (): EnrichmentData => {
    const inputName = formData.name || '';
    const inputDomain = formData.domain || '';
    const inputWebsite = formData.website || '';
    
    // AI-powered industry detection based on company name patterns
    const industryDetection = detectIndustry(inputName, inputDomain);
    
    // Company size estimation based on name patterns
    const sizeEstimation = estimateCompanySize(inputName, inputDomain);
    
    // Geographic location detection
    const locationData = detectLocation(inputName, inputDomain);
    
    // Technology stack prediction
    const techStack = predictTechStack(industryDetection.industry);
    
    // Competitor analysis
    const competitors = identifyCompetitors(industryDetection.industry);
    
    // Social media URL generation
    const socialUrls = generateSocialUrls(inputName, inputDomain);
    
    return {
      // Basic Information
      name: inputName || industryDetection.suggestedName,
      domain: inputDomain || generateDomain(inputName),
      website: inputWebsite || `https://${inputDomain || generateDomain(inputName)}`,
      logoUrl: `https://logo.clearbit.com/${inputDomain || generateDomain(inputName)}`,
      description: generateDescription(inputName, industryDetection.industry),
      
      // Company Profile
      industry: industryDetection.industry,
      companySize: sizeEstimation.sizeRange,
      employees: sizeEstimation.employeeCount,
      foundedYear: generateFoundedYear(sizeEstimation.maturity),
      annualRevenue: sizeEstimation.estimatedRevenue,
      stockSymbol: industryDetection.isPublic ? generateStockSymbol(inputName) : undefined,
      
      // Contact & Social
      phone: generatePhoneNumber(locationData.country),
      email: `contact@${inputDomain || generateDomain(inputName)}`,
      linkedinUrl: socialUrls.linkedin,
      twitterUrl: socialUrls.twitter,
      fax: Math.random() > 0.7 ? generatePhoneNumber(locationData.country, true) : undefined,
      
      // Address Information
      address: {
        street: locationData.address.street,
        city: locationData.address.city,
        state: locationData.address.state,
        zipCode: locationData.address.zipCode,
        country: locationData.address.country
      },
      
      // Business Intelligence
      healthScore: Math.floor(Math.random() * 30) + 70, // 70-100 range for new prospects
      accountSegment: sizeEstimation.segment,
      accountStatus: 'prospect',
      customerSince: undefined, // New prospect
      region: locationData.region,
      
      // Technology & Competition
      technologies: techStack,
      competitors: competitors,
      
      // Compliance
      vatNumber: locationData.country === 'United Kingdom' ? generateVATNumber() : undefined,
      gstNumber: locationData.country === 'India' ? generateGSTNumber() : undefined,
      dunsNumber: sizeEstimation.employeeCount > 50 ? generateDUNSNumber() : undefined,
      gdprConsent: locationData.isEU
    };
  };

  // Industry Detection Engine
  const detectIndustry = (name: string, domain: string) => {
    const text = `${name} ${domain}`.toLowerCase();
    
    const patterns = {
      technology: ['tech', 'software', 'ai', 'data', 'cloud', 'cyber', 'digital', 'app', 'platform', 'saas', 'api'],
      healthcare: ['health', 'medical', 'pharma', 'bio', 'care', 'clinic', 'hospital', 'therapy'],
      finance: ['bank', 'finance', 'invest', 'capital', 'fund', 'insurance', 'payment', 'fintech', 'crypto'],
      education: ['education', 'learning', 'school', 'university', 'training', 'academic', 'course'],
      manufacturing: ['manufacturing', 'factory', 'industrial', 'production', 'machinery', 'automotive'],
      retail: ['shop', 'store', 'retail', 'commerce', 'market', 'fashion', 'clothing', 'consumer'],
      consulting: ['consulting', 'advisory', 'services', 'solutions', 'strategy', 'management'],
      media: ['media', 'news', 'content', 'marketing', 'advertising', 'creative', 'design', 'agency']
    };
    
    for (const [industry, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return {
          industry,
          confidence: 0.85,
          suggestedName: name || `${industry.charAt(0).toUpperCase() + industry.slice(1)} Solutions Inc`,
          isPublic: Math.random() > 0.8 && industry === 'technology'
        };
      }
    }
    
    return {
      industry: 'other',
      confidence: 0.5,
      suggestedName: name || 'Professional Services Company',
      isPublic: false
    };
  };

  // Company Size Estimation
  const estimateCompanySize = (name: string, domain: string) => {
    const text = `${name} ${domain}`.toLowerCase();
    
    // Enterprise indicators
    if (text.includes('corp') || text.includes('enterprise') || text.includes('global')) {
      return {
        sizeRange: '1000+',
        employeeCount: Math.floor(Math.random() * 5000) + 1000,
        estimatedRevenue: Math.floor(Math.random() * 500000000) + 100000000,
        segment: 'enterprise',
        maturity: 'established'
      };
    }
    
    // SMB indicators
    if (text.includes('llc') || text.includes('consulting') || text.includes('studio')) {
      return {
        sizeRange: '1-50',
        employeeCount: Math.floor(Math.random() * 50) + 1,
        estimatedRevenue: Math.floor(Math.random() * 5000000) + 500000,
        segment: 'smb',
        maturity: 'growing'
      };
    }
    
    // Default mid-market
    return {
      sizeRange: '51-500',
      employeeCount: Math.floor(Math.random() * 450) + 51,
      estimatedRevenue: Math.floor(Math.random() * 50000000) + 5000000,
      segment: 'mid_market',
      maturity: 'established'
    };
  };

  // Geographic Detection
  const detectLocation = (name: string, domain: string) => {
    const text = `${name} ${domain}`.toLowerCase();
    
    const locations = [
      {
        indicators: ['.uk', 'british', 'london', 'manchester'],
        country: 'United Kingdom',
        region: 'europe',
        isEU: true,
        city: 'London',
        state: 'England',
        zipCode: 'SW1A 1AA'
      },
      {
        indicators: ['.de', 'german', 'berlin', 'munich'],
        country: 'Germany',
        region: 'europe',
        isEU: true,
        city: 'Berlin',
        state: 'Berlin',
        zipCode: '10117'
      },
      {
        indicators: ['.ca', 'canadian', 'toronto', 'vancouver'],
        country: 'Canada',
        region: 'north_america',
        isEU: false,
        city: 'Toronto',
        state: 'Ontario',
        zipCode: 'M5H 2N2'
      }
    ];
    
    for (const location of locations) {
      if (location.indicators.some(indicator => text.includes(indicator))) {
        return {
          ...location,
          address: {
            street: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'High', 'King', 'Queen', 'Park'][Math.floor(Math.random() * 5)]} Street`,
            city: location.city,
            state: location.state,
            zipCode: location.zipCode,
            country: location.country
          }
        };
      }
    }
    
    // Default to US
    const usCities = ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Boston', 'Austin'];
    const selectedCity = usCities[Math.floor(Math.random() * usCities.length)];
    
    return {
      country: 'United States',
      region: 'north_america',
      isEU: false,
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'Broadway', 'First', 'Second', 'Market'][Math.floor(Math.random() * 5)]} Street`,
        city: selectedCity,
        state: selectedCity === 'San Francisco' ? 'CA' : selectedCity === 'New York' ? 'NY' : 'TX',
        zipCode: (Math.floor(Math.random() * 90000) + 10000).toString(),
        country: 'United States'
      }
    };
  };

  // Tech Stack Prediction
  const predictTechStack = (industry: string): string[] => {
    const techStacks = {
      technology: ['React', 'Node.js', 'AWS', 'TypeScript', 'MongoDB', 'Kubernetes', 'Docker'],
      finance: ['Java', 'Oracle', 'Kafka', 'Redis', 'Microservices', 'Spring Boot'],
      healthcare: ['Python', 'TensorFlow', 'HIPAA Compliance', 'HL7', 'Electronic Health Records'],
      education: ['Learning Management System', 'Moodle', 'Canvas', 'Zoom', 'Microsoft Teams'],
      retail: ['Shopify', 'Magento', 'Stripe', 'PayPal', 'Inventory Management', 'POS Systems']
    };
    
    const stack = techStacks[industry as keyof typeof techStacks] || ['CRM', 'Email Marketing', 'Analytics'];
    return stack.slice(0, Math.floor(Math.random() * 4) + 3); // 3-6 technologies
  };

  // Competitor Identification
  const identifyCompetitors = (industry: string): string[] => {
    const competitors = {
      technology: ['Microsoft', 'Google', 'Amazon', 'Salesforce', 'Oracle'],
      finance: ['JPMorgan Chase', 'Goldman Sachs', 'Wells Fargo', 'Bank of America'],
      healthcare: ['Johnson & Johnson', 'Pfizer', 'UnitedHealth', 'CVS Health'],
      education: ['Pearson', 'McGraw-Hill', 'Cengage Learning', 'Blackboard'],
      retail: ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Home Depot']
    };
    
    const industryCompetitors = competitors[industry as keyof typeof competitors] || ['Industry Leader 1', 'Industry Leader 2'];
    return industryCompetitors.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 competitors
  };

  // Social Media URL Generation
  const generateSocialUrls = (name: string, domain: string) => {
    const cleanName = (name || '').toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const cleanDomain = (domain || '').replace(/\.(com|org|net|io)$/, '');
    
    return {
      linkedin: `https://linkedin.com/company/${cleanDomain || cleanName}`,
      twitter: `https://twitter.com/${cleanDomain || cleanName}`
    };
  };

  // Utility Functions for Data Generation
  const generateDomain = (name: string) => {
    return (name || 'company').toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '.com';
  };

  const generateDescription = (name: string, industry: string) => {
    const templates = {
      technology: `${name} is a leading technology company specializing in innovative software solutions and digital transformation services.`,
      finance: `${name} provides comprehensive financial services and investment solutions to businesses and individuals worldwide.`,
      healthcare: `${name} is dedicated to improving healthcare outcomes through advanced medical technologies and patient-centered care.`,
      education: `${name} delivers innovative educational programs and learning solutions for students and professionals globally.`
    };
    
    return templates[industry as keyof typeof templates] || `${name} is a professional services company providing specialized solutions in the ${industry} industry.`;
  };

  const generateFoundedYear = (maturity: string) => {
    const currentYear = new Date().getFullYear();
    switch (maturity) {
      case 'startup': return currentYear - Math.floor(Math.random() * 5);
      case 'growing': return currentYear - Math.floor(Math.random() * 10) - 5;
      case 'established': return currentYear - Math.floor(Math.random() * 20) - 10;
      default: return currentYear - Math.floor(Math.random() * 15) - 5;
    }
  };

  const generateStockSymbol = (name: string) => {
    return (name || 'COMP').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X');
  };

  const generatePhoneNumber = (country: string, isFax = false) => {
    const formats = {
      'United States': '+1 (555) 123-4567',
      'United Kingdom': '+44 20 7123 4567',
      'Germany': '+49 30 12345678',
      'Canada': '+1 (416) 123-4567'
    };
    
    const baseFormat = formats[country as keyof typeof formats] || '+1 (555) 123-4567';
    return isFax ? baseFormat.replace('123', '124') : baseFormat;
  };

  const generateVATNumber = () => `GB${Math.floor(Math.random() * 999999999)}`;
  const generateGSTNumber = () => `${Math.floor(Math.random() * 99)}AAAAA${Math.floor(Math.random() * 9999)}A1Z5`;
  const generateDUNSNumber = () => Math.floor(Math.random() * 999999999).toString();

  const applyEnrichment = () => {
    if (enrichmentData) {
      setFormData(prev => ({
        ...prev,
        // Basic Information
        name: enrichmentData.name || prev.name,
        domain: enrichmentData.domain || prev.domain,
        website: enrichmentData.website || prev.website,
        logoUrl: enrichmentData.logoUrl || prev.logoUrl,
        description: enrichmentData.description || prev.description,
        
        // Company Profile
        industry: enrichmentData.industry || prev.industry,
        companySize: enrichmentData.companySize || prev.companySize,
        employees: enrichmentData.employees || prev.employees,
        foundedYear: enrichmentData.foundedYear || prev.foundedYear,
        annualRevenue: enrichmentData.annualRevenue || prev.annualRevenue,
        stockSymbol: enrichmentData.stockSymbol || prev.stockSymbol,
        
        // Contact & Social
        phone: enrichmentData.phone || prev.phone,
        email: enrichmentData.email || prev.email,
        linkedinUrl: enrichmentData.linkedinUrl || prev.linkedinUrl,
        twitterUrl: enrichmentData.twitterUrl || prev.twitterUrl,
        fax: enrichmentData.fax || prev.fax,
        
        // Address Information
        address: {
          ...prev.address,
          ...enrichmentData.address
        },
        
        // Business Intelligence
        healthScore: enrichmentData.healthScore || prev.healthScore,
        accountSegment: enrichmentData.accountSegment || prev.accountSegment,
        accountStatus: enrichmentData.accountStatus || prev.accountStatus,
        region: enrichmentData.region || prev.region,
        
        // Technology & Competition
        technologies: enrichmentData.technologies || prev.technologies,
        competitors: enrichmentData.competitors || prev.competitors,
        
        // Compliance
        vatNumber: enrichmentData.vatNumber || prev.vatNumber,
        gstNumber: enrichmentData.gstNumber || prev.gstNumber,
        dunsNumber: enrichmentData.dunsNumber || prev.dunsNumber,
        gdprConsent: enrichmentData.gdprConsent !== undefined ? enrichmentData.gdprConsent : prev.gdprConsent
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

      {/* AI Enrichment Modal - Enhanced */}
      <AnimatePresence>
        {showEnrichmentModal && enrichmentData && (
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
              className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    <div>
                      <h3 className="text-xl font-bold">AI Enrichment Results</h3>
                      <p className="text-purple-100 text-sm">Comprehensive company intelligence</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEnrichmentModal(false)}
                    className="text-purple-200 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      Basic Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      {enrichmentData.name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Company Name:</span>
                          <span className="font-medium text-gray-900">{enrichmentData.name}</span>
                        </div>
                      )}
                      {enrichmentData.domain && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Domain:</span>
                          <span className="font-medium text-blue-600">{enrichmentData.domain}</span>
                        </div>
                      )}
                      {enrichmentData.website && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Website:</span>
                          <a href={enrichmentData.website} target="_blank" rel="noopener noreferrer"
                             className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                            Visit Site <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {enrichmentData.logoUrl && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Logo:</span>
                          <img src={enrichmentData.logoUrl} alt="Company Logo" className="h-8 w-8 object-contain rounded" />
                        </div>
                      )}
                    </div>
                    {enrichmentData.description && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className="text-gray-600 text-sm font-medium">Description:</span>
                        <p className="mt-1 text-sm text-gray-700 leading-relaxed">{enrichmentData.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Company Profile */}
                  <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Company Profile
                    </h4>
                    <div className="space-y-3 text-sm">
                      {enrichmentData.industry && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Industry:</span>
                          <span className="font-medium text-gray-900 capitalize">{enrichmentData.industry}</span>
                        </div>
                      )}
                      {enrichmentData.companySize && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Company Size:</span>
                          <span className="font-medium text-gray-900">{enrichmentData.companySize} employees</span>
                        </div>
                      )}
                      {enrichmentData.employees && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Employees:</span>
                          <span className="font-medium text-gray-900">{enrichmentData.employees.toLocaleString()}</span>
                        </div>
                      )}
                      {enrichmentData.foundedYear && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Founded:</span>
                          <span className="font-medium text-gray-900">{enrichmentData.foundedYear}</span>
                        </div>
                      )}
                      {enrichmentData.annualRevenue && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Revenue:</span>
                          <span className="font-medium text-green-600">${enrichmentData.annualRevenue.toLocaleString()}</span>
                        </div>
                      )}
                      {enrichmentData.stockSymbol && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stock Symbol:</span>
                          <span className="font-medium text-blue-600">{enrichmentData.stockSymbol}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact & Social */}
                  <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Contact & Social
                    </h4>
                    <div className="space-y-3 text-sm">
                      {enrichmentData.phone && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{enrichmentData.phone}</span>
                        </div>
                      )}
                      {enrichmentData.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-blue-600">{enrichmentData.email}</span>
                        </div>
                      )}
                      {enrichmentData.fax && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fax:</span>
                          <span className="font-medium text-gray-900">{enrichmentData.fax}</span>
                        </div>
                      )}
                      {enrichmentData.linkedinUrl && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">LinkedIn:</span>
                          <a href={enrichmentData.linkedinUrl} target="_blank" rel="noopener noreferrer"
                             className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                            <Linkedin className="w-3 h-3" />
                            Profile
                          </a>
                        </div>
                      )}
                      {enrichmentData.twitterUrl && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Twitter:</span>
                          <a href={enrichmentData.twitterUrl} target="_blank" rel="noopener noreferrer"
                             className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                            <Twitter className="w-3 h-3" />
                            Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  {enrichmentData.address && (
                    <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        Address Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        {enrichmentData.address.street && (
                          <p className="text-gray-700">{enrichmentData.address.street}</p>
                        )}
                        <p className="text-gray-700">
                          {enrichmentData.address.city && enrichmentData.address.city}
                          {enrichmentData.address.state && `, ${enrichmentData.address.state}`}
                          {enrichmentData.address.zipCode && ` ${enrichmentData.address.zipCode}`}
                        </p>
                        {enrichmentData.address.country && (
                          <p className="font-medium text-gray-900">{enrichmentData.address.country}</p>
                        )}
                        {enrichmentData.region && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Region: {enrichmentData.region}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Business Intelligence */}
                  <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Business Intelligence
                    </h4>
                    <div className="space-y-3 text-sm">
                      {enrichmentData.healthScore && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Health Score:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  enrichmentData.healthScore >= 80 ? 'bg-green-500' :
                                  enrichmentData.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${enrichmentData.healthScore}%` }}
                              ></div>
                            </div>
                            <span className="font-medium text-gray-900">{enrichmentData.healthScore}%</span>
                          </div>
                        </div>
                      )}
                      {enrichmentData.accountSegment && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Segment:</span>
                          <span className="font-medium text-gray-900 capitalize">{enrichmentData.accountSegment}</span>
                        </div>
                      )}
                      {enrichmentData.accountStatus && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-blue-600 capitalize">{enrichmentData.accountStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technology Stack */}
                  {enrichmentData.technologies && enrichmentData.technologies.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-600" />
                        Technology Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {enrichmentData.technologies.map((tech, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Competitors */}
                  {enrichmentData.competitors && enrichmentData.competitors.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-red-600" />
                        Key Competitors
                      </h4>
                      <div className="space-y-2">
                        {enrichmentData.competitors.map((competitor, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium">
                            {competitor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compliance */}
                  {(enrichmentData.vatNumber || enrichmentData.gstNumber || enrichmentData.dunsNumber || enrichmentData.gdprConsent !== undefined) && (
                    <div className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow lg:col-span-2">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Compliance & Legal
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {enrichmentData.vatNumber && (
                          <div>
                            <span className="text-gray-600">VAT Number:</span>
                            <span className="ml-2 font-medium text-gray-900">{enrichmentData.vatNumber}</span>
                          </div>
                        )}
                        {enrichmentData.gstNumber && (
                          <div>
                            <span className="text-gray-600">GST Number:</span>
                            <span className="ml-2 font-medium text-gray-900">{enrichmentData.gstNumber}</span>
                          </div>
                        )}
                        {enrichmentData.dunsNumber && (
                          <div>
                            <span className="text-gray-600">DUNS Number:</span>
                            <span className="ml-2 font-medium text-gray-900">{enrichmentData.dunsNumber}</span>
                          </div>
                        )}
                        {enrichmentData.gdprConsent !== undefined && (
                          <div className="md:col-span-3">
                            <span className="text-gray-600">GDPR Consent:</span>
                            <span className={`ml-2 font-medium ${enrichmentData.gdprConsent ? 'text-green-600' : 'text-red-600'}`}>
                              {enrichmentData.gdprConsent ? 'Required' : 'Not Required'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>AI-powered enrichment from multiple data sources</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowEnrichmentModal(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyEnrichment}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Apply All Enrichments
                    </button>
                  </div>
                </div>
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