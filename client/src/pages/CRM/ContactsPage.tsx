import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, Building, Calendar, CheckSquare, Square, Trash2 } from 'lucide-react';
import BulkActionsDropdown from '../../components/CRM/BulkActionsDropdown';
import { apiRequest } from '../../lib/queryClient';

const ContactsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/contacts'],
  });
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const deleteContactsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiRequest('/api/contacts', {
        method: 'DELETE',
        body: { ids }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      setSelectedContacts([]);
      setIsSelectionMode(false);
    }
  });

  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const leadsArray = Array.isArray(leads) ? leads : [];

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contactsArray.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contactsArray.map((contact: any) => contact.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedContacts.length > 0 && window.confirm(`Delete ${selectedContacts.length} selected contacts?`)) {
      deleteContactsMutation.mutate(selectedContacts);
    }
  };

  const handleBulkTransfer = () => {
    alert(`Bulk Transfer feature for ${selectedContacts.length} contacts - Coming Soon!`);
  };

  const handleBulkUpdate = () => {
    alert(`Bulk Update feature for ${selectedContacts.length} contacts - Coming Soon!`);
  };

  const handleBulkEmail = () => {
    alert(`Bulk Email feature for ${selectedContacts.length} contacts - Coming Soon!`);
  };

  const handlePrintView = () => {
    alert(`Print View feature for ${selectedContacts.length} contacts - Coming Soon!`);
  };

  if (contactsLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading contacts...</div>
      </div>
    );
  }

  if (!contactsArray.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Contacts</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-500">No contacts found. Create your first contact to get started.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts ({contactsArray.length})</h1>
        <div className="flex space-x-3">
          {isSelectionMode ? (
            <>
              <button
                onClick={handleSelectAll}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                {selectedContacts.length === contactsArray.length ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
                Select All
              </button>
              <BulkActionsDropdown
                selectedItems={selectedContacts}
                itemType="contacts"
                onBulkTransfer={handleBulkTransfer}
                onBulkUpdate={handleBulkUpdate}
                onBulkDelete={handleDeleteSelected}
                onBulkEmail={handleBulkEmail}
                onPrintView={handlePrintView}
                isVisible={true}
              />
              <button
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedContacts([]);
                }}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelectionMode(true)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Select
              </button>
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                Add Contact
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactsArray.map((contact: any) => (
          <div
            key={contact.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {isSelectionMode && (
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => handleSelectContact(contact.id)}
                  className="mr-2"
                />
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</h3>
                <p className="text-sm text-gray-600">{contact.position}</p>
                {contact.department && (
                  <p className="text-xs text-gray-500">{contact.department}</p>
                )}
              </div>
              {contact.isPrimary && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Primary
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.mobile && contact.mobile !== contact.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{contact.mobile} (Mobile)</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                contact.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {contact.status?.charAt(0).toUpperCase() + contact.status?.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(contact.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPage;