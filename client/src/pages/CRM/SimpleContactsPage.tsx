import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Building, MapPin, Plus, Filter, Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  accountId?: string;
  account?: {
    name: string;
  };
  address?: string | { street?: string; city?: string; state?: string; zip?: string; country?: string };
  notes?: string;
  createdAt: string;
}

const SimpleContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        console.log('🚀 Fetching contacts...');
        const response = await fetch('/api/contacts');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Contacts loaded:', data.length);
        setContacts(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Contacts</h1>
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Contacts</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">{contacts.length} contacts found</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
            <div>Contact</div>
            <div>Company</div>
            <div>Contact Info</div>
            <div>Actions</div>
          </div>
        </div>

        <div className="divide-y">
          {contacts.map((contact) => (
            <div key={contact.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="grid grid-cols-4 gap-4 items-center">
                {/* Contact */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.title || 'No title'}</p>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {contact.account?.name || 'No company'}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-1">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {typeof contact.address === 'string' 
                          ? contact.address 
                          : typeof contact.address === 'object' && contact.address
                            ? `${contact.address.street || ''} ${contact.address.city || ''} ${contact.address.state || ''} ${contact.address.zip || ''}`.trim()
                            : 'Address not available'
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                    View
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {contacts.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600 mb-4">Start by adding your first contact.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Contact
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleContactsPage;