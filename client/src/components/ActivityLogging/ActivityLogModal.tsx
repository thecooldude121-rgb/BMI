import React, { useState } from 'react';
import { X, Save, Phone, Calendar, CheckSquare, FileText } from 'lucide-react';
import { useActivitiesSync } from '../../hooks/useActivitiesSync';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId?: string;
  dealTitle?: string;
  contactId?: string;
  accountId?: string;
  leadId?: string;
  // Enhanced for Lead Gen bidirectional sync
  source?: 'crm' | 'leadgen' | 'deal';
  companyName?: string;
}

type ActivityType = 'call' | 'meeting' | 'task' | 'note';

interface ActivityFormData {
  subject: string;
  type: ActivityType;
  description: string;
  status: 'completed' | 'planned' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  
  // Related to fields
  relatedEntityType?: 'deal' | 'account';
  relatedEntityName?: string;
  
  // Call specific
  outcome?: 'completed' | 'no_answer' | 'follow_up_needed' | '';
  participants?: string;
  
  // Meeting specific
  startTime?: string;
  endTime?: string;
  meetingOutcome?: 'held' | 'cancelled' | 'rescheduled' | '';
  nextSteps?: string;
  
  // Task specific
  dueDate?: string;
  assignedTo?: string;
  taskStatus?: 'open' | 'in_progress' | 'completed';
  
  // Common fields
  scheduledAt?: string;
  attachments?: string;
}

const ActivityLogModal: React.FC<ActivityLogModalProps> = ({
  isOpen,
  onClose,
  dealId,
  dealTitle,
  contactId,
  accountId,
  leadId,
  source = 'crm',
  companyName,
}) => {
  const [activeTab, setActiveTab] = useState<ActivityType>('note');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createActivity } = useActivitiesSync();
  
  const [formData, setFormData] = useState<ActivityFormData>({
    subject: '',
    type: 'note',
    description: '',
    status: 'completed',
    priority: 'medium',
    relatedEntityType: dealId ? 'deal' : accountId ? 'account' : 'deal',
    relatedEntityName: dealId ? (dealTitle || '') : accountId ? 'Account Name' : '',
    // Initialize all optional fields with empty strings to prevent uncontrolled input warnings
    outcome: '',
    participants: '',
    startTime: '',
    endTime: '',
    meetingOutcome: '',
    nextSteps: '',
    dueDate: '',
    assignedTo: '',
    taskStatus: 'open',
    scheduledAt: '',
    attachments: '',
  });

  const tabs = [
    { id: 'call' as ActivityType, label: 'Call', icon: Phone },
    { id: 'meeting' as ActivityType, label: 'Meeting', icon: Calendar },
    { id: 'task' as ActivityType, label: 'Task', icon: CheckSquare },
    { id: 'note' as ActivityType, label: 'Note', icon: FileText },
  ];

  const handleTabChange = (tabId: ActivityType) => {
    setActiveTab(tabId);
    setFormData(prev => ({ ...prev, type: tabId }));
  };

  const handleInputChange = (field: keyof ActivityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log(`🔄 Creating activity from ${source} module via ActivityLogModal`);
      
      const activityData = {
        subject: formData.subject || `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} - ${dealTitle || companyName || 'Activity'}`,
        type: formData.type,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        relatedToType: (dealId ? 'deal' : contactId ? 'contact' : accountId ? 'account' : leadId ? 'lead' : 'deal') as 'deal' | 'contact' | 'account' | 'lead',
        relatedToId: dealId || contactId || accountId || leadId,
        dealId,
        contactId,
        accountId,
        leadId,
        assignedTo: 'f310c13c-3edf-4f46-a6ec-46503ed02377', // Current user
        createdBy: 'f310c13c-3edf-4f46-a6ec-46503ed02377', // Current user
        source, // Enhanced: Track source for bidirectional sync
        
        // Type-specific fields
        outcome: formData.outcome,
        scheduledAt: formData.scheduledAt,
        dueDate: formData.dueDate,
        nextAction: formData.nextSteps,
      };

      await createActivity.mutateAsync(activityData);
      
      // Reset form and close modal
      setFormData({
        subject: '',
        type: 'note',
        description: '',
        status: 'completed',
        priority: 'medium',
        relatedEntityType: dealId ? 'deal' : accountId ? 'account' : 'deal',
        relatedEntityName: dealId ? (dealTitle || '') : accountId ? 'Account Name' : '',
        // Initialize all optional fields with empty strings to prevent uncontrolled input warnings
        outcome: '',
        participants: '',
        startTime: '',
        endTime: '',
        meetingOutcome: '',
        nextSteps: '',
        dueDate: '',
        assignedTo: '',
        taskStatus: 'open',
        scheduledAt: '',
        attachments: '',
      });
      onClose();
    } catch (error) {
      console.error('Failed to create activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Log a New Activity</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Record all interactions and tasks related to this {dealId ? 'deal' : accountId ? 'account' : 'item'}
            {source === 'leadgen' && companyName && ` (${companyName})`}. 
            Select the appropriate activity type by switching tabs below, then fill in the details.
          </p>
          {source === 'leadgen' && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Lead Generation
              </span>
              <span className="text-xs text-gray-500">
                This activity will sync with your CRM automatically
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject/Title *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} subject...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Related to field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related to
              </label>
              <div className="flex gap-2 items-center">
                <select
                  value={formData.relatedEntityType}
                  onChange={(e) => handleInputChange('relatedEntityType', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-gradient-to-b from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow appearance-none cursor-pointer min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '10px',
                    paddingRight: '28px'
                  }}
                >
                  <option value="deal">Deal</option>
                  <option value="account">Account</option>
                </select>
                <input
                  type="text"
                  value={formData.relatedEntityName}
                  onChange={(e) => handleInputChange('relatedEntityName', e.target.value)}
                  placeholder="Enter name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tab-specific Fields */}
            {activeTab === 'call' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participants
                  </label>
                  <input
                    type="text"
                    value={formData.participants}
                    onChange={(e) => handleInputChange('participants', e.target.value)}
                    placeholder="Enter participant names..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outcome
                  </label>
                  <select
                    value={formData.outcome}
                    onChange={(e) => handleInputChange('outcome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select outcome...</option>
                    <option value="completed">Completed</option>
                    <option value="no_answer">No Answer</option>
                    <option value="follow_up_needed">Follow-up Needed</option>
                  </select>
                </div>
              </>
            )}

            

            {activeTab === 'meeting' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outcome
                  </label>
                  <select
                    value={formData.meetingOutcome}
                    onChange={(e) => handleInputChange('meetingOutcome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select outcome...</option>
                    <option value="held">Held</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Steps/Follow-up
                  </label>
                  <textarea
                    value={formData.nextSteps}
                    onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                    placeholder="What are the next steps..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {activeTab === 'task' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="planned">Open</option>
                      <option value="completed">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </>
            )}

            {/* Description - Common for all types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'note' ? 'Content/Notes' : 'Notes'} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={`Enter ${activeTab} details...`}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment(s)
              </label>
              <input
                type="text"
                value={formData.attachments}
                onChange={(e) => handleInputChange('attachments', e.target.value)}
                placeholder="Attachment URLs or names..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </form>

        {/* Footer - Save and Cancel Buttons */}
        <div className="sticky bottom-0 flex items-center justify-end space-x-3 p-6 border-t-2 border-gray-300 bg-white shadow-lg mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.subject.trim() || !formData.description.trim()}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Activity'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogModal;