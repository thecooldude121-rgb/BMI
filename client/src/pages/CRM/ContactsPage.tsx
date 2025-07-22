import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, Building, Calendar } from 'lucide-react';

const ContactsPage: React.FC = () => {
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/contacts'],
  });
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
  });

  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const leadsArray = Array.isArray(leads) ? leads : [];

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
      </div>

      {/* Industry Groups */}
      {Object.entries(contactsByIndustry).map(([industry, contacts]) => (
        <div key={industry} className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {industry} ({contacts.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {contacts.map((contact: any) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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