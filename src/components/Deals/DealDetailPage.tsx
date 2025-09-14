import React, { useState } from 'react';
import { 
  ArrowLeft, Edit, Mail, Phone, Video, Calendar, FileText, 
  DollarSign, User, Building, Clock, Tag, Paperclip, Activity,
  MoreHorizontal, Star, TrendingUp, Globe, Target, Settings,
  Plus, Download, Share, Copy, Eye, Trash2, Archive, Flag,
  CheckCircle, AlertCircle, X, Save, ChevronDown, ChevronUp,
  Briefcase
} from 'lucide-react';
import { Deal, Pipeline } from '../../types/deals';

interface DealDetailPageProps {
  deal: Deal;
  pipelines: Pipeline[];
  accounts: any[];
  contacts: any[];
  users: any[];
  onUpdate: (dealId: string, updates: Partial<Deal>) => void;
  onDelete: (dealId: string) => void;
  onClose: () => void;
}

const DealDetailPage: React.FC<DealDetailPageProps> = ({
  deal,
  pipelines,
  accounts,
  contacts,
  users,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'activities' | 'emails' | 'attachments' | 'notes' | 'history'>('summary');
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'financial', 'details']));
  const [showStageModal, setShowStageModal] = useState(false);

  const renderCollapsibleSection = (
    id: string,
    title: string,
    icon: React.ElementType,
    children: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections.has(id);

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center space-x-3">
            {actions}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };
  const pipeline = pipelines.find(p => p.id === deal.pipelineId);
  const currentStage = pipeline?.stages.find(s => s.id === deal.stageId);
  const account = accounts.find(a => a.id === deal.accountId);
  const contact = contacts.find(c => c.id === deal.contactId);
  const owner = users.find(u => u.id === deal.ownerId);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDaysInStage = () => {
    const currentStageEntry = deal.stageHistory
      .filter(entry => entry.toStageId === deal.stageId)
      .sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())[0];
    
    if (!currentStageEntry) return 0;
    
    return Math.floor(
      (new Date().getTime() - new Date(currentStageEntry.enteredAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getHealthColor = (health: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800 border-green-200',
      'at-risk': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      stalled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[health as keyof typeof colors] || colors.healthy;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleFieldEdit = (field: string, value: any) => {
    setEditableFields(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    onUpdate(deal.id, editableFields);
    setIsEditing(false);
    setEditableFields({});
  };

  const renderCollapsibleSection = (
    id: string,
    title: string,
    icon: React.ElementType,
    children: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections.has(id);

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center space-x-3">
            {actions}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  const handleStageChange = (newStageId: string) => {
    const newStage = pipeline?.stages.find(s => s.id === newStageId);
    if (!newStage) return;

    const updates: Partial<Deal> = {
      stageId: newStageId,
      probability: newStage.probability,
      updatedAt: new Date().toISOString(),
      stageHistory: [
        ...deal.stageHistory,
        {
          id: `hist-${Date.now()}`,
          fromStageId: deal.stageId,
          toStageId: newStageId,
          enteredAt: new Date().toISOString(),
          changedBy: 'current-user'
        }
      ]
    };

    if (newStage.isClosedWon || newStage.isClosedLost) {
      updates.actualCloseDate = new Date().toISOString();
    }

    onUpdate(deal.id, updates);
    setShowStageModal(false);
  };

  const tabs = [
    { id: 'summary', name: 'Summary', icon: Target, count: null },
    { id: 'activities', name: 'Activities', icon: Activity, count: deal.activities.length },
    { id: 'emails', name: 'Emails', icon: Mail, count: deal.emails.length },
    { id: 'attachments', name: 'Attachments', icon: Paperclip, count: deal.attachments.length },
    { id: 'notes', name: 'Notes', icon: FileText, count: null },
    { id: 'history', name: 'Stage History', icon: Clock, count: deal.stageHistory.length }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50 backdrop-blur-sm">
      <div className="min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{deal.name}</h1>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white border"
                      style={{ backgroundColor: currentStage?.color }}
                    >
                      {currentStage?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{deal.dealNumber}</span>
                    <span>•</span>
                    <span>{formatCurrency(deal.amount, deal.currency)}</span>
                    <span>•</span>
                    <span>Owner: {owner?.name}</span>
                    <span>•</span>
                    <span>{getDaysInStage()} days in stage</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getHealthColor(deal.health)}`}>
                  {deal.health}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(deal.priority)}`}>
                  {deal.priority}
                </span>
              </div>
              
              <button
                onClick={() => setShowStageModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Target className="h-4 w-4 mr-2" />
                Change Stage
              </button>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </button>
              
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 p-6 bg-gray-50 border-b border-gray-200">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              Log Call
            </button>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Video className="h-4 w-4 mr-2" />
              Schedule Meeting
            </button>
            <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Task
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{tab.name}</span>
                      {tab.count !== null && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'summary' && (
              <div className="space-y-8">
                {/* Basic Information */}
                {renderCollapsibleSection(
                  'basic',
                  'Basic Information',
                  Briefcase,
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Deal Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableFields.name || deal.name}
                            onChange={(e) => handleFieldEdit('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-lg font-medium text-gray-900">{deal.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Account</label>
                        <p className="text-lg font-medium text-gray-900">
                          {account ? (
                            <button className="text-blue-600 hover:text-blue-800 hover:underline">
                              {account.name}
                            </button>
                          ) : (
                            'No account'
                          )}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Primary Contact</label>
                        <p className="text-lg font-medium text-gray-900">
                          {contact ? (
                            <button className="text-blue-600 hover:text-blue-800 hover:underline">
                              {contact.name}
                            </button>
                          ) : (
                            'No contact'
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Deal Owner</label>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-lg font-medium text-gray-900">{owner?.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pipeline</label>
                        <p className="text-lg font-medium text-gray-900">{pipeline?.name}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Deal Type</label>
                        <p className="text-lg font-medium text-gray-900 capitalize">
                          {deal.dealType.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Financial Information */}
                {renderCollapsibleSection(
                  'financial',
                  'Financial Information',
                  DollarSign,
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-green-600 mb-1">Deal Value</p>
                        <p className="text-3xl font-bold text-green-700">
                          {formatCurrency(deal.amount, deal.currency)}
                        </p>
                      </div>
                      
                      <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-blue-600 mb-1">Win Probability</p>
                        <p className="text-3xl font-bold text-blue-700">{deal.probability}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                        <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-purple-600 mb-1">Weighted Value</p>
                        <p className="text-3xl font-bold text-purple-700">
                          {formatCurrency(deal.amount * deal.probability / 100, deal.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Expected Close Date</label>
                        <p className="text-lg font-medium text-gray-900">
                          {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      
                      {deal.actualCloseDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Actual Close Date</label>
                          <p className="text-lg font-medium text-gray-900">
                            {new Date(deal.actualCloseDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Deal Details */}
                {renderCollapsibleSection(
                  'details',
                  'Deal Details',
                  FileText,
                  <div className="mt-6 space-y-6">
                    {deal.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                        <p className="text-gray-700 leading-relaxed">{deal.description}</p>
                      </div>
                    )}
                    
                    {deal.nextSteps && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Next Steps</label>
                        <p className="text-gray-700 leading-relaxed">{deal.nextSteps}</p>
                      </div>
                    )}
                    
                    {deal.tags.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {deal.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                {renderCollapsibleSection(
                  'timeline',
                  'Deal Timeline',
                  Clock,
                  <div className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Deal Created</p>
                          <p className="text-sm text-gray-600">{new Date(deal.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {deal.lastActivityAt && (
                        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Activity className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Last Activity</p>
                            <p className="text-sm text-gray-600">{new Date(deal.lastActivityAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      
                      {deal.expectedCloseDate && (
                        <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Target className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Expected Close</p>
                            <p className="text-sm text-gray-600">{new Date(deal.expectedCloseDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Activities & Timeline</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Activity
                  </button>
                </div>

                {deal.activities.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities logged</h3>
                    <p className="text-gray-600 mb-6">Start tracking your deal activities and communications</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      Log First Activity
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deal.activities.map((activity) => (
                      <div key={activity.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            {activity.type === 'call' && <Phone className="h-5 w-5 text-blue-600" />}
                            {activity.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                            {activity.type === 'meeting' && <Video className="h-5 w-5 text-blue-600" />}
                            {activity.type === 'task' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                            {activity.type === 'note' && <FileText className="h-5 w-5 text-blue-600" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{activity.subject}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                activity.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                            
                            {activity.description && (
                              <p className="text-gray-600 mb-3">{activity.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>By {activity.createdBy}</span>
                              {activity.duration && <span>{activity.duration} minutes</span>}
                              <span>{new Date(activity.createdAt).toLocaleString()}</span>
                            </div>
                            
                            {activity.outcome && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800">
                                  <strong>Outcome:</strong> {activity.outcome}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'emails' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Email Communications</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Mail className="h-4 w-4 mr-2" />
                    Compose Email
                  </button>
                </div>

                {deal.emails.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                    <p className="text-gray-600 mb-6">All deal-related emails will appear here</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      Send First Email
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deal.emails.map((email) => (
                      <div key={email.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{email.subject}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            email.status === 'replied' ? 'bg-green-100 text-green-800' :
                            email.status === 'opened' ? 'bg-blue-100 text-blue-800' :
                            email.status === 'sent' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {email.status}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">From:</span> {email.fromEmail}
                          <span className="mx-2">•</span>
                          <span className="font-medium">To:</span> {email.toEmails.join(', ')}
                          <span className="mx-2">•</span>
                          <span>{new Date(email.createdAt).toLocaleString()}</span>
                        </div>
                        
                        <div className="text-gray-700 leading-relaxed">
                          {email.body.length > 200 ? (
                            <>
                              {email.body.substring(0, 200)}...
                              <button className="text-blue-600 hover:text-blue-800 ml-2">Read more</button>
                            </>
                          ) : (
                            email.body
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'attachments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Attachments & Documents</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload File
                  </button>
                </div>

                {deal.attachments.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attachments yet</h3>
                    <p className="text-gray-600 mb-6">Upload proposals, contracts, and supporting documents</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      Upload First File
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deal.attachments.map((attachment) => (
                      <div key={attachment.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-3">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{attachment.name}</h4>
                            <p className="text-sm text-gray-500">
                              {(attachment.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>Uploaded by {attachment.uploadedBy}</span>
                          <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Stage History</h3>
                
                <div className="flow-root">
                  <ul className="-mb-8">
                    {deal.stageHistory.map((entry, index) => {
                      const stage = pipeline?.stages.find(s => s.id === entry.toStageId);
                      const fromStage = entry.fromStageId ? pipeline?.stages.find(s => s.id === entry.fromStageId) : null;
                      
                      return (
                        <li key={entry.id}>
                          <div className="relative pb-8">
                            {index !== deal.stageHistory.length - 1 && (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span 
                                  className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white text-white text-sm font-medium"
                                  style={{ backgroundColor: stage?.color }}
                                >
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    {fromStage ? (
                                      <>Moved from <span className="font-medium">{fromStage.name}</span> to </>
                                    ) : (
                                      'Entered '
                                    )}
                                    <span className="font-medium">{stage?.name}</span>
                                  </p>
                                  {entry.reason && (
                                    <p className="text-sm text-gray-500 mt-1">Reason: {entry.reason}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    Changed by {entry.changedBy}
                                    {entry.duration && (
                                      <span className="ml-2">• Duration: {Math.round(entry.duration)} hours</span>
                                    )}
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  <p>{new Date(entry.enteredAt).toLocaleString()}</p>
                                  {entry.exitedAt && (
                                    <p className="text-xs">to {new Date(entry.exitedAt).toLocaleString()}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Deal Notes</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </button>
                </div>

                {deal.notes ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Internal Notes</h4>
                      <span className="text-sm text-gray-500">
                        Last updated {new Date(deal.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{deal.notes}</p>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notes added</h3>
                    <p className="text-gray-600 mb-6">Add internal notes to track important information</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      Add First Note
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stage Change Modal */}
      {showStageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Stage</h3>
              <button onClick={() => setShowStageModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              {pipeline?.stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => handleStageChange(stage.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    stage.id === deal.stageId
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-gray-900">{stage.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{stage.probability}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealDetailPage;