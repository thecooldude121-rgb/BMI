import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Phone, Building, MapPin, Tag, Calendar, 
  DollarSign, Star, Upload, X, Plus, ChevronRight, 
  ChevronLeft, Save, AlertCircle, Check, UserCheck,
  FileText, Paperclip, Camera
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';

interface NewLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  leadData?: any;
  mode?: 'create' | 'edit';
}

interface FormData {
  // Basic Details
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  workPhone: string;
  
  // Company & Role
  company: string;
  title: string;
  industry: string;
  
  // Lead Qualification
  source: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  estimatedValue: number;
  nextFollowUp: string;
  
  // Additional Info
  notes: string;
  tags: string[];
  customFields: Record<string, any>;
  
  // Files
  attachments: File[];
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  mobilePhone: '',
  workPhone: '',
  company: '',
  title: '',
  industry: '',
  source: '',
  status: 'new',
  priority: 'medium',
  assignedTo: '',
  estimatedValue: 0,
  nextFollowUp: '',
  notes: '',
  tags: [],
  customFields: {},
  attachments: []
};

const NewLeadForm: React.FC<NewLeadFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  leadData,
  mode = 'create'
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(leadData || initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomField, setShowCustomField] = useState(false);
  const [newCustomField, setNewCustomField] = useState({ name: '', value: '' });

  // Auto-save functionality
  useEffect(() => {
    if (mode === 'create' && Object.values(formData).some(v => 
      typeof v === 'string' ? v.trim() !== '' : 
      Array.isArray(v) ? v.length > 0 : 
      typeof v === 'number' ? v > 0 : false
    )) {
      const timer = setTimeout(() => {
        setIsDraft(true);
        // Auto-save to localStorage
        localStorage.setItem('newLeadDraft', JSON.stringify(formData));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [formData, mode]);

  // Load draft on mount
  useEffect(() => {
    if (mode === 'create' && !leadData) {
      const draft = localStorage.getItem('newLeadDraft');
      if (draft) {
        setFormData(JSON.parse(draft));
        setIsDraft(true);
      }
    }
  }, [mode, leadData]);

  // Fetch users for assignment
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('/api/users')
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (mode === 'edit' && leadData?.id) {
        return apiRequest(`/api/leads/${leadData.id}`, { 
          method: 'PATCH', 
          body: data 
        });
      }
      return apiRequest('/api/leads', { 
        method: 'POST', 
        body: data 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      localStorage.removeItem('newLeadDraft');
      setIsDraft(false);
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      console.error('Error saving lead:', error);
    }
  });

  const steps = [
    { 
      id: 1, 
      title: 'Basic Details', 
      description: 'Contact information and identity',
      fields: ['firstName', 'lastName', 'email', 'mobilePhone', 'workPhone']
    },
    { 
      id: 2, 
      title: 'Company & Role', 
      description: 'Professional information',
      fields: ['company', 'title', 'industry']
    },
    { 
      id: 3, 
      title: 'Lead Qualification', 
      description: 'Sales and opportunity details',
      fields: ['source', 'status', 'priority', 'assignedTo', 'estimatedValue', 'nextFollowUp']
    },
    { 
      id: 4, 
      title: 'Additional Details', 
      description: 'Notes, tags, and attachments',
      fields: ['notes', 'tags', 'attachments']
    }
  ];

  const leadSources = [
    'Website', 'Social Media', 'Email Campaign', 'Referral', 
    'Cold Call', 'Trade Show', 'Advertisement', 'Partner'
  ];

  const leadStatuses = [
    'new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Real Estate', 'Energy', 'Transportation', 'Entertainment',
    'Consulting', 'Media', 'Government', 'Non-Profit', 'Other'
  ];

  const validateStep = (step: number): boolean => {
    const stepFields = steps[step - 1].fields;
    const stepErrors: Record<string, string> = {};

    stepFields.forEach(field => {
      if (field === 'firstName' && !formData.firstName.trim()) {
        stepErrors.firstName = 'First name is required';
      }
      if (field === 'lastName' && !formData.lastName.trim()) {
        stepErrors.lastName = 'Last name is required';
      }
      if (field === 'email') {
        if (!formData.email.trim()) {
          stepErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          stepErrors.email = 'Please enter a valid email address';
        }
      }
      if (field === 'mobilePhone' && formData.mobilePhone && 
          !/^[\+]?[1-9][\d]{0,15}$/.test(formData.mobilePhone.replace(/\s/g, ''))) {
        stepErrors.mobilePhone = 'Please enter a valid phone number';
      }
      if (field === 'company' && !formData.company.trim()) {
        stepErrors.company = 'Company name is required';
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    let allValid = true;
    for (let i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        if (currentStep > i) {
          setCurrentStep(i);
        }
        break;
      }
    }

    if (allValid) {
      setIsSubmitting(true);
      const submitData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.mobilePhone || formData.workPhone,
        company: formData.company,
        title: formData.title,
        industry: formData.industry,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        estimatedValue: formData.estimatedValue,
        nextFollowUp: formData.nextFollowUp,
        notes: formData.notes,
        tags: formData.tags,
        customFields: formData.customFields
      };

      saveMutation.mutate(submitData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      handleInputChange('tags', [...formData.tags, tag.trim()]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      handleInputChange('attachments', [...formData.attachments, ...newFiles]);
    }
  };

  const addCustomField = () => {
    if (newCustomField.name.trim() && newCustomField.value.trim()) {
      handleInputChange('customFields', {
        ...formData.customFields,
        [newCustomField.name]: newCustomField.value
      });
      setNewCustomField({ name: '', value: '' });
      setShowCustomField(false);
    }
  };

  const removeCustomField = (fieldName: string) => {
    const updatedFields = { ...formData.customFields };
    delete updatedFields[fieldName];
    handleInputChange('customFields', updatedFields);
  };

  const clearDraft = () => {
    localStorage.removeItem('newLeadDraft');
    setFormData(initialFormData);
    setIsDraft(false);
    setCurrentStep(1);
    setErrors({});
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === 'edit' ? 'Edit Lead' : 'Create New Lead'}
              </h2>
              <p className="text-blue-100 mt-1">
                Step {currentStep} of {steps.length}: {currentStepData.title}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {isDraft && (
                <div className="flex items-center text-yellow-200 text-sm">
                  <Save className="h-4 w-4 mr-1" />
                  Draft saved
                </div>
              )}
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
                data-testid="button-close-form"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-blue-500 bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6" data-testid="step-basic-details">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-gray-600">Let's start with the basic contact details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter first name"
                      data-testid="input-first-name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter last name"
                      data-testid="input-last-name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                        data-testid="input-email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.mobilePhone}
                        onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.mobilePhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 123-4567"
                        data-testid="input-mobile-phone"
                      />
                    </div>
                    {errors.mobilePhone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.mobilePhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.workPhone}
                        onChange={(e) => handleInputChange('workPhone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+1 (555) 987-6543"
                        data-testid="input-work-phone"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company & Role */}
            {currentStep === 2 && (
              <div className="space-y-6" data-testid="step-company-role">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  <p className="text-gray-600">Tell us about their role and company</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.company ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter company name"
                        data-testid="input-company"
                      />
                    </div>
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="e.g., Marketing Director"
                        data-testid="input-title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        data-testid="select-industry"
                      >
                        <option value="">Select industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Lead Qualification */}
            {currentStep === 3 && (
              <div className="space-y-6" data-testid="step-qualification">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Lead Qualification</h3>
                  <p className="text-gray-600">Set priority, value, and assignment details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      data-testid="select-source"
                    >
                      <option value="">Select source</option>
                      {leadSources.map(source => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      data-testid="select-status"
                    >
                      {leadStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <div className="flex space-x-3">
                      {(['low', 'medium', 'high'] as const).map(priority => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => handleInputChange('priority', priority)}
                          className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                            formData.priority === priority
                              ? priority === 'high' ? 'bg-red-50 border-red-500 text-red-700' :
                                priority === 'medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                                'bg-green-50 border-green-500 text-green-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          data-testid={`button-priority-${priority}`}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      data-testid="select-assigned-to"
                    >
                      <option value="">Unassigned</option>
                      {users.map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Value ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.estimatedValue}
                        onChange={(e) => handleInputChange('estimatedValue', Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="0"
                        min="0"
                        data-testid="input-estimated-value"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Follow-up Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.nextFollowUp}
                        onChange={(e) => handleInputChange('nextFollowUp', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        data-testid="input-follow-up-date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
              <div className="space-y-6" data-testid="step-additional">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <p className="text-gray-600">Notes, tags, and file attachments</p>
                </div>

                <div className="space-y-6">
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Add any relevant notes about this lead..."
                      data-testid="textarea-notes"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="space-y-3">
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleTagRemove(tag)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                                data-testid={`button-remove-tag-${index}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Add a tag and press Enter"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTagAdd(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        data-testid="input-add-tag"
                      />
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Custom Fields
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCustomField(!showCustomField)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        data-testid="button-add-custom-field"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Custom Field
                      </button>
                    </div>

                    {Object.entries(formData.customFields).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={key}
                          disabled
                          className="flex-1 px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-600"
                        />
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => handleInputChange('customFields', {
                            ...formData.customFields,
                            [key]: e.target.value
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomField(key)}
                          className="text-red-600 hover:text-red-800"
                          data-testid={`button-remove-custom-field-${key}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {showCustomField && (
                      <div className="flex items-center space-x-2 mt-2">
                        <input
                          type="text"
                          placeholder="Field name"
                          value={newCustomField.name}
                          onChange={(e) => setNewCustomField({...newCustomField, name: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          data-testid="input-custom-field-name"
                        />
                        <input
                          type="text"
                          placeholder="Field value"
                          value={newCustomField.value}
                          onChange={(e) => setNewCustomField({...newCustomField, value: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          data-testid="input-custom-field-value"
                        />
                        <button
                          type="button"
                          onClick={addCustomField}
                          className="text-green-600 hover:text-green-800"
                          data-testid="button-save-custom-field"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomField(false);
                            setNewCustomField({ name: '', value: '' });
                          }}
                          className="text-red-600 hover:text-red-800"
                          data-testid="button-cancel-custom-field"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        data-testid="input-file-upload"
                      />
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">
                        Drag and drop files here, or{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-800 underline"
                          data-testid="button-browse-files"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supports: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (max 10MB each)
                      </p>
                    </div>

                    {formData.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedFiles = formData.attachments.filter((_, i) => i !== index);
                                handleInputChange('attachments', updatedFiles);
                              }}
                              className="text-red-600 hover:text-red-800"
                              data-testid={`button-remove-attachment-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="flex items-center space-x-4">
            {isDraft && (
              <button
                type="button"
                onClick={clearDraft}
                className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
                data-testid="button-clear-draft"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Draft
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
                data-testid="button-previous"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                data-testid="button-next"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || saveMutation.isPending}
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-submit"
              >
                {isSubmitting || saveMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {mode === 'edit' ? 'Update Lead' : 'Create Lead'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLeadForm;