import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, X, Plus, User, Building, Target, Tag, 
  Mail, Phone, Globe, Calendar, DollarSign, Users, Clock,
  CheckCircle, AlertCircle, Sparkles, Bot, Lightbulb, Shield,
  ChevronRight, ChevronDown, Info, Star, Zap, Settings
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface LeadFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
  
  // Company Information
  company: string;
  jobTitle: string;
  department: string;
  industry: string;
  companySize: string;
  companyWebsite: string;
  companyPhone: string;
  
  // Lead Qualification
  leadSource: string;
  estimatedValue: number;
  currency: string;
  purchaseTimeframe: string;
  budgetStatus: string;
  decisionMakerLevel: string;
  
  // Classification
  priority: 'low' | 'medium' | 'high' | 'urgent';
  temperature: 'hot' | 'warm' | 'cold';
  status: 'active' | 'inactive' | 'nurturing';
  assignedTo: string;
  
  // Additional Information
  notes: string;
  tags: string[];
  communicationPreference: string;
  timezone: string;
  gdprConsent: boolean;
  marketingOptIn: boolean;
  
  // Custom Fields
  customFields: Record<string, any>;
}

interface ValidationErrors {
  [key: string]: string;
}

type WizardStep = 'basic' | 'company' | 'qualification' | 'classification' | 'additional';

const AddLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addLead, leads } = useData();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic');
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    company: '',
    jobTitle: '',
    department: '',
    industry: '',
    companySize: '',
    companyWebsite: '',
    companyPhone: '',
    leadSource: '',
    estimatedValue: 0,
    currency: 'USD',
    purchaseTimeframe: '',
    budgetStatus: '',
    decisionMakerLevel: '',
    priority: 'medium',
    temperature: 'warm',
    status: 'active',
    assignedTo: '',
    notes: '',
    tags: [],
    communicationPreference: 'email',
    timezone: '',
    gdprConsent: false,
    marketingOptIn: false,
    customFields: {}
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateLeads, setDuplicateLeads] = useState<any[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const steps = [
    { id: 'basic', title: 'Basic Information', icon: User, required: true },
    { id: 'company', title: 'Company Details', icon: Building, required: true },
    { id: 'qualification', title: 'Lead Qualification', icon: Target, required: false },
    { id: 'classification', title: 'Classification', icon: Tag, required: false },
    { id: 'additional', title: 'Additional Info', icon: Settings, required: false }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

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

  // Check for duplicates when email changes
  useEffect(() => {
    if (formData.email) {
      const duplicates = leads.filter(lead => 
        lead.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (duplicates.length > 0) {
        setDuplicateLeads(duplicates);
        setShowDuplicateWarning(true);
      } else {
        setShowDuplicateWarning(false);
        setDuplicateLeads([]);
      }
    }
  }, [formData.email, leads]);

  const validateStep = (step: WizardStep): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 'basic':
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'company':
        if (!formData.company) newErrors.company = 'Company name is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
      setCurrentStep(steps[nextIndex].id as WizardStep);
    }
  };

  const prevStep = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex].id as WizardStep);
  };

  const handleSubmit = async () => {
    // Validate all required steps
    const requiredSteps = steps.filter(step => step.required).map(step => step.id as WizardStep);
    const isValid = requiredSteps.every(step => validateStep(step));

    if (!isValid) {
      setErrors({ submit: 'Please complete all required fields' });
      return;
    }

    if (showDuplicateWarning) {
      setErrors({ submit: 'Please resolve duplicate lead warning before saving' });
      return;
    }

    setIsLoading(true);
    try {
      // Convert form data to lead format
      const leadData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.jobTitle,
        industry: formData.industry,
        stage: 'new' as const,
        score: 50,
        value: formData.estimatedValue,
        probability: 25,
        source: formData.leadSource,
        assignedTo: formData.assignedTo || '1',
        status: formData.status,
        notes: formData.notes,
        tags: formData.tags,
        customFields: formData.customFields
      };

      addLead(leadData);
      localStorage.removeItem('leadDraft');
      navigate('/crm/leads');
    } catch (error) {
      setErrors({ submit: 'Failed to create lead. Please try again.' });
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

  const getAISuggestions = () => {
    const suggestions = [];
    
    if (formData.industry === 'Technology' && !formData.estimatedValue) {
      suggestions.push('Tech companies typically have deal values between $25K-$150K');
    }
    
    if (formData.jobTitle.toLowerCase().includes('cto') && formData.estimatedValue < 50000) {
      suggestions.push('CTOs usually have higher budget authority - consider increasing estimated value');
    }
    
    if (formData.leadSource === 'LinkedIn' && !formData.tags.includes('social-selling')) {
      suggestions.push('Consider adding "social-selling" tag for LinkedIn leads');
    }
    
    return suggestions;
  };

  const renderStepContent = () => {
    const CurrentStepIcon = steps[currentStepIndex].icon;
    
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CurrentStepIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                <p className="text-gray-600">Essential contact details for the lead</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className={`w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
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
                  className={`w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="john.doe@company.com"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                
                {/* Duplicate Warning */}
                {showDuplicateWarning && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        Potential duplicate found
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      {duplicateLeads.length} existing lead(s) with this email
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrentStepIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Company Details</h2>
                <p className="text-gray-600">Information about the lead's organization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className={`w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.company ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Acme Corporation"
                />
                {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Chief Technology Officer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select department</option>
                  <option value="Executive">Executive</option>
                  <option value="Technology">Technology</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">Human Resources</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className={`w-full px-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.industry ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Consulting">Consulting</option>
                </select>
                {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyWebsite: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </div>
        );

      case 'qualification':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CurrentStepIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lead Qualification</h2>
                <p className="text-gray-600">Assess the lead's potential and buying intent</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Source
                </label>
                <select
                  value={formData.leadSource}
                  onChange={(e) => setFormData(prev => ({ ...prev, leadSource: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Email">Cold Email</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Deal Value
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: Number(e.target.value) }))}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25000"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Timeframe
                </label>
                <select
                  value={formData.purchaseTimeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseTimeframe: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeframe</option>
                  <option value="Immediate">Immediate (0-30 days)</option>
                  <option value="Short-term">Short-term (1-3 months)</option>
                  <option value="Medium-term">Medium-term (3-6 months)</option>
                  <option value="Long-term">Long-term (6+ months)</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Status
                </label>
                <select
                  value={formData.budgetStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetStatus: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select budget status</option>
                  <option value="Budget Approved">Budget Approved</option>
                  <option value="Budget Identified">Budget Identified</option>
                  <option value="Budget Pending">Budget Pending</option>
                  <option value="No Budget">No Budget</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision Maker Level
                </label>
                <select
                  value={formData.decisionMakerLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, decisionMakerLevel: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level</option>
                  <option value="Primary Decision Maker">Primary Decision Maker</option>
                  <option value="Influencer">Influencer</option>
                  <option value="Evaluator">Evaluator</option>
                  <option value="End User">End User</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'classification':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CurrentStepIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lead Classification</h2>
                <p className="text-gray-600">Categorize and assign the lead for proper handling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'low', label: 'Low', color: 'gray' },
                    { value: 'medium', label: 'Medium', color: 'blue' },
                    { value: 'high', label: 'High', color: 'orange' },
                    { value: 'urgent', label: 'Urgent', color: 'red' }
                  ].map((priority) => (
                    <button
                      key={priority.value}
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as any }))}
                      className={`p-3 border rounded-xl text-center transition-colors ${
                        formData.priority === priority.value
                          ? `border-${priority.color}-500 bg-${priority.color}-50 text-${priority.color}-700`
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium">{priority.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Temperature
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'hot', label: 'Hot', color: 'red', icon: '🔥' },
                    { value: 'warm', label: 'Warm', color: 'orange', icon: '🌡️' },
                    { value: 'cold', label: 'Cold', color: 'blue', icon: '❄️' }
                  ].map((temp) => (
                    <button
                      key={temp.value}
                      onClick={() => setFormData(prev => ({ ...prev, temperature: temp.value as any }))}
                      className={`p-3 border rounded-xl text-center transition-colors ${
                        formData.temperature === temp.value
                          ? `border-${temp.color}-500 bg-${temp.color}-50 text-${temp.color}-700`
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-lg mb-1">{temp.icon}</div>
                      <p className="font-medium text-sm">{temp.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="nurturing">Nurturing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Auto-assign</option>
                  <option value="user1">John Smith</option>
                  <option value="user2">Sarah Johnson</option>
                  <option value="user3">Mike Chen</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'additional':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CurrentStepIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Additional Information</h2>
                <p className="text-gray-600">Notes, tags, and preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Add any additional notes about this lead..."
                />
              </div>

              {/* Tags */}
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
                        ×
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Communication
                  </label>
                  <select
                    value={formData.communicationPreference}
                    onChange={(e) => setFormData(prev => ({ ...prev, communicationPreference: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select timezone</option>
                    <option value="PST">Pacific (PST)</option>
                    <option value="MST">Mountain (MST)</option>
                    <option value="CST">Central (CST)</option>
                    <option value="EST">Eastern (EST)</option>
                    <option value="GMT">GMT</option>
                    <option value="CET">Central European (CET)</option>
                  </select>
                </div>
              </div>

              {/* GDPR & Privacy */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Privacy & Consent
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.gdprConsent}
                      onChange={(e) => setFormData(prev => ({ ...prev, gdprConsent: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      GDPR Consent - Lead has consented to data processing
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
                      Marketing Opt-in - Lead agrees to receive marketing communications
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/crm/leads')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Sparkles className="h-8 w-8 mr-3 text-blue-600" />
                  Add New Lead
                </h1>
                <p className="text-gray-600">Capture and qualify your next opportunity</p>
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

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{currentStepIndex + 1} of {steps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between space-x-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              const isAccessible = index <= currentStepIndex;
              
              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && setCurrentStep(step.id as WizardStep)}
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
                  <StepIcon className="h-4 w-4 mr-2" />
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
              <div className="space-y-3">
                {getAISuggestions().map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                    <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5" />
                    <span className="text-sm text-purple-800">{suggestion}</span>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Help me complete this lead
                </button>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {renderStepContent()}
            
            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">{errors.submit}</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/crm/leads')}
                className="px-6 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {currentStepIndex === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Create Lead
                </button>
              ) : (
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
  );
};

export default AddLeadPage;