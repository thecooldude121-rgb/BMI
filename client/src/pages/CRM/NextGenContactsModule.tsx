import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Users, Search, Filter, Plus, MoreVertical, Building, Phone, Mail, 
  Grid3X3, List, BarChart3, Eye, Edit, Trash2, Star, Target, TrendingUp,
  MessageSquare, Calendar, AlertTriangle, Award, MapPin
} from 'lucide-react';

interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  accountId?: string;
  status?: string;
  relationshipScore?: number;
  engagementStatus?: string;
  leadSource?: string;
  totalActivities?: number;
  responseRate?: string;
  lastTouchDate?: string;
  nextFollowUpDate?: string;
  influenceLevel?: number;
  decisionMaker?: boolean;
  address?: string;
  linkedin?: string;
  twitter?: string;
}

interface Account {
  id: string;
  name: string;
}

const NextGenContactsModule: React.FC = () => {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch contacts and accounts data
  const { data: contacts = [], isLoading, error: contactsError } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    retry: 3,
    retryDelay: 1000
  });

  const { data: accounts = [], error: accountsError } = useQuery<Account[]>({
    queryKey: ['/api/accounts'],
    retry: 3,
    retryDelay: 1000
  });

  // Log errors if they exist
  React.useEffect(() => {
    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
    }
    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
    }
  }, [contactsError, accountsError]);

  // Delete mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return Promise.all(ids.map(id => 
        fetch(`/api/contacts/${id}`, { method: 'DELETE' })
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      setSelectedContacts([]);
    }
  });

  const getAccountName = (accountId?: string) => {
    if (!accountId) return 'No Account';
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Unknown Account';
  };

  const getEngagementColor = (status?: string) => {
    switch (status) {
      case 'highly_engaged': return 'bg-green-100 text-green-800';
      case 'recently_engaged': return 'bg-blue-100 text-blue-800';
      case 'moderately_engaged': return 'bg-yellow-100 text-yellow-800';
      case 'dormant': return 'bg-orange-100 text-orange-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      case 'unresponsive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelationshipIcon = (score?: number) => {
    if (!score) return <Target className="w-4 h-4" />;
    if (score >= 80) return <Award className="w-4 h-4" />;
    if (score >= 60) return <Star className="w-4 h-4" />;
    if (score >= 40) return <TrendingUp className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getInfluenceLevel = (level?: number) => {
    if (!level) return 'Unknown';
    if (level >= 8) return 'High';
    if (level >= 5) return 'Medium';
    return 'Low';
  };

  // Filter contacts
  const filteredContacts = (contacts || []).filter((contact: Contact) => {
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate metrics
  const totalContacts = (contacts || []).length;
  const activeContacts = (contacts || []).filter((c: Contact) => c.status === 'active').length;
  const avgRelationshipScore = (contacts || []).length > 0 
    ? Math.round((contacts || []).reduce((sum: number, c: Contact) => sum + (c.relationshipScore || 50), 0) / (contacts || []).length)
    : 0;
  const highInfluenceContacts = (contacts || []).filter((c: Contact) => (c.influenceLevel || 0) >= 8).length;

  const handleContactClick = (contactId: string) => {
    setLocation(`/crm/contacts/${contactId}`);
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => handleContactClick(contact.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {contact.firstName?.[0]}{contact.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-gray-500">{contact.title || 'Title not specified'}</p>
            <p className="text-xs text-gray-400">{getAccountName(contact.accountId)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {contact.decisionMaker && (
            <div className="p-1 bg-yellow-100 rounded-full">
              <Award className="w-3 h-3 text-yellow-600" />
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleSelectContact(contact.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Relationship Score</p>
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded ${
              (contact.relationshipScore || 0) >= 80 ? 'bg-green-100 text-green-600' :
              (contact.relationshipScore || 0) >= 60 ? 'bg-blue-100 text-blue-600' :
              (contact.relationshipScore || 0) >= 40 ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {getRelationshipIcon(contact.relationshipScore)}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {contact.relationshipScore || 0}/100
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Influence Level</p>
          <p className="text-sm font-medium text-gray-900">
            {getInfluenceLevel(contact.influenceLevel)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(contact.engagementStatus)}`}>
          {contact.engagementStatus?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {contact.email && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${contact.email}`;
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <Mail className="w-4 h-4" />
            </button>
          )}
          {contact.phone && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${contact.phone}`;
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {contact.status?.toUpperCase() || 'UNKNOWN'}
        </span>
      </div>
    </div>
  );

  const ContactListItem = ({ contact }: { contact: Contact }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => handleContactClick(contact.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedContacts.includes(contact.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectContact(contact.id);
            }}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {contact.firstName?.[0]}{contact.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-gray-500">{contact.title || 'Title not specified'}</p>
            <p className="text-xs text-gray-400">{getAccountName(contact.accountId)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{contact.email || 'No email'}</p>
            <p className="text-xs text-gray-500">Email</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{contact.phone || 'No phone'}</p>
            <p className="text-xs text-gray-500">Phone</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded ${
              (contact.relationshipScore || 0) >= 80 ? 'bg-green-100 text-green-600' :
              (contact.relationshipScore || 0) >= 60 ? 'bg-blue-100 text-blue-600' :
              (contact.relationshipScore || 0) >= 40 ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {getRelationshipIcon(contact.relationshipScore)}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {contact.relationshipScore || 0}
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(contact.engagementStatus)}`}>
            {contact.engagementStatus?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {contact.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (contactsError || accountsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Contacts</h3>
          <p className="text-red-700">There was an issue loading the contacts data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your professional contacts and relationships</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{totalContacts}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +15% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{activeContacts}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Relationship Score</p>
              <p className="text-3xl font-bold text-gray-900">{avgRelationshipScore}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5% from last month
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Influence</p>
              <p className="text-3xl font-bold text-gray-900">{highInfluenceContacts}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-purple-700">
              {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                Bulk Edit
              </button>
              <button 
                onClick={() => deleteContactMutation.mutate(selectedContacts)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {(filteredContacts || []).map((contact: Contact) => 
          viewMode === 'grid' ? (
            <ContactCard key={contact.id} contact={contact} />
          ) : (
            <ContactListItem key={contact.id} contact={contact} />
          )
        )}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default NextGenContactsModule;