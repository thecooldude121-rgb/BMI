import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Mail, Phone, CheckCircle, Users, GripVertical, Edit3, 
  Trash2, Copy, ArrowUp, ArrowDown, Clock, Settings, Save, 
  Eye, EyeOff, Target, Calendar, AlertCircle, Play, Pause
} from 'lucide-react';

interface SequenceStep {
  id: string;
  type: 'email' | 'call' | 'task' | 'linkedin';
  subject?: string;
  content: string;
  delay: number;
  delayUnit: 'hours' | 'days';
  isActive: boolean;
  order: number;
}

interface SequenceStepManagerProps {
  sequenceId: string;
}

/**
 * Sequence Step Manager - Drag-and-drop step management with inline editing
 * Apollo.io inspired design with modern interactions
 * TODO: Connect to backend API for step CRUD operations
 */
const SequenceStepManager: React.FC<SequenceStepManagerProps> = ({ sequenceId }) => {
  const [steps, setSteps] = useState<SequenceStep[]>([]);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchSteps = async () => {
      // TODO: Replace with real API call
      setTimeout(() => {
        setSteps([
          {
            id: '1',
            type: 'email',
            subject: 'Quick introduction and value proposition',
            content: 'Hi {{firstName}},\n\nI noticed that {{companyName}} is growing rapidly in the {{industry}} space. We\'ve helped similar companies like yours increase their efficiency by 40%.\n\nWould you be open to a 15-minute conversation about how we could help {{companyName}} achieve similar results?\n\nBest regards,\n{{senderName}}',
            delay: 0,
            delayUnit: 'days',
            isActive: true,
            order: 1
          },
          {
            id: '2',
            type: 'email',
            subject: 'Following up on my previous email',
            content: 'Hi {{firstName}},\n\nI wanted to follow up on my previous email about helping {{companyName}} improve efficiency.\n\nI understand you\'re probably busy, but I believe this could be valuable for your team. Would you have 10 minutes this week for a quick call?\n\nBest,\n{{senderName}}',
            delay: 3,
            delayUnit: 'days',
            isActive: true,
            order: 2
          },
          {
            id: '3',
            type: 'call',
            subject: '',
            content: 'Call script:\n\n1. Introduction: "Hi {{firstName}}, this is {{senderName}} from {{companyName}}"\n2. Reference previous emails\n3. Quick value proposition\n4. Ask for meeting\n5. Handle objections\n6. Schedule follow-up if no immediate response',
            delay: 2,
            delayUnit: 'days',
            isActive: true,
            order: 3
          },
          {
            id: '4',
            type: 'email',
            subject: 'One final attempt - {{companyName}} efficiency opportunity',
            content: 'Hi {{firstName}},\n\nThis will be my final email on this topic. I understand you\'re busy and may not have had a chance to review my previous messages.\n\nIf you\'re not interested, no worries at all - just let me know and I\'ll stop reaching out.\n\nHowever, if improving {{companyName}}\'s efficiency by 40% sounds interesting, I\'d love to chat for just 10 minutes.\n\nWhat do you think?\n\nBest regards,\n{{senderName}}',
            delay: 4,
            delayUnit: 'days',
            isActive: true,
            order: 4
          }
        ]);
        setLoading(false);
      }, 500);
    };

    fetchSteps();
  }, [sequenceId]);

  const addStep = () => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type: 'email',
      subject: '',
      content: '',
      delay: 1,
      delayUnit: 'days',
      isActive: true,
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
    setEditingStep(newStep.id);
  };

  const updateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const removeStep = (stepId: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== stepId));
    }
  };

  const duplicateStep = (stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (stepToDuplicate) {
      const newStep: SequenceStep = {
        ...stepToDuplicate,
        id: Date.now().toString(),
        order: steps.length + 1,
        subject: stepToDuplicate.subject ? `${stepToDuplicate.subject} (Copy)` : ''
      };
      setSteps([...steps, newStep]);
    }
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && index > 0) || 
      (direction === 'down' && index < steps.length - 1)
    ) {
      const newSteps = [...steps];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      
      // Update order values
      newSteps.forEach((step, idx) => {
        step.order = idx + 1;
      });
      
      setSteps(newSteps);
    }
  };

  const saveSteps = async () => {
    setSaving(true);
    // TODO: API call to save steps
    setTimeout(() => {
      setSaving(false);
      setEditingStep(null);
    }, 1000);
  };

  const getStepIcon = (type: string, isActive: boolean = true) => {
    const iconClass = `h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`;
    switch (type) {
      case 'email': return <Mail className={iconClass} />;
      case 'call': return <Phone className={iconClass} />;
      case 'task': return <CheckCircle className={iconClass} />;
      case 'linkedin': return <Users className={iconClass} />;
      default: return <Mail className={iconClass} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Sequence Steps</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {steps.length} steps
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              previewMode 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            data-testid="button-toggle-preview"
          >
            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
          </button>
          
          <button
            onClick={addStep}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="button-add-step"
          >
            <Plus className="h-4 w-4" />
            <span>Add Step</span>
          </button>
          
          <button
            onClick={saveSteps}
            disabled={saving}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            data-testid="button-save-steps"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`bg-white rounded-lg border-2 transition-all duration-200 ${
                editingStep === step.id 
                  ? 'border-blue-300 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              data-testid={`step-${step.id}`}
            >
              {/* Step Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  {/* Drag Handle */}
                  <div className="cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  {/* Step Info */}
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      step.isActive ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {getStepIcon(step.type, step.isActive)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">Step {index + 1}</span>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          step.type === 'email' ? 'bg-blue-100 text-blue-800' :
                          step.type === 'call' ? 'bg-green-100 text-green-800' :
                          step.type === 'task' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {step.type}
                        </span>
                        <button
                          onClick={() => updateStep(step.id, { isActive: !step.isActive })}
                          className="p-1 hover:bg-gray-100 rounded"
                          title={step.isActive ? 'Deactivate step' : 'Activate step'}
                        >
                          {step.isActive ? (
                            <Pause className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Play className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                      
                      {index > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {step.delay} {step.delayUnit} after previous step
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveStep(step.id, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => moveStep(step.id, 'down')}
                    disabled={index === steps.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
                    className={`p-1 hover:bg-gray-100 rounded ${
                      editingStep === step.id ? 'text-blue-600' : 'text-gray-600'
                    }`}
                    title="Edit step"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => duplicateStep(step.id)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                    title="Duplicate step"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => removeStep(step.id)}
                    disabled={steps.length === 1}
                    className="p-1 hover:bg-gray-100 rounded text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete step"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-4">
                {editingStep === step.id ? (
                  <EditStepForm
                    step={step}
                    onUpdate={(updates) => updateStep(step.id, updates)}
                    onSave={() => setEditingStep(null)}
                    isFirstStep={index === 0}
                  />
                ) : (
                  <StepPreview step={step} previewMode={previewMode} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {steps.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No steps yet</h3>
          <p className="text-gray-600 mb-6">Add your first step to start building your sequence.</p>
          <button
            onClick={addStep}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add First Step
          </button>
        </div>
      )}
    </div>
  );
};

// Edit Step Form Component
const EditStepForm: React.FC<{
  step: SequenceStep;
  onUpdate: (updates: Partial<SequenceStep>) => void;
  onSave: () => void;
  isFirstStep: boolean;
}> = ({ step, onUpdate, onSave, isFirstStep }) => {
  return (
    <div className="space-y-4">
      {/* Step Type and Timing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Step Type
          </label>
          <select
            value={step.type}
            onChange={(e) => onUpdate({ type: e.target.value as SequenceStep['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="task">Task</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>

        {!isFirstStep && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay
              </label>
              <input
                type="number"
                value={step.delay}
                onChange={(e) => onUpdate({ delay: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={step.delayUnit}
                onChange={(e) => onUpdate({ delayUnit: e.target.value as 'hours' | 'days' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Subject Line for Email */}
      {step.type === 'email' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Line
          </label>
          <input
            type="text"
            value={step.subject || ''}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            placeholder="Email subject line"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {step.type === 'email' ? 'Email Content' :
           step.type === 'call' ? 'Call Script' :
           step.type === 'task' ? 'Task Description' :
           'LinkedIn Message'}
        </label>
        <textarea
          value={step.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder={
            step.type === 'email' ? 'Email content with personalization variables like {{firstName}}, {{companyName}}, etc.' :
            step.type === 'call' ? 'Call script or talking points' :
            step.type === 'task' ? 'Task description and instructions' :
            'LinkedIn connection request or message'
          }
          rows={step.type === 'email' ? 10 : 6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
        
        {step.type === 'email' && (
          <div className="mt-2 text-xs text-gray-600">
            <p>Available variables: {{firstName}}, {{lastName}}, {{companyName}}, {{industry}}, {{senderName}}, {{senderCompany}}</p>
          </div>
        )}
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Step Preview Component
const StepPreview: React.FC<{ step: SequenceStep; previewMode: boolean }> = ({ step, previewMode }) => {
  if (previewMode) {
    // Show rendered preview with sample data
    const sampleData = {
      firstName: 'John',
      lastName: 'Smith',
      companyName: 'Acme Corp',
      industry: 'Technology',
      senderName: 'Sarah Johnson',
      senderCompany: 'YourCompany'
    };

    const renderContent = (content: string) => {
      let rendered = content;
      Object.entries(sampleData).forEach(([key, value]) => {
        rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
      return rendered;
    };

    return (
      <div className="space-y-3">
        {step.type === 'email' && step.subject && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subject:</label>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
              {renderContent(step.subject)}
            </p>
          </div>
        )}
        
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Content:</label>
          <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
            {renderContent(step.content)}
          </div>
        </div>
      </div>
    );
  }

  // Show raw content with variables
  return (
    <div className="space-y-3">
      {step.type === 'email' && step.subject && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Subject:</label>
          <p className="text-sm text-gray-900">{step.subject}</p>
        </div>
      )}
      
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Content:</label>
        <div className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
          {step.content}
        </div>
      </div>
      
      {step.content.length > 200 && (
        <p className="text-xs text-gray-500">Click edit to see full content...</p>
      )}
    </div>
  );
};

export default SequenceStepManager;