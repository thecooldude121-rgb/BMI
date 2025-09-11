import React, { useState } from 'react';
import { Plus, Mail, Phone, MessageSquare, Clock, ArrowRight, X, Save, Play, Settings } from 'lucide-react';

interface SequenceStep {
  id: string;
  type: 'email' | 'call' | 'linkedin' | 'sms' | 'wait';
  delayDays: number;
  delayHours: number;
  templateId?: string;
  subject?: string;
  content?: string;
  conditions?: SequenceCondition[];
  isActive: boolean;
}

interface SequenceCondition {
  id: string;
  type: 'opened' | 'clicked' | 'replied' | 'not_opened' | 'not_clicked';
  action: 'continue' | 'skip' | 'end_sequence';
}

interface SequenceBuilderProps {
  onSave: (sequence: any) => void;
  onClose: () => void;
  existingSequence?: any;
}

const SequenceBuilder: React.FC<SequenceBuilderProps> = ({
  onSave,
  onClose,
  existingSequence
}) => {
  const [sequenceName, setSequenceName] = useState(existingSequence?.name || '');
  const [sequenceDescription, setSequenceDescription] = useState(existingSequence?.description || '');
  const [steps, setSteps] = useState<SequenceStep[]>(existingSequence?.steps || []);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);
  const [newStep, setNewStep] = useState<Partial<SequenceStep>>({
    type: 'email',
    delayDays: 0,
    delayHours: 0,
    isActive: true
  });

  const stepTypes = [
    { value: 'email', label: 'Email', icon: Mail, color: 'blue' },
    { value: 'call', label: 'Call Task', icon: Phone, color: 'green' },
    { value: 'linkedin', label: 'LinkedIn Message', icon: MessageSquare, color: 'purple' },
    { value: 'sms', label: 'SMS', icon: MessageSquare, color: 'orange' },
    { value: 'wait', label: 'Wait Period', icon: Clock, color: 'gray' }
  ];

  const emailTemplates = [
    { id: '1', name: 'Cold Outreach Template', subject: 'Quick question about {{company}}' },
    { id: '2', name: 'Follow-up Template', subject: 'Following up on our conversation' },
    { id: '3', name: 'Value Proposition', subject: 'How {{company}} can save 30% on costs' },
    { id: '4', name: 'Case Study Share', subject: 'How we helped {{similar_company}}' }
  ];

  const addStep = () => {
    if (!newStep.type) return;

    const step: SequenceStep = {
      id: Date.now().toString(),
      type: newStep.type as SequenceStep['type'],
      delayDays: newStep.delayDays || 0,
      delayHours: newStep.delayHours || 0,
      templateId: newStep.templateId,
      subject: newStep.subject,
      content: newStep.content,
      conditions: [],
      isActive: true
    };

    setSteps(prev => [...prev, step]);
    setNewStep({
      type: 'email',
      delayDays: 0,
      delayHours: 0,
      isActive: true
    });
    setShowStepForm(false);
  };

  const removeStep = (stepId: string) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleSave = () => {
    const sequenceData = {
      name: sequenceName,
      description: sequenceDescription,
      steps: steps,
      isActive: false, // Start as draft
      createdAt: new Date().toISOString()
    };
    
    onSave(sequenceData);
  };

  const getStepIcon = (type: SequenceStep['type']) => {
    const stepType = stepTypes.find(st => st.value === type);
    return stepType?.icon || Mail;
  };

  const getStepColor = (type: SequenceStep['type']) => {
    const stepType = stepTypes.find(st => st.value === type);
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      gray: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[stepType?.color as keyof typeof colors] || colors.blue;
  };

  const getTotalDelay = (stepIndex: number) => {
    return steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + step.delayDays + (step.delayHours / 24);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {existingSequence ? 'Edit Sequence' : 'Build Email Sequence'}
              </h2>
              <p className="text-gray-600">Create automated outreach campaigns</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Sequence
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Left Column - Sequence Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sequence Name</label>
                <input
                  type="text"
                  value={sequenceName}
                  onChange={(e) => setSequenceName(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter sequence name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
                <textarea
                  rows={3}
                  value={sequenceDescription}
                  onChange={(e) => setSequenceDescription(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe the purpose of this sequence..."
                />
              </div>

              {/* Add Step Button */}
              <button
                onClick={() => setShowStepForm(true)}
                className="w-full flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Step
              </button>

              {/* Step Types */}
              {showStepForm && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">Add New Step</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Step Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {stepTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              onClick={() => setNewStep(prev => ({ ...prev, type: type.value as SequenceStep['type'] }))}
                              className={`p-3 border rounded-lg text-left transition-colors ${
                                newStep.type === type.value
                                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="h-4 w-4 mb-1" />
                              <p className="text-sm font-medium">{type.label}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delay (Days)</label>
                        <input
                          type="number"
                          value={newStep.delayDays || 0}
                          onChange={(e) => setNewStep(prev => ({ ...prev, delayDays: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delay (Hours)</label>
                        <input
                          type="number"
                          value={newStep.delayHours || 0}
                          onChange={(e) => setNewStep(prev => ({ ...prev, delayHours: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="23"
                        />
                      </div>
                    </div>

                    {newStep.type === 'email' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Template</label>
                        <select
                          value={newStep.templateId || ''}
                          onChange={(e) => setNewStep(prev => ({ ...prev, templateId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select template...</option>
                          {emailTemplates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowStepForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addStep}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Add Step
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Center Column - Sequence Flow */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sequence Flow</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{steps.length} steps</span>
                  <span>•</span>
                  <span>
                    {steps.reduce((total, step) => total + step.delayDays, 0)} days total
                  </span>
                </div>
              </div>

              {steps.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No steps added yet</h3>
                  <p className="text-gray-600 mb-6">Start building your sequence by adding the first step</p>
                  <button
                    onClick={() => setShowStepForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Add First Step
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const Icon = getStepIcon(step.type);
                    const colorClasses = getStepColor(step.type);
                    const totalDelay = getTotalDelay(index);
                    
                    return (
                      <div key={step.id} className="relative">
                        <div
                          onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                          className={`p-6 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                            selectedStep === step.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg border ${colorClasses}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Step {index + 1}: {stepTypes.find(t => t.value === step.type)?.label}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {step.delayDays > 0 || step.delayHours > 0 
                                    ? `Wait ${step.delayDays}d ${step.delayHours}h`
                                    : 'Immediate'
                                  } • Day {Math.ceil(totalDelay)} of sequence
                                </p>
                                {step.subject && (
                                  <p className="text-sm text-gray-500 mt-1">"{step.subject}"</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeStep(step.id);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Step Details (Expanded) */}
                          {selectedStep === step.id && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delay Days
                                  </label>
                                  <input
                                    type="number"
                                    value={step.delayDays}
                                    onChange={(e) => updateStep(step.id, { delayDays: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delay Hours
                                  </label>
                                  <input
                                    type="number"
                                    value={step.delayHours}
                                    onChange={(e) => updateStep(step.id, { delayHours: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    max="23"
                                  />
                                </div>
                              </div>

                              {step.type === 'email' && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Template
                                  </label>
                                  <select
                                    value={step.templateId || ''}
                                    onChange={(e) => updateStep(step.id, { templateId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select template...</option>
                                    {emailTemplates.map((template) => (
                                      <option key={template.id} value={template.id}>
                                        {template.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Arrow Connector */}
                        {index < steps.length - 1 && (
                          <div className="flex justify-center py-2">
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sequence Settings */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Sequence Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Stop on reply</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Skip weekends</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Track opens</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Track clicks</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceBuilder;

/*
CRM Sequence Builder Component

Purpose: Visual sequence builder for email automation campaigns

Features:
- Drag-and-drop sequence step creation
- Multiple communication channels (email, phone, LinkedIn, SMS)
- Conditional logic and branching
- Template integration
- Delay and timing configuration
- Performance tracking setup

API Integration Points:
1. GET /api/templates/email - Fetch email templates
2. POST /api/sequences - Create new sequence
3. PUT /api/sequences/{id} - Update existing sequence
4. GET /api/sequences/{id}/preview - Preview sequence flow
5. POST /api/sequences/{id}/test - Send test sequence

TODO:
- Add drag-and-drop reordering
- Implement conditional branching
- Add A/B testing capabilities
- Include sequence analytics preview
- Add template editor integration
*/