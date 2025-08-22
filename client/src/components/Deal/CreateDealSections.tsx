import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Building,
  User,
  DollarSign,
  Calendar,
  Globe,
  Phone,
  Package,
  Mail,
  CheckSquare,
  FileText,
  Plus,
  HelpCircle,
  Wand2,
  Activity,
  CheckCircle
} from 'lucide-react';

// Define interfaces for the form data
interface DealFormData {
  name: string;
  accountId: string;
  accountName: string;
  contactId: string;
  contactName: string;
  amount: string;
  currency: string;
  closingDate: string;
  stage: string;
  probability: number;
  ownerId: string;
  dealType: string;
  country: string;
  pipeline: string;
  description: string;
  nextStep: string;
  products: string[];
  platformFee: string;
  customFee: string;
  licenseFee: string;
  onboardingFee: string;
  source: string;
  competitorIds: string[];
  tags: string[];
  priority: string;
}

interface ValidationErrors {
  [key: string]: string;
}

// Field component with validation and tooltip
const FormField: React.FC<{
  label: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, tooltip, error, children }) => (
  <div className="space-y-1">
    <div className="flex items-center space-x-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {tooltip && (
        <div className="group relative">
          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {tooltip}
          </div>
        </div>
      )}
    </div>
    {children}
    {error && (
      <p className="text-sm text-red-600 flex items-center space-x-1">
        <span>⚠</span>
        <span>{error}</span>
      </p>
    )}
  </div>
);

// Smart dropdown with search
const SmartDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: any[];
  placeholder: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  displayField: string;
  valueField: string;
  renderOption?: (option: any) => React.ReactNode;
  'data-testid'?: string;
}> = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  searchTerm, 
  onSearchChange, 
  displayField, 
  valueField,
  renderOption,
  'data-testid': testId
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  React.useEffect(() => {
    const filtered = options.filter(option => 
      option[displayField].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [options, searchTerm, displayField]);

  const selectedOption = options.find(option => option[valueField] === value);

  return (
    <div className="relative">
      <div 
        className="flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={selectedOption ? selectedOption[displayField] : placeholder}
          className="flex-1 outline-none"
          onFocus={() => setIsOpen(true)}
          data-testid={testId}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option[valueField]}
                onClick={() => {
                  onChange(option[valueField]);
                  onSearchChange(option[displayField]);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                data-testid={`option-${option[valueField]}`}
              >
                {renderOption ? renderOption(option) : (
                  <div>
                    <div className="font-medium text-gray-900">{option[displayField]}</div>
                    {option.email && (
                      <div className="text-sm text-gray-500">{option.email}</div>
                    )}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              <p>No options found</p>
              <button className="text-blue-600 text-sm mt-1 hover:underline">
                + Create new
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Basic Information Section
export const BasicInformationSection: React.FC<{
  formData: DealFormData;
  handleFieldChange: (field: keyof DealFormData, value: any) => void;
  validationErrors: ValidationErrors;
  accounts: any[];
  contacts: any[];
  accountSearchTerm: string;
  setAccountSearchTerm: (value: string) => void;
  contactSearchTerm: string;
  setContactSearchTerm: (value: string) => void;
}> = ({ 
  formData, 
  handleFieldChange, 
  validationErrors, 
  accounts, 
  contacts,
  accountSearchTerm,
  setAccountSearchTerm,
  contactSearchTerm,
  setContactSearchTerm
}) => {
  const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const DEAL_STAGES = [
    { id: 'discovery', title: 'Discovery', color: 'bg-blue-500', probability: 10 },
    { id: 'qualification', title: 'Qualification', color: 'bg-purple-500', probability: 25 },
    { id: 'proposal', title: 'Proposal', color: 'bg-yellow-500', probability: 50 },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500', probability: 75 },
    { id: 'closed-won', title: 'Closed Won', color: 'bg-green-500', probability: 100 },
    { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-500', probability: 0 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Deal Name */}
      <div className="md:col-span-2">
        <FormField 
          label="Deal Name" 
          required 
          tooltip="A descriptive name for this deal opportunity"
          error={validationErrors.name}
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="e.g. Acme Corp - Enterprise License"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="deal-name"
          />
        </FormField>
      </div>

      {/* Account */}
      <FormField 
        label="Account" 
        required 
        tooltip="The company or organization this deal is with"
        error={validationErrors.accountName}
      >
        <SmartDropdown
          value={formData.accountId}
          onChange={(value) => {
            handleFieldChange('accountId', value);
            const account = accounts.find(a => a.id === value);
            if (account) {
              handleFieldChange('accountName', account.name);
            }
          }}
          options={accounts}
          placeholder="Search for an account..."
          searchTerm={accountSearchTerm}
          onSearchChange={setAccountSearchTerm}
          displayField="name"
          valueField="id"
          data-testid="account-search"
          renderOption={(account) => (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{account.name}</div>
                <div className="text-sm text-gray-500">{account.industry || 'No industry'}</div>
              </div>
            </div>
          )}
        />
      </FormField>

      {/* Contact */}
      <FormField 
        label="Primary Contact" 
        tooltip="The main contact person for this deal"
      >
        <SmartDropdown
          value={formData.contactId}
          onChange={(value) => {
            handleFieldChange('contactId', value);
            const contact = contacts.find(c => c.id === value);
            if (contact) {
              handleFieldChange('contactName', `${contact.firstName} ${contact.lastName}`);
            }
          }}
          options={contacts}
          placeholder="Search for a contact..."
          searchTerm={contactSearchTerm}
          onSearchChange={setContactSearchTerm}
          displayField="firstName"
          valueField="id"
          data-testid="contact-search"
          renderOption={(contact) => (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {contact.firstName} {contact.lastName}
                </div>
                <div className="text-sm text-gray-500">{contact.email}</div>
              </div>
            </div>
          )}
        />
      </FormField>

      {/* Deal Value */}
      <FormField 
        label="Deal Value" 
        required 
        tooltip="The monetary value of this deal"
        error={validationErrors.amount}
      >
        <div className="flex space-x-2">
          <select
            value={formData.currency}
            onChange={(e) => handleFieldChange('currency', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="currency-select"
          >
            {CURRENCIES.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleFieldChange('amount', e.target.value)}
            placeholder="0.00"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.01"
            data-testid="deal-amount"
          />
        </div>
      </FormField>

      {/* Closing Date */}
      <FormField 
        label="Expected Closing Date" 
        required 
        tooltip="When do you expect to close this deal?"
        error={validationErrors.closingDate}
      >
        <input
          type="date"
          value={formData.closingDate}
          onChange={(e) => handleFieldChange('closingDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="closing-date"
        />
      </FormField>

      {/* Deal Stage */}
      <FormField 
        label="Deal Stage" 
        required 
        tooltip="Current stage of the deal in your sales process"
      >
        <select
          value={formData.stage}
          onChange={(e) => handleFieldChange('stage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="deal-stage"
        >
          {DEAL_STAGES.map(stage => (
            <option key={stage.id} value={stage.id}>
              {stage.title} ({stage.probability}% probability)
            </option>
          ))}
        </select>
      </FormField>

      {/* Probability */}
      <FormField 
        label="Win Probability" 
        tooltip="Likelihood of winning this deal (0-100%)"
      >
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => handleFieldChange('probability', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            data-testid="probability-slider"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span className="font-medium text-gray-900">{formData.probability}%</span>
            <span>100%</span>
          </div>
        </div>
      </FormField>
    </div>
  );
};

// Ownership Section
export const OwnershipSection: React.FC<{
  formData: DealFormData;
  handleFieldChange: (field: keyof DealFormData, value: any) => void;
  users: any[];
}> = ({ formData, handleFieldChange, users }) => {
  const DEAL_TYPES = [
    { value: 'new_business', label: 'New Business' },
    { value: 'existing_business', label: 'Existing Business' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'expansion', label: 'Expansion' },
    { value: 'upsell', label: 'Upsell' },
    { value: 'cross_sell', label: 'Cross-sell' }
  ];

  const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Deal Owner */}
      <FormField 
        label="Deal Owner" 
        required 
        tooltip="Person responsible for managing this deal"
      >
        <select
          value={formData.ownerId}
          onChange={(e) => handleFieldChange('ownerId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="deal-owner"
        >
          <option value="">Select owner...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} ({user.role})
            </option>
          ))}
        </select>
      </FormField>

      {/* Deal Type */}
      <FormField 
        label="Deal Type" 
        tooltip="Classification of this deal opportunity"
      >
        <select
          value={formData.dealType}
          onChange={(e) => handleFieldChange('dealType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="deal-type"
        >
          {DEAL_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </FormField>

      {/* Country */}
      <FormField 
        label="Country" 
        tooltip="Primary country for this deal"
      >
        <select
          value={formData.country}
          onChange={(e) => handleFieldChange('country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="deal-country"
        >
          <option value="">Select country...</option>
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </FormField>

      {/* Pipeline */}
      <FormField 
        label="Pipeline" 
        tooltip="Sales pipeline this deal belongs to"
      >
        <select
          value={formData.pipeline}
          onChange={(e) => handleFieldChange('pipeline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="deal-pipeline"
        >
          <option value="sales">Sales Pipeline</option>
          <option value="enterprise">Enterprise Pipeline</option>
          <option value="partner">Partner Pipeline</option>
        </select>
      </FormField>
    </div>
  );
};

// Details Section
export const DetailsSection: React.FC<{
  formData: DealFormData;
  handleFieldChange: (field: keyof DealFormData, value: any) => void;
}> = ({ formData, handleFieldChange }) => {
  const PRIORITIES = [
    { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Description */}
      <FormField 
        label="Deal Description" 
        tooltip="Detailed description of this deal opportunity"
      >
        <textarea
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Describe the deal details, requirements, and opportunity..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          data-testid="deal-description"
        />
      </FormField>

      {/* Next Steps */}
      <FormField 
        label="Next Steps" 
        tooltip="What are the immediate next actions for this deal?"
      >
        <input
          type="text"
          value={formData.nextStep}
          onChange={(e) => handleFieldChange('nextStep', e.target.value)}
          placeholder="e.g. Schedule demo, send proposal, follow up with decision maker..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="next-steps"
        />
      </FormField>

      {/* Priority */}
      <FormField 
        label="Priority Level" 
        tooltip="How important is this deal to your business?"
      >
        <div className="grid grid-cols-2 gap-3">
          {PRIORITIES.map(priority => (
            <button
              key={priority.value}
              type="button"
              onClick={() => handleFieldChange('priority', priority.value)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                formData.priority === priority.value
                  ? `${priority.color} ring-2 ring-blue-500`
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              data-testid={`priority-${priority.value}`}
            >
              {priority.label}
            </button>
          ))}
        </div>
      </FormField>

      {/* Products */}
      <FormField 
        label="Products/Services" 
        tooltip="What products or services are included in this deal?"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {formData.products.map((product, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {product}
                <button
                  onClick={() => {
                    const newProducts = [...formData.products];
                    newProducts.splice(index, 1);
                    handleFieldChange('products', newProducts);
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add product or service..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    handleFieldChange('products', [...formData.products, input.value.trim()]);
                    input.value = '';
                  }
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="add-product"
            />
            <button
              type="button"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FormField>
    </div>
  );
};

// Fees Section
export const FeesSection: React.FC<{
  formData: DealFormData;
  handleFieldChange: (field: keyof DealFormData, value: any) => void;
}> = ({ formData, handleFieldChange }) => {
  const feeFields = [
    { 
      key: 'platformFee' as keyof DealFormData, 
      label: 'Platform Fee', 
      tooltip: 'Monthly or yearly platform usage fee',
      icon: Package
    },
    { 
      key: 'customFee' as keyof DealFormData, 
      label: 'Customization Fee', 
      tooltip: 'One-time fee for custom development or setup',
      icon: DollarSign
    },
    { 
      key: 'licenseFee' as keyof DealFormData, 
      label: 'License Fee', 
      tooltip: 'Software licensing or usage rights fee',
      icon: CheckCircle
    },
    { 
      key: 'onboardingFee' as keyof DealFormData, 
      label: 'Onboarding Fee', 
      tooltip: 'Implementation and training costs',
      icon: User
    }
  ];

  const totalFees = feeFields.reduce((sum, field) => {
    return sum + (parseFloat(formData[field.key] as string) || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feeFields.map((field) => {
          const Icon = field.icon;
          return (
            <FormField 
              key={field.key}
              label={field.label} 
              tooltip={field.tooltip}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData[field.key]}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  data-testid={field.key}
                />
              </div>
            </FormField>
          );
        })}
      </div>

      {/* Total Summary */}
      {totalFees > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Additional Fees:</span>
            <span className="text-lg font-semibold text-gray-900">
              ${formData.currency} {totalFees.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            This is in addition to the main deal value of ${formData.currency} {formData.amount}
          </div>
        </div>
      )}
    </div>
  );
};

// Activities Section
export const ActivitiesSection: React.FC<{
  formData: DealFormData;
  handleFieldChange: (field: keyof DealFormData, value: any) => void;
}> = ({ formData, handleFieldChange }) => {
  const [newActivity, setNewActivity] = React.useState({ type: 'task', title: '', dueDate: '' });

  const ACTIVITY_TYPES = [
    { value: 'task', label: 'Task', icon: CheckCircle },
    { value: 'call', label: 'Call', icon: Phone },
    { value: 'meeting', label: 'Meeting', icon: Calendar }
  ];

  const suggestedActivities = [
    { type: 'call', title: 'Schedule discovery call', dueDate: '+1 day' },
    { type: 'meeting', title: 'Product demonstration', dueDate: '+1 week' },
    { type: 'task', title: 'Send proposal', dueDate: '+3 days' },
    { type: 'task', title: 'Follow up on decision', dueDate: '+2 weeks' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Suggestions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Wand2 className="w-5 h-5 text-purple-600" />
          <h4 className="font-medium text-gray-900">Suggested Activities</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedActivities.map((activity, index) => (
            <button
              key={index}
              type="button"
              className="text-left p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
              onClick={() => {
                // Add suggested activity logic here
              }}
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">{activity.title}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {activity.type} • Due {activity.dueDate}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Activity */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Add Custom Activity</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={newActivity.type}
            onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ACTIVITY_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Activity description"
            value={newActivity.title}
            onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              value={newActivity.dueDate}
              onChange={(e) => setNewActivity(prev => ({ ...prev, dueDate: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => {
                if (newActivity.title.trim()) {
                  // Add activity logic here
                  setNewActivity({ type: 'task', title: '', dueDate: '' });
                }
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};