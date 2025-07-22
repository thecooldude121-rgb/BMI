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

  // Group contacts by industry for better organization
  const allContacts = [...contactsArray, ...leadsArray];
  const contactsByIndustry = allContacts.reduce((acc: any, contact: any) => {
    const industry = contact.industry || 'Other';
    if (!acc[industry]) {
      acc[industry] = [];
    }
    acc[industry].push(contact);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
          <p className="text-gray-600">{allContacts.length} total contacts</p>
        </div>
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
            <button
              onClick={() => setIsSelectionMode(true)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Select
            </button>
          )}
        </div>
      </div>

      {/* Industry Groups */}
      {Object.entries(contactsByIndustry).map(([industry, contacts]) => (
        <div key={industry} className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {industry} ({(contacts as any[]).length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {(contacts as any[]).map((contact: any) => (
              <div key={contact.id} className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {isSelectionMode && contactsArray.some((c: any) => c.id === contact.id) && (
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => handleSelectContact(contact.id)}
                      className="p-1 bg-white rounded-md shadow-md border border-gray-300 hover:bg-gray-50"
                    >
                      {selectedContacts.includes(contact.id) ? 
                        <CheckSquare className="h-4 w-4 text-blue-600" /> : 
                        <Square className="h-4 w-4 text-gray-400" />
                      }
                    </button>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {contact.name || (contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact')}
                    </h4>
                    <p className="text-sm text-gray-600">{contact.position || 'No position'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    contact.stage === 'won' 
                      ? 'bg-green-100 text-green-800'
                      : contact.stage === 'qualified'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.stage}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    {contact.company || 'No company'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                      {contact.email || 'No email'}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                      {contact.phone || 'No phone'}
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Added {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'Unknown date'}
                  </div>
                </div>

                {contact.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 line-clamp-2">{contact.notes}</p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Score: <span className="font-medium">{contact.score}</span>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    ${contact.value.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsPage;