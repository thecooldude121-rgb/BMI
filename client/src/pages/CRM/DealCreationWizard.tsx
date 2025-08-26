import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building,
  User,
  DollarSign,
  Target,
  Calendar,
  FileText,
  Plus,
  Search,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// Removed unused imports

interface DealFormData {
  // Basic Information
  name: string;
  title: string;
  description: string;
  
  // Relationships
  accountId: string;
  contactId: string;
  
  // Financial
  value: string;
  dealType: string;
  probability: number;
  expectedCloseDate: string;
  
  // Process
  stage: string;
  dealSource: string;
  
  // Assignment
  assignedTo: string;
  teamMembers: string[];
  
  // Additional
  nextStep: string;
  notes: string;
  tags: string[];
}

const WIZARD_STEPS = [
  { id: 'basic', title: 'Basic Information', description: 'Deal name, title, and description' },
  { id: 'relationships', title: 'Relationships', description: 'Account and contact information' },
  { id: 'financial', title: 'Financial Details', description: 'Value, type, and probability' },
  { id: 'process', title: 'Sales Process', description: 'Stage, source, and timeline' },
  { id: 'team', title: 'Team & Assignment', description: 'Owner and team members' },
  { id: 'review', title: 'Review & Create', description: 'Review all information' }
];

const DEAL_TYPES = [
  'new_business', 'existing_business', 'renewal', 'expansion', 'upsell', 'cross_sell'
];

const DEAL_SOURCES = [
  'inbound', 'outbound', 'referral', 'marketing', 'partner', 'existing_customer'
];

const DEAL_STAGES = [
  'discovery', 'qualification', 'proposal', 'demo', 'trial', 'negotiation', 'closed-won', 'closed-lost'
];

export default function DealCreationWizard() {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DealFormData>({
    name: '',
    title: '',
    description: '',
    accountId: '',
    contactId: '',
    value: '',
    dealType: 'new_business',
    probability: 25,
    expectedCloseDate: '',
    stage: 'discovery',
    dealSource: 'inbound',
    assignedTo: '',
    teamMembers: [],
    nextStep: '',
    notes: '',
    tags: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Fetch accounts for selection
  const { data: accounts = [] } = useQuery({
    queryKey: ['/api/accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      return response.json();
    }
  });

  // Fetch contacts for selection
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
    mutationFn: async (dealData: DealFormData) => {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dealData,
          dealHealth: 'healthy',
          aiScore: 50,
          stageHistory: [],
          teamMembers: formData.teamMembers,
          followers: [],
          customFields: {},
          automationTriggers: []
        })
      });
      if (!response.ok) throw new Error('Failed to create deal');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      setLocation(`/crm/deals/${data.id}`);
    }
  });

  const updateFormData = (field: keyof DealFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) newErrors.name = 'Deal name is required';
        if (!formData.title.trim()) newErrors.title = 'Deal title is required';
        break;
      case 1: // Relationships
        if (!formData.accountId) newErrors.accountId = 'Account is required';
        break;
      case 2: // Financial
        if (!formData.value || parseFloat(formData.value) <= 0) {
          newErrors.value = 'Valid deal value is required';
        }
        break;
      case 3: // Process
        if (!formData.expectedCloseDate) newErrors.expectedCloseDate = 'Expected close date is required';
        break;
      case 4: // Team
        if (!formData.assignedTo) newErrors.assignedTo = 'Deal owner is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      createDealMutation.mutate(formData);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      updateFormData('tags', [...formData.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFormData('tags', formData.tags.filter(t => t !== tag));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Deal Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Enter deal name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Enter deal title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe this deal opportunity"
                rows={4}
              />
            </div>
          </div>
        );

      case 1: // Relationships
        return (
          <div className="space-y-6">
            <div>
              <Label>Account *</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.accountId}
                  onValueChange={(value) => updateFormData('accountId', value)}
                >
                  <SelectTrigger className={`flex-1 ${errors.accountId ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account: any) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowAccountDialog(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.accountId && <p className="text-red-500 text-sm mt-1">{errors.accountId}</p>}
            </div>

            <div>
              <Label>Primary Contact</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Select
                  value={formData.contactId}
                  onValueChange={(value) => updateFormData('contactId', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts
                      .filter((contact: any) => !formData.accountId || contact.accountId === formData.accountId)
                      .map((contact: any) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.firstName} {contact.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowContactDialog(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 2: // Financial
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="value">Deal Value *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => updateFormData('value', e.target.value)}
                  placeholder="0.00"
                  className={`pl-10 ${errors.value ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
            </div>

            <div>
              <Label>Deal Type</Label>
              <Select
                value={formData.dealType}
                onValueChange={(value) => updateFormData('dealType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Probability (%)</Label>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.probability}
                  onChange={(e) => updateFormData('probability', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0%</span>
                  <span className="font-medium">{formData.probability}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Process
        return (
          <div className="space-y-6">
            <div>
              <Label>Initial Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => updateFormData('stage', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STAGES.map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Deal Source</Label>
              <Select
                value={formData.dealSource}
                onValueChange={(value) => updateFormData('dealSource', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_SOURCES.map(source => (
                    <SelectItem key={source} value={source}>
                      {source.replace('_', ' ').charAt(0).toUpperCase() + source.replace('_', ' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expectedCloseDate">Expected Close Date *</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => updateFormData('expectedCloseDate', e.target.value)}
                className={errors.expectedCloseDate ? 'border-red-500' : ''}
              />
              {errors.expectedCloseDate && <p className="text-red-500 text-sm mt-1">{errors.expectedCloseDate}</p>}
            </div>

            <div>
              <Label htmlFor="nextStep">Next Step</Label>
              <Input
                id="nextStep"
                value={formData.nextStep}
                onChange={(e) => updateFormData('nextStep', e.target.value)}
                placeholder="What's the next action for this deal?"
              />
            </div>
          </div>
        );

      case 4: // Team
        return (
          <div className="space-y-6">
            <div>
              <Label>Deal Owner *</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => updateFormData('assignedTo', value)}
              >
                <SelectTrigger className={errors.assignedTo ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select deal owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-user">John Smith (Me)</SelectItem>
                  <SelectItem value="user-2">Sarah Johnson</SelectItem>
                  <SelectItem value="user-3">Mike Wilson</SelectItem>
                </SelectContent>
              </Select>
              {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
            </div>

            <div>
              <Label>Team Members</Label>
              <p className="text-sm text-gray-600 mb-2">Add team members who will collaborate on this deal</p>
              <div className="space-y-2">
                <Select onValueChange={(value) => {
                  if (!formData.teamMembers.includes(value)) {
                    updateFormData('teamMembers', [...formData.teamMembers, value]);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user-2">Sarah Johnson</SelectItem>
                    <SelectItem value="user-3">Mike Wilson</SelectItem>
                    <SelectItem value="user-4">Emma Davis</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.teamMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.teamMembers.map(memberId => (
                      <Badge key={memberId} variant="secondary" className="pr-1">
                        Team Member {memberId.split('-')[1]}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => updateFormData('teamMembers', formData.teamMembers.filter(id => id !== memberId))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                placeholder="Any additional notes about this deal"
                rows={3}
              />
            </div>
          </div>
        );

      case 5: // Review
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Deal Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Value:</span> ${parseInt(formData.value || '0').toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Stage:</span> {formData.stage}
                </div>
                <div>
                  <span className="font-medium">Probability:</span> {formData.probability}%
                </div>
                <div>
                  <span className="font-medium">Close Date:</span> {formData.expectedCloseDate}
                </div>
                <div>
                  <span className="font-medium">Owner:</span> {formData.assignedTo}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Ready to Create</h4>
              <p className="text-blue-800 text-sm">
                Review the information above and click "Create Deal" to add this opportunity to your pipeline.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Deal</h1>
        <p className="text-gray-600">Follow the steps to create a comprehensive deal record</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {WIZARD_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < WIZARD_STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / (WIZARD_STEPS.length - 1)) * 100} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{WIZARD_STEPS[currentStep].title}</CardTitle>
          <p className="text-gray-600">{WIZARD_STEPS[currentStep].description}</p>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="space-x-2">
          <Button variant="outline" onClick={() => setLocation('/crm/deals')}>
            Cancel
          </Button>
          
          {currentStep === WIZARD_STEPS.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={createDealMutation.isPending}
            >
              {createDealMutation.isPending ? 'Creating...' : 'Create Deal'}
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}