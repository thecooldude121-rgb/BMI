import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { 
  ArrowLeft, Edit2, Save, X, Clock, DollarSign, Calendar, User, 
  Building, Mail, Phone, MapPin, Activity, FileText, Paperclip,
  CheckCircle, AlertCircle, TrendingUp, MessageSquare, Users,
  Briefcase, Target, ChevronRight, Plus, MoreVertical, Star,
  RefreshCw, Zap, Brain, Link as LinkIcon, History, Send
} from 'lucide-react';
import { format } from 'date-fns';
// Simplified UI components (shadcn not available in this project)
const Button = ({ children, variant = 'default', size = 'default', onClick, disabled, className = '' }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === 'ghost' ? 'hover:bg-gray-100' : 
      variant === 'outline' ? 'border border-gray-300 hover:bg-gray-50' :
      'bg-blue-600 text-white hover:bg-blue-700'
    } ${size === 'sm' ? 'text-sm px-3 py-1' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

const Badge = ({ children, variant = 'default', className = '' }: any) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'outline' ? 'border border-gray-300' : 'bg-gray-100 text-gray-800'
  } ${className}`}>
    {children}
  </span>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: any) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: any) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }: any) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Progress = ({ value = 0, className = '' }: any) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);

const Textarea = ({ value, onChange, placeholder, className = '', ...props }: any) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Input = ({ value, onChange, type = 'text', placeholder, className = '', ...props }: any) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Select = ({ value, onValueChange, children }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child?.type === SelectTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen), value });
        }
        if (child?.type === SelectContent) {
          return isOpen ? React.cloneElement(child, { onValueChange, setIsOpen }) : null;
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, onClick, value, className = '' }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 ${className}`}
  >
    {React.Children.map(children, child => {
      if (child?.type === SelectValue) {
        return <span>{value}</span>;
      }
      return child;
    })}
    <ChevronDown className="h-4 w-4" />
  </button>
);

const SelectValue = () => null;

const SelectContent = ({ children, onValueChange, setIsOpen }: any) => (
  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
    {React.Children.map(children, child => {
      if (child?.type === SelectItem) {
        return React.cloneElement(child, { 
          onClick: () => {
            onValueChange(child.props.value);
            setIsOpen(false);
          }
        });
      }
      return child;
    })}
  </div>
);

const SelectItem = ({ children, value, onClick }: any) => (
  <div
    onClick={onClick}
    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
  >
    {children}
  </div>
);

const Separator = ({ className = '' }: any) => (
  <div className={`h-px bg-gray-200 my-4 ${className}`} />
);

const Tabs = ({ value, onValueChange, children, className = '' }: any) => {
  const [activeTab, setActiveTab] = React.useState(value);
  
  React.useEffect(() => {
    if (onValueChange) onValueChange(activeTab);
  }, [activeTab]);

  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (child?.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child?.type === TabsContent) {
          return child.props.value === activeTab ? child : null;
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className = '' }: any) => (
  <div className={`flex space-x-1 border-b border-gray-200 ${className}`}>
    {React.Children.map(children, child => {
      if (child?.type === TabsTrigger) {
        return React.cloneElement(child, { 
          isActive: activeTab === child.props.value,
          onClick: () => setActiveTab(child.props.value)
        });
      }
      return child;
    })}
  </div>
);

const TabsTrigger = ({ children, value, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm transition-colors ${
      isActive 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, className = '' }: any) => (
  <div className={className}>
    {children}
  </div>
);

const useToast = () => {
  return {
    toast: ({ title, description }: any) => {
      // Simple toast implementation
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50';
      toastEl.innerHTML = `
        <div class="font-medium">${title}</div>
        ${description ? `<div class="text-sm opacity-90">${description}</div>` : ''}
      `;
      document.body.appendChild(toastEl);
      setTimeout(() => toastEl.remove(), 3000);
    }
  };
};

interface DealTimeline {
  id: string;
  stage: string;
  changedAt: string;
  changedBy: string;
  notes?: string;
  duration?: number;
}

interface SmartSuggestion {
  id: string;
  type: 'activity' | 'email' | 'call' | 'meeting';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
}

const DealDetailView: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Fetch deal with all related data
  const { data: deal, isLoading } = useQuery({
    queryKey: ['/api/deals', id],
    queryFn: () => apiRequest(`/api/deals/${id}`),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['/api/activities', { dealId: id }],
    queryFn: () => apiRequest(`/api/activities?dealId=${id}`),
  });

  const { data: account } = useQuery({
    queryKey: ['/api/accounts', deal?.accountId],
    enabled: !!deal?.accountId,
    queryFn: () => apiRequest(`/api/accounts/${deal.accountId}`),
  });

  const { data: contact } = useQuery({
    queryKey: ['/api/contacts', deal?.contactId],
    enabled: !!deal?.contactId,
    queryFn: () => apiRequest(`/api/contacts/${deal.contactId}`),
  });

  const { data: lead } = useQuery({
    queryKey: ['/api/leads', deal?.leadId],
    enabled: !!deal?.leadId,
    queryFn: () => apiRequest(`/api/leads/${deal.leadId}`),
  });

  // Update deal mutation
  const updateDealMutation = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest(`/api/deals/${id}`, {
        method: 'PATCH',
        body: updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', id] });
      toast({
        title: "Success",
        description: "Deal updated successfully",
      });
      setEditMode({});
    },
  });

  // Add activity mutation
  const addActivityMutation = useMutation({
    mutationFn: async (activity: any) => {
      return apiRequest('/api/activities', {
        method: 'POST',
        body: { ...activity, dealId: id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Activity Added",
        description: "New activity has been created",
      });
    },
  });

  // Stage progression colors
  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'qualification': 'bg-slate-500',
      'discovery': 'bg-blue-500',
      'demo': 'bg-indigo-500',
      'proposal': 'bg-purple-500',
      'negotiation': 'bg-yellow-500',
      'closed-won': 'bg-green-500',
      'closed-lost': 'bg-red-500',
    };
    return colors[stage] || 'bg-gray-500';
  };

  const getHealthColor = (health: string) => {
    const colors: { [key: string]: string } = {
      'healthy': 'text-green-600 bg-green-50',
      'at_risk': 'text-yellow-600 bg-yellow-50',
      'critical': 'text-red-600 bg-red-50',
      'hot_opportunity': 'text-orange-600 bg-orange-50',
      'stalled': 'text-gray-600 bg-gray-50',
    };
    return colors[health] || 'text-gray-600 bg-gray-50';
  };

  // Mock timeline data (would come from API)
  const timeline: DealTimeline[] = [
    { id: '1', stage: 'qualification', changedAt: '2024-01-15T10:00:00Z', changedBy: 'John Doe', notes: 'Initial qualification call', duration: 5 },
    { id: '2', stage: 'discovery', changedAt: '2024-01-20T14:00:00Z', changedBy: 'John Doe', notes: 'Discovery meeting completed', duration: 8 },
    { id: '3', stage: 'demo', changedAt: '2024-01-28T09:00:00Z', changedBy: 'Jane Smith', notes: 'Product demo delivered', duration: 3 },
    { id: '4', stage: 'proposal', changedAt: '2024-01-31T16:00:00Z', changedBy: 'John Doe', notes: 'Proposal sent to client', duration: 0 },
  ];

  // Mock smart suggestions
  const smartSuggestions: SmartSuggestion[] = [
    { id: '1', type: 'call', title: 'Follow up on proposal', description: 'Client hasn\'t responded in 3 days', priority: 'high', confidence: 0.9 },
    { id: '2', type: 'email', title: 'Send case study', description: 'Client requested similar industry examples', priority: 'medium', confidence: 0.85 },
    { id: '3', type: 'meeting', title: 'Schedule negotiation call', description: 'Move deal to next stage', priority: 'high', confidence: 0.88 },
  ];

  const handleInlineEdit = (field: string) => {
    if (editMode[field]) {
      // Save the changes
      updateDealMutation.mutate({ [field]: editValues[field] });
    } else {
      // Enter edit mode
      setEditMode({ ...editMode, [field]: true });
      setEditValues({ ...editValues, [field]: deal?.[field] });
    }
  };

  const cancelInlineEdit = (field: string) => {
    setEditMode({ ...editMode, [field]: false });
    setEditValues({ ...editValues, [field]: deal?.[field] });
  };

  const handleStageChange = (newStage: string) => {
    updateDealMutation.mutate({ 
      stage: newStage,
      stageHistory: [...(deal?.stageHistory || []), {
        stage: newStage,
        changedAt: new Date().toISOString(),
        changedBy: 'Current User', // Would come from auth context
        notes: 'Stage updated',
      }]
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addActivityMutation.mutate({
        subject: 'Note added',
        description: newNote,
        activityType: 'note',
        status: 'completed',
      });
      setNewNote('');
    }
  };

  const executeSuggestion = (suggestion: SmartSuggestion) => {
    addActivityMutation.mutate({
      subject: suggestion.title,
      description: suggestion.description,
      activityType: suggestion.type,
      status: 'open',
      priority: suggestion.priority,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading deal details...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Deal not found</div>
      </div>
    );
  }

  const openActivities = activities.filter((a: any) => a.status === 'open');
  const closedActivities = activities.filter((a: any) => a.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/crm/deals">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deals
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {editMode.name ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={editValues.name}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    className="text-3xl font-bold"
                  />
                  <Button size="sm" onClick={() => handleInlineEdit('name')}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => cancelInlineEdit('name')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{deal.name}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleInlineEdit('name')}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getHealthColor(deal.dealHealth || 'healthy')}>
              {deal.dealHealth || 'healthy'}
            </Badge>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stage Progression Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Deal Stage</h3>
            <Select value={deal.stage} onValueChange={handleStageChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qualification">Qualification</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Progress value={deal.probability || 0} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Qualification</span>
              <span>Discovery</span>
              <span>Demo</span>
              <span>Proposal</span>
              <span>Negotiation</span>
              <span>Closed</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">Probability: {deal.probability}%</span>
            <span className="text-gray-600">Expected Close: {deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy') : 'Not set'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Smart Suggestions */}
      {showSuggestions && smartSuggestions.length > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">AI-Powered Next Steps</CardTitle>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setShowSuggestions(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      suggestion.priority === 'high' ? 'bg-red-100' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {suggestion.type === 'call' && <Phone className="h-4 w-4" />}
                      {suggestion.type === 'email' && <Mail className="h-4 w-4" />}
                      {suggestion.type === 'meeting' && <Users className="h-4 w-4" />}
                      {suggestion.type === 'activity' && <Activity className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{suggestion.title}</p>
                      <p className="text-xs text-gray-600">{suggestion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </Badge>
                    <Button size="sm" onClick={() => executeSuggestion(suggestion)}>
                      <Zap className="h-4 w-4 mr-1" />
                      Execute
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ownership & Classification Block */}
          <Card>
            <CardHeader>
              <CardTitle>Ownership & Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Deal Owner</label>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{deal.ownerName || 'Unassigned'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Deal Type</label>
                  <div className="flex items-center mt-1">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{deal.dealType || 'New Business'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Source</label>
                  <div className="flex items-center mt-1">
                    <Target className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{deal.source || 'Inbound'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created Date</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{format(new Date(deal.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financials Block */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Deal Value</label>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    {editMode.amount ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={editValues.amount}
                          onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                          className="w-32"
                        />
                        <Button size="sm" onClick={() => handleInlineEdit('amount')}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => cancelInlineEdit('amount')}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">${(deal.amount || 0).toLocaleString()}</span>
                        <Button size="sm" variant="ghost" onClick={() => handleInlineEdit('amount')}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Expected Revenue</label>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm font-semibold">
                      ${((deal.amount || 0) * (deal.probability || 0) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contract Length</label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{deal.contractLength || '12 months'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                  <div className="flex items-center mt-1">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{deal.paymentTerms || 'Net 30'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Activities, Timeline, etc */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="emails">Emails</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="activities" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Activities ({openActivities.length} open, {closedActivities.length} closed)</h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Activity
                      </Button>
                    </div>
                    
                    {/* Open Activities */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-600">Open Activities</h4>
                      {openActivities.length === 0 ? (
                        <p className="text-sm text-gray-500">No open activities</p>
                      ) : (
                        openActivities.map((activity: any) => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-sm">{activity.subject}</p>
                                <p className="text-xs text-gray-600">{activity.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline">{activity.priority}</Badge>
                          </div>
                        ))
                      )}
                    </div>

                    <Separator />

                    {/* Closed Activities */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-600">Closed Activities</h4>
                      {closedActivities.length === 0 ? (
                        <p className="text-sm text-gray-500">No closed activities</p>
                      ) : (
                        closedActivities.map((activity: any) => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg opacity-75">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <div>
                                <p className="font-medium text-sm line-through">{activity.subject}</p>
                                <p className="text-xs text-gray-600">{activity.description}</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {activity.completedDate ? format(new Date(activity.completedDate), 'MMM dd') : ''}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-medium mb-4">Stage History</h3>
                    <div className="relative">
                      {timeline.map((item, index) => (
                        <div key={item.id} className="flex items-start space-x-4 mb-6">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full ${getStageColor(item.stage)} flex items-center justify-center text-white font-bold text-xs`}>
                              {index + 1}
                            </div>
                            {index < timeline.length - 1 && (
                              <div className="absolute top-10 left-5 w-0.5 h-16 bg-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium capitalize">{item.stage}</p>
                                <p className="text-sm text-gray-600">{item.notes}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(item.changedAt), 'MMM dd, yyyy hh:mm a')} by {item.changedBy}
                                </p>
                              </div>
                              {item.duration !== undefined && item.duration > 0 && (
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {item.duration} days
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="emails" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Email Communications</h3>
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Send Email
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">No emails yet</p>
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Tasks</h3>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">No tasks yet</p>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Files & Documents</h3>
                      <Button size="sm">
                        <Paperclip className="h-4 w-4 mr-1" />
                        Upload File
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">No files uploaded</p>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-medium mb-4">Notes</h3>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Add Note
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      {activities.filter((a: any) => a.activityType === 'note').map((note: any) => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{note.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(note.createdAt), 'MMM dd, yyyy hh:mm a')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Related Information */}
        <div className="space-y-6">
          {/* Related Account */}
          {account && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/crm/accounts/${account.id}`}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-gray-600">{account.industry}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Related Contact */}
          {contact && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/crm/contacts/${contact.id}`}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                      <p className="text-sm text-gray-600">{contact.jobTitle}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{contact.email}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Related Lead */}
          {lead && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Original Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/crm/leads/${lead.id}`}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Target className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                      <Badge variant="outline" className="mt-1">
                        {lead.leadSource}
                      </Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Deal Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deal Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Days in Pipeline</span>
                <span className="font-medium">
                  {Math.floor((new Date().getTime() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Days in Current Stage</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Activities Completed</span>
                <span className="font-medium">{closedActivities.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement Score</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">8.5/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automation Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Auto-assign on stage change</span>
                </div>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Email on proposal sent</span>
                </div>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Alert on 7 days inactive</span>
                </div>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Related Activities Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Log a Call
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealDetailView;