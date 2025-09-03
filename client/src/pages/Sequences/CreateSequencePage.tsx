import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, ArrowRight, Mail, Phone, Target, Calendar, Clock,
  Users, Settings, Plus, X, AlertCircle, CheckCircle,
  Edit3, Copy, Trash2, ArrowUp, ArrowDown, GripVertical
} from 'lucide-react';
import { navigateTo } from '../../utils/navigation';

interface SequenceStep {
  id: string;
  type: 'email' | 'call' | 'task' | 'linkedin';
  subject?: string;
  content: string;
  delay: number;
  delayUnit: 'hours' | 'days';
  isActive: boolean;
}

/**
 * Create Sequence Page - Apollo.io inspired design
 * Features: Step-by-step creation, drag-and-drop reordering, live preview
 * TODO: Connect to backend API for sequence creation
 */
const CreateSequencePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sequenceName, setSequenceName] = useState('');
  const [sequenceDescription, setSequenceDescription] = useState('');
  const [sequenceGoal, setSequenceGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [steps, setSteps] = useState<SequenceStep[]>([
    {
      id: '1',
      type: 'email',
      subject: 'Quick introduction and value proposition',
      content: 'Hi {{firstName}},\n\nI noticed that {{companyName}} is growing rapidly in the {{industry}} space. We\'ve helped similar companies like yours increase their efficiency by 40%.\n\nWould you be open to a 15-minute conversation about how we could help {{companyName}} achieve similar results?\n\nBest regards,\n{{senderName}}',
      delay: 0,
      delayUnit: 'days',
      isActive: true
    }
  ]);
  const [settings, setSettings] = useState({
    sendingSchedule: 'business_days',
    timezone: 'EST',
    dailyLimit: 50,
    weeklyLimit: 200,
    autoStop: true,
    autoStopReplies: true,
    trackOpens: true,
    trackClicks: true
  });

  const stepTitles = [
    'Basic Information',
    'Sequence Steps', 
    'Settings & Schedule',
    'Review & Launch'
  ];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addStep = () => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type: 'email',
      subject: '',
      content: '',
      delay: 1,
      delayUnit: 'days',
      isActive: true
    };
    setSteps([...steps, newStep]);
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

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && index > 0) || 
      (direction === 'down' && index < steps.length - 1)
    ) {
      const newSteps = [...steps];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      setSteps(newSteps);
    }
  };

  const handleSave = async (action: 'save' | 'launch') => {
    // TODO: Implement save functionality with backend API
    const sequenceData = {
      name: sequenceName,
      description: sequenceDescription,
      goal: sequenceGoal,
      targetAudience,
      tags,
      steps,
      settings,
      status: action === 'launch' ? 'active' : 'draft'
    };

    console.log('Saving sequence:', sequenceData);
    
    // Simulate API call
    setTimeout(() => {
      navigateTo('/sequences');
    }, 1000);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      case 'linkedin': return <Users className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const isStepValid = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return sequenceName.trim() && sequenceDescription.trim();
      case 2:
        return steps.length > 0 && steps.every(step => step.content.trim());
      case 3:
        return true; // Settings have defaults
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => {
              const stepNum = index + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              const isValid = isStepValid(stepNum);
              
              return (
                <div key={stepNum} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted ? 'bg-green-600 border-green-600 text-white' :
                    isCurrent ? 'bg-blue-600 border-blue-600 text-white' :
                    'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{stepNum}</span>
                    )}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className={`text-sm font-medium ${
                      isCurrent ? 'text-blue-600' : 
                      isCompleted ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {title}
                    </p>
                  </div>
                  {index < stepTitles.length - 1 && (
                    <div className={`flex-1 mx-4 h-0.5 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-8"
        >
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Set up the foundation of your sequence.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sequence Name *
                    </label>
                    <input
                      type="text"
                      value={sequenceName}
                      onChange={(e) => setSequenceName(e.target.value)}
                      placeholder="e.g., SaaS Demo Follow-up"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-testid="input-sequence-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={sequenceDescription}
                      onChange={(e) => setSequenceDescription(e.target.value)}
                      placeholder="Brief description of this sequence's purpose"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-testid="textarea-sequence-description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Goal
                    </label>
                    <input
                      type="text"
                      value={sequenceGoal}
                      onChange={(e) => setSequenceGoal(e.target.value)}
                      placeholder="e.g., Book demo meetings with qualified prospects"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-testid="input-sequence-goal"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <textarea
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Describe your ideal prospect for this sequence"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-testid="textarea-target-audience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add a tag"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        data-testid="input-new-tag"
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        data-testid="button-add-tag"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Sequence Steps */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Sequence Steps</h2>
                  <p className="text-gray-600">Design your engagement sequence.</p>
                </div>
                <button
                  onClick={addStep}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  data-testid="button-add-step"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          <span className="text-sm font-medium text-gray-600">Step {index + 1}</span>
                        </div>
                        
                        <select
                          value={step.type}
                          onChange={(e) => updateStep(step.id, { type: e.target.value as SequenceStep['type'] })}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="email">Email</option>
                          <option value="call">Call</option>
                          <option value="task">Task</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>

                        {index > 0 && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <input
                              type="number"
                              value={step.delay}
                              onChange={(e) => updateStep(step.id, { delay: parseInt(e.target.value) || 0 })}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                            />
                            <select
                              value={step.delayUnit}
                              onChange={(e) => updateStep(step.id, { delayUnit: e.target.value as 'hours' | 'days' })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="hours">hours</option>
                              <option value="days">days</option>
                            </select>
                            <span>after previous step</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === steps.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeStep(step.id)}
                          disabled={steps.length === 1}
                          className="p-1 hover:bg-gray-200 rounded text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {step.type === 'email' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject Line
                          </label>
                          <input
                            type="text"
                            value={step.subject || ''}
                            onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                            placeholder="Email subject line"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Content
                          </label>
                          <textarea
                            value={step.content}
                            onChange={(e) => updateStep(step.id, { content: e.target.value })}
                            placeholder="Email content with personalization variables like {{firstName}}, {{companyName}}, etc."
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {step.type === 'call' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Call Script / Notes
                        </label>
                        <textarea
                          value={step.content}
                          onChange={(e) => updateStep(step.id, { content: e.target.value })}
                          placeholder="Call script or talking points"
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    {step.type === 'task' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Task Description
                        </label>
                        <textarea
                          value={step.content}
                          onChange={(e) => updateStep(step.id, { content: e.target.value })}
                          placeholder="Describe the task to be completed"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}

                    {step.type === 'linkedin' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn Message
                        </label>
                        <textarea
                          value={step.content}
                          onChange={(e) => updateStep(step.id, { content: e.target.value })}
                          placeholder="LinkedIn connection request or message"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings & Schedule</h2>
                <p className="text-gray-600">Configure how your sequence will run.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sending Schedule</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          When to Send
                        </label>
                        <select
                          value={settings.sendingSchedule}
                          onChange={(e) => setSettings({ ...settings, sendingSchedule: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="business_days">Business days only (Mon-Fri)</option>
                          <option value="all_days">All days (Mon-Sun)</option>
                          <option value="custom">Custom schedule</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="EST">Eastern Time (EST)</option>
                          <option value="CST">Central Time (CST)</option>
                          <option value="MST">Mountain Time (MST)</option>
                          <option value="PST">Pacific Time (PST)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sending Limits</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Limit
                        </label>
                        <input
                          type="number"
                          value={settings.dailyLimit}
                          onChange={(e) => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                          max="500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weekly Limit
                        </label>
                        <input
                          type="number"
                          value={settings.weeklyLimit}
                          onChange={(e) => setSettings({ ...settings, weeklyLimit: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                          max="2000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Rules</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.autoStopReplies}
                          onChange={(e) => setSettings({ ...settings, autoStopReplies: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Auto-stop on reply</span>
                          <p className="text-xs text-gray-600">Stop sequence when prospect replies</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.autoStop}
                          onChange={(e) => setSettings({ ...settings, autoStop: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Auto-stop on bounce</span>
                          <p className="text-xs text-gray-600">Stop sequence if email bounces</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.trackOpens}
                          onChange={(e) => setSettings({ ...settings, trackOpens: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Track email opens</span>
                          <p className="text-xs text-gray-600">Monitor when emails are opened</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.trackClicks}
                          onChange={(e) => setSettings({ ...settings, trackClicks: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Track link clicks</span>
                          <p className="text-xs text-gray-600">Monitor when links are clicked</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Launch</h2>
                <p className="text-gray-600">Review your sequence before saving or launching.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Sequence Overview */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequence Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900">{sequenceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Steps:</span>
                        <span className="text-sm font-medium text-gray-900">{steps.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tags:</span>
                        <span className="text-sm font-medium text-gray-900">{tags.join(', ') || 'None'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Steps Preview */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps Preview</h3>
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                            {getStepIcon(step.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">Step {index + 1}</span>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                                {step.type}
                              </span>
                              {index > 0 && (
                                <span className="text-xs text-gray-500">
                                  {step.delay} {step.delayUnit} after
                                </span>
                              )}
                            </div>
                            {step.subject && (
                              <p className="text-sm text-gray-900 font-medium mb-1">{step.subject}</p>
                            )}
                            <p className="text-sm text-gray-600 line-clamp-2">{step.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings Summary */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Schedule:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {settings.sendingSchedule.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Timezone:</span>
                        <p className="text-sm font-medium text-gray-900">{settings.timezone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Daily Limit:</span>
                        <p className="text-sm font-medium text-gray-900">{settings.dailyLimit} emails</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Auto-stop on reply:</span>
                        <p className="text-sm font-medium text-gray-900">
                          {settings.autoStopReplies ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Ready to Launch?</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          You can save as draft to edit later, or launch immediately to start the sequence.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep === 4 ? (
              <>
                <button
                  onClick={() => handleSave('save')}
                  className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="button-save-draft"
                >
                  <Save className="h-4 w-4" />
                  <span>Save as Draft</span>
                </button>
                <button
                  onClick={() => handleSave('launch')}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  data-testid="button-launch-sequence"
                >
                  <Target className="h-4 w-4" />
                  <span>Launch Sequence</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={!isStepValid(currentStep)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-next-step"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSequencePage;