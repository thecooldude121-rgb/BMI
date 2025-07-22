import React, { useState } from 'react';
import { ChevronDown, Mail, Edit, Users, FileText, Printer, Trash2, ArrowRightLeft } from 'lucide-react';

interface BulkActionsDropdownProps {
  selectedItems: string[];
  itemType: 'deals' | 'leads' | 'contacts' | 'accounts';
  onBulkTransfer: () => void;
  onBulkUpdate: () => void;
  onBulkDelete: () => void;
  onBulkEmail: () => void;
  onPrintView: () => void;
  isVisible: boolean;
}

const BulkActionsDropdown: React.FC<BulkActionsDropdownProps> = ({
  selectedItems,
  itemType,
  onBulkTransfer,
  onBulkUpdate,
  onBulkDelete,
  onBulkEmail,
  onPrintView,
  isVisible
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible || selectedItems.length === 0) {
    return null;
  }

  const actions = [
    {
      label: 'Bulk Transfer',
      icon: ArrowRightLeft,
      onClick: onBulkTransfer,
      description: `Transfer ${selectedItems.length} ${itemType} to another owner`
    },
    {
      label: 'Bulk Update',
      icon: Edit,
      onClick: onBulkUpdate,
      description: `Update properties of ${selectedItems.length} ${itemType}`
    },
    {
      label: 'Send Emails',
      icon: Mail,
      onClick: onBulkEmail,
      description: `Send emails to ${selectedItems.length} ${itemType}`
    },
    {
      label: 'Print View',
      icon: Printer,
      onClick: onPrintView,
      description: `Print report for ${selectedItems.length} ${itemType}`
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: onBulkDelete,
      description: `Delete ${selectedItems.length} ${itemType}`,
      isDestructive: true
    }
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
      >
        <span>Actions ({selectedItems.length})</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Bulk Actions
              </div>
              
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    action.isDestructive ? 'hover:bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <action.icon 
                      className={`h-5 w-5 mt-0.5 ${
                        action.isDestructive ? 'text-red-600' : 'text-gray-400'
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        action.isDestructive ? 'text-red-900' : 'text-gray-900'
                      }`}>
                        {action.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkActionsDropdown;