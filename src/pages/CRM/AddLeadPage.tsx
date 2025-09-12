import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, X, Plus, Check, AlertCircle, User, Building, 
  Mail, Phone, DollarSign, Target, Tag, FileText, Globe, Calendar,
  Sparkles, Bot, Lightbulb, Shield, Eye, EyeOff, ChevronRight,
  ChevronDown, Search, MapPin, Briefcase, TrendingUp, Clock,
  Users, Star, Zap, Info, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

// Enhanced Lead Interface for comprehensive data capture
interface EnhancedLeadFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  
  // Company Information
  company: string;
  website?: string;
  industry: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+' | 'unknown';
  annualRevenue?: number;
  
  // Professional Details
  jobTitle: string;
  department?: string;
  seniority: 'individual' | 'manager' | 'director' | 'vp' | 'c-level' | 'owner';
  
  // Lead Qualification
  leadSource: string;
  campaign?: string;
  referredBy?: string;
  estimatedValue: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  timeframe: 'immediate' | '1-3-months' | '3-6-months' | '6-12-months' | 'unknown';
  budget: 'no-budget' | 'budget-approved' | 'budget-pending' | 'unknown';
  
  // Classification
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'nurturing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  temperature: 'hot' | 'warm' | 'cold';
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  
  // Assignment & Ownership
  assignedTo: string;
  teamMembers: string[];
  
  // Location
  country: string;
  state?: string;
  city?: string;
  timezone?: string;
  
  // Notes & Communication
  notes: string;
  tags: string[];
  communicationPreference: 'email' | 'phone' | 'sms' | 'linkedin';
  
  // Compliance & Privacy
  gdprConsent: boolean;
  marketingOptIn: boolean;
  dataProcessingConsent: boolean;
  
  // Custom Fields (extensible)
  customFields: Record<string, any>;
  
  // Metadata
  leadScore?: number;
  lastContactDate?: string;
  nextFollowUpDate?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  fields: string[];
}

const AddLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addLead, employees, leads } = useData();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EnhancedLeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    companySize: 'unknown',
    jobTitle: '',
    seniority: 'individual',
    leadSource: '',
    estimatedValue: 0,
    currency: 'USD',
    timeframe: 'unknown',
    budget: 'unknown',
    status: 'new',
    priority: 'medium',
    temperature: 'warm',
    stage: 'new',
    assignedTo: '',
    teamMembers: [],
    country: 'US',
    notes: '',
    tags: [],
    communicationPreference: 'email',
    gdprConsent: false,
    marketingOptIn: false,
    dataProcessingConsent: false,
    customFields: {}
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Form steps with progressive disclosure
  const steps: FormStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Essential contact details',
      icon: User,
      required: true,
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      id: 'company',
      title: 'Company Details',
      description: 'Organization information',
      icon: Building,
      required: true,
      fields: ['company', 'industry', 'jobTitle', 'companySize']
    },
    {
      id: 'qualification',
      title: 'Lead Qualification',
      description: 'Sales qualification data',
      icon: Target,
      required: true,
      fields: ['leadSource', 'estimatedValue', 'timeframe', 'budget']
    },
    {
      id: 'classification',
      title: 'Classification',
      description: 'Priority and assignment',
      icon: Star,
      required: true,
      fields: ['priority', 'assignedTo', 'status']
    },
    {
      id: 'additional',
      title: 'Additional Info',
      description: 'Notes and compliance',
      icon: FileText,
      required: false,
      fields: ['notes', 'tags', 'gdprConsent']
    }
  ];

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.firstName || formData.lastName || formData.email) {
        localStorage.setItem('leadDraft', JSON.stringify(formData));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('leadDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draftData }));
      } catch (error) {
        localStorage.removeItem('leadDraft');
      }
    }
  }, []);

  // Check for duplicate leads
  useEffect(() => {
    if (formData.email) {
      const duplicate = leads.find(lead => 
        lead.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (duplicate) {
        setDuplicateWarning(`A lead with this email already exists: ${duplicate.name}`);
      } else {
        setDuplicateWarning('');
      }
    }
  }, [formData.email, leads]);

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    const newErrors: ValidationErrors = {};

    step.fields.forEach(field => {
      const value = formData[field as keyof EnhancedLeadFormData];
      
      if (step.required) {
        switch (field) {
          case 'firstName':
            if (!value) newErrors.firstName = 'First name is required';
            break;
          case 'lastName':
            if (!value) newErrors.lastName = 'Last name is required';
            break;
          case 'email':
            if (!value) {
              newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
              newErrors.email = 'Please enter a valid email address';
            }
            break;
          case 'phone':
            if (!value) newErrors.phone = 'Phone number is required';
            break;
          case 'company':
            if (!value) newErrors.company = 'Company name is required';
            break;
          case 'industry':
            if (!value) newErrors.industry = 'Industry is required';
            break;
          case 'jobTitle':
            if (!value) newErrors.jobTitle = 'Job title is required';
            break;
          case 'leadSource':
            if (!value) newErrors.leadSource = 'Lead source is required';
            break;
          case 'assignedTo':
            if (!value) newErrors.assignedTo = 'Lead owner is required';
            break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (saveAndNew = false) => {
    // Validate all required steps
    const isValid = steps.every((step, index) => validateStep(index));
    
    if (!isValid) {
      // Find first step with errors and navigate to it
      for (let i = 0; i < steps.length; i++) {
        if (!validateStep(i)) {
          setCurrentStep(i);
          break;
        }
      }
      return;
    }

    setIsLoading(true);
    try {
      // Convert to format expected by addLead
      const leadData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.jobTitle,
        industry: formData.industry,
        stage: formData.stage,
        score: formData.leadScore || 50,
        value: formData.estimatedValue,
        probability: 50, // Default probability
        source: formData.leadSource,
        assignedTo: formData.assignedTo,
        status: formData.status,
        notes: formData.notes,
        tags: formData.tags,
        customFields: formData.customFields
      };

      addLead(leadData);
      localStorage.removeItem('leadDraft');
      
      if (saveAndNew) {
        // Reset form for new lead
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          industry: '',
          companySize: 'unknown',
          jobTitle: '',
          seniority: 'individual',
          leadSource: '',
          estimatedValue: 0,
          currency: 'USD',
          timeframe: 'unknown',
          budget: 'unknown',
          status: 'new',
          priority: 'medium',
          temperature: 'warm',
          stage: 'new',
          assignedTo: formData.assignedTo, // Keep same owner
          teamMembers: [],
          country: 'US',
          notes: '',
          tags: [],
          communicationPreference: 'email',
          gdprConsent: false,
          marketingOptIn: false,
          dataProcessingConsent: false,
          customFields: {}
        });
        setCurrentStep(0);
      } else {
        navigate('/crm/leads');
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getCompletionPercentage = () => {
    const requiredFields = [
      formData.firstName, formData.lastName, formData.email, formData.phone,
      formData.company, formData.industry, formData.jobTitle, formData.leadSource,
      formData.assignedTo
    ];
    const completedFields = requiredFields.filter(Boolean).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Smith"
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.email ? 'border-red-300 bg-red-50' : 
                    duplicateWarning ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'
                  }`}
                  placeholder="john.smith@company.com"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              {duplicateWarning && (
                <div className="flex items-center mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">{duplicateWarning}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.company ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Acme Corporation"
                />
              </div>
              {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.industry ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
                {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.jobTitle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Chief Technology Officer"
                  />
                </div>
                {errors.jobTitle && <p className="text-sm text-red-600 mt-1">{errors.jobTitle}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seniority Level
                </label>
                <select
                  value={formData.seniority}
                  onChange={(e) => setFormData(prev => ({ ...prev, seniority: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="individual">Individual Contributor</option>
                  <option value="manager">Manager</option>
                  <option value="director">Director</option>
                  <option value="vp">Vice President</option>
                  <option value="c-level">C-Level Executive</option>
                  <option value="owner">Owner/Founder</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://company.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Revenue
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.annualRevenue || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, annualRevenue: Number(e.target.value) }))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000000"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'qualification':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source *
                </label>
                <select
                  value={formData.leadSource}
                  onChange={(e) => setFormData(prev => ({ ...prev, leadSource: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.leadSource ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Email">Cold Email</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Content Marketing">Content Marketing</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Partner">Partner</option>
                </select>
                {errors.leadSource && <p className="text-sm text-red-600 mt-1">{errors.leadSource}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign
                </label>
                <input
                  type="text"
                  value={formData.campaign || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaign: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Q1 2024 Enterprise Campaign"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Deal Value
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: Number(e.target.value) }))}
                    className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                    min="0"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as any }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 border-0 bg-transparent focus:outline-none text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Timeframe
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="immediate">Immediate (0-30 days)</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="6-12-months">6-12 months</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'budget-approved', label: 'Budget Approved', color: 'green' },
                  { value: 'budget-pending', label: 'Budget Pending', color: 'yellow' },
                  { value: 'no-budget', label: 'No Budget', color: 'red' },
                  { value: 'unknown', label: 'Unknown', color: 'gray' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, budget: option.value as any }))}
                    className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                      formData.budget === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'classification':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'urgent', label: 'Urgent', color: 'red', icon: AlertCircle },
                    { value: 'high', label: 'High', color: 'orange', icon: TrendingUp },
                    { value: 'medium', label: 'Medium', color: 'blue', icon: Target },
                    { value: 'low', label: 'Low', color: 'gray', icon: Clock }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setFormData(prev => ({ ...prev, priority: option.value as any }))}
                        className={`w-full flex items-center p-3 border rounded-xl text-sm font-medium transition-all ${
                          formData.priority === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'hot', label: 'Hot Lead', color: 'red', desc: 'Ready to buy' },
                    { value: 'warm', label: 'Warm Lead', color: 'orange', desc: 'Interested' },
                    { value: 'cold', label: 'Cold Lead', color: 'blue', desc: 'Early stage' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, temperature: option.value as any }))}
                      className={`w-full text-left p-3 border rounded-xl text-sm transition-all ${
                        formData.temperature === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Owner *
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.assignedTo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Owner</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
                {errors.assignedTo && <p className="text-sm text-red-600 mt-1">{errors.assignedTo}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { value: 'new', label: 'New', color: 'gray' },
                  { value: 'contacted', label: 'Contacted', color: 'blue' },
                  { value: 'qualified', label: 'Qualified', color: 'green' },
                  { value: 'unqualified', label: 'Unqualified', color: 'red' },
                  { value: 'nurturing', label: 'Nurturing', color: 'purple' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, status: option.value as any }))}
                    className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                      formData.status === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'additional':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes & Comments
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add any relevant notes about this lead, their requirements, or conversation history..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add tag..."
                />
                <button
                  onClick={addTag}
                  className="px-4 py-3 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Preference
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'email', label: 'Email', icon: Mail },
                  { value: 'phone', label: 'Phone', icon: Phone },
                  { value: 'sms', label: 'SMS', icon: Phone },
                  { value: 'linkedin', label: 'LinkedIn', icon: Users }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, communicationPreference: option.value as any }))}
                      className={`flex items-center justify-center p-3 border rounded-xl text-sm font-medium transition-all ${
                        formData.communicationPreference === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GDPR & Compliance */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Privacy & Compliance
              </h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.gdprConsent}
                    onChange={(e) => setFormData(prev => ({ ...prev, gdprConsent: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    GDPR Consent - I consent to processing of my personal data
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.marketingOptIn}
                    onChange={(e) => setFormData(prev => ({ ...prev, marketingOptIn: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Marketing Opt-in - I agree to receive marketing communications
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dataProcessingConsent}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataProcessingConsent: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Data Processing Consent - I consent to data processing for CRM purposes
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/crm/leads')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
                  <p className="text-gray-600">Capture and qualify your next opportunity</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isDraftSaved && (
                <div className="flex items-center space-x-2 text-green-600 animate-fade-in">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Draft saved</span>
                </div>
              )}
              
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Form Progress</span>
              <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Step Navigation */}
            <div className="flex items-center justify-between space-x-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isAccessible = index <= currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && setCurrentStep(index)}
                    disabled={!isAccessible}
                    className={`flex-1 flex items-center justify-center p-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : isAccessible
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">{step.title}</span>
                    <span className="md:hidden">{step.title.split(' ')[0]}</span>
                    {step.required && !isCompleted && !isActive && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* AI Assistant Panel */}
          {showAIAssistant && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8 animate-slide-down">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Lead Assistant
                </h3>
                <button onClick={() => setShowAIAssistant(false)} className="text-purple-600 hover:text-purple-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <Lightbulb className="h-5 w-5 text-purple-600 mb-2" />
                  <h4 className="font-medium text-purple-900 mb-1">Smart Suggestions</h4>
                  <p className="text-sm text-purple-700">Get AI-powered field suggestions based on company domain</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <Sparkles className="h-5 w-5 text-purple-600 mb-2" />
                  <h4 className="font-medium text-purple-900 mb-1">Lead Scoring</h4>
                  <p className="text-sm text-purple-700">Automatic lead scoring based on qualification criteria</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <Target className="h-5 w-5 text-purple-600 mb-2" />
                  <h4 className="font-medium text-purple-900 mb-1">Duplicate Detection</h4>
                  <p className="text-sm text-purple-700">Real-time duplicate lead detection and merging</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <steps[currentStep].icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{steps[currentStep].title}</h2>
                    <p className="text-gray-600">{steps[currentStep].description}</p>
                  </div>
                </div>
                
                {/* Completion Progress */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Form Completion</span>
                    <span className="text-sm text-gray-600">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Step Content */}
              {renderStepContent()}
            </div>

            {/* Navigation Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Lead
                  </button>
                  
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Save & Add New
                  </button>
                  
                  {currentStep < steps.length - 1 && (
                    <button
                      onClick={nextStep}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeadPage;

/*
INTEGRATION POINTS FOR FUTURE DEVELOPMENT:

1. API Integration:
   - POST /api/leads - Create new lead
   - GET /api/leads/check-duplicate - Check for duplicates
   - GET /api/companies/autocomplete - Company name suggestions
   - POST /api/leads/enrich - Data enrichment from external sources

2. Lead Generation Module Integration:
   - Import leads from lead gen campaigns
   - Sync with external lead sources (LinkedIn, ZoomInfo, etc.)
   - Automatic lead scoring based on ICP matching
   - Lead routing based on territory/assignment rules

3. AI/ML Integration:
   - Real-time lead scoring
   - Industry/company size prediction
   - Lead quality assessment
   - Duplicate detection and merging suggestions

4. External Integrations:
   - Email validation services
   - Company data enrichment (Clearbit, ZoomInfo)
   - Social media profile matching
   - Geographic/timezone detection

5. Workflow Integration:
   - Automatic task creation for new leads
   - Lead assignment rules and round-robin
   - Notification triggers for high-value leads
   - Sequence enrollment based on lead characteristics

6. Custom Fields System:
   - Dynamic custom field rendering
   - Field validation and formatting
   - Integration-specific field mapping
   - Custom field analytics and reporting
*/