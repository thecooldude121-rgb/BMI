import React from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  FileText, 
  Zap,
  CheckCircle,
  DollarSign,
  Calendar,
  User,
  Building,
  Target,
  AlertCircle
} from 'lucide-react';

interface DealFormData {
  name: string;
  accountName: string;
  contactName: string;
  amount: string;
  currency: string;
  closingDate: string;
  stage: string;
  probability: number;
  pipeline: string;
  dealType: string;
}

interface DealSummaryCardProps {
  formData: DealFormData;
  completionPercentage: number;
  onSubmit: (action: 'create' | 'template' | 'draft') => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

const DealSummaryCard: React.FC<DealSummaryCardProps> = ({
  formData,
  completionPercentage,
  onSubmit,
  isSubmitting,
  errors
}) => {
  const DEAL_STAGES = [
    { id: 'discovery', title: 'Discovery', color: 'bg-blue-500' },
    { id: 'qualification', title: 'Qualification', color: 'bg-purple-500' },
    { id: 'proposal', title: 'Proposal', color: 'bg-yellow-500' },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
    { id: 'closed-won', title: 'Closed Won', color: 'bg-green-500' },
    { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-500' }
  ];

  const currentStage = DEAL_STAGES.find(stage => stage.id === formData.stage);
  const dealValue = parseFloat(formData.amount) || 0;
  const isFormValid = formData.name && formData.accountName && formData.amount && formData.closingDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Deal Summary</h3>
          <div className="text-sm font-medium">{completionPercentage}%</div>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white h-2 rounded-full"
          />
        </div>
      </div>

      {/* Deal Details */}
      <div className="p-4 space-y-4">
        {/* Deal Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {formData.name || 'Untitled Deal'}
            </div>
            {currentStage && (
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${currentStage.color}`} />
                <span className="text-xs text-gray-500">{currentStage.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Account & Contact */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Building className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formData.accountName || 'No account selected'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formData.contactName || 'No contact selected'}
            </span>
          </div>
        </div>

        {/* Deal Value */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-lg font-semibold text-green-900">
                {formData.currency} {dealValue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600">
                {formData.probability}% probability
              </div>
            </div>
          </div>
        </div>

        {/* Closing Date */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {formData.closingDate 
              ? new Date(formData.closingDate).toLocaleDateString()
              : 'No closing date set'
            }
          </span>
        </div>

        {/* Validation Status */}
        {!isFormValid && (
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-sm font-medium text-orange-800">
                  Missing Required Fields
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Complete basic information to create deal
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.submit && (
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-sm font-medium text-red-800">
                  Error Creating Deal
                </div>
                <div className="text-xs text-red-600 mt-1">
                  {errors.submit}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {/* Primary Action */}
          <button
            onClick={() => onSubmit('create')}
            disabled={!isFormValid || isSubmitting}
            className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
              isFormValid && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            data-testid="create-deal-button"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Deal...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Create Deal</span>
              </>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSubmit('draft')}
              disabled={isSubmitting}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
              data-testid="save-draft-button"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            
            <button
              onClick={() => onSubmit('template')}
              disabled={isSubmitting}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
              data-testid="save-template-button"
            >
              <FileText className="w-4 h-4" />
              <span>Template</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Deal Insights</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Expected Revenue:</span>
              <span className="font-medium">
                {formData.currency} {(dealValue * (formData.probability / 100)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Days to Close:</span>
              <span className="font-medium">
                {formData.closingDate 
                  ? Math.max(0, Math.ceil((new Date(formData.closingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                  : '-'
                } days
              </span>
            </div>
            <div className="flex justify-between">
              <span>Deal Type:</span>
              <span className="font-medium capitalize">
                {formData.dealType?.replace('_', ' ') || 'New Business'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DealSummaryCard;