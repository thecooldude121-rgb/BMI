import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  Plus, 
  Grid3X3, 
  List, 
  Users,
  Star,
  Mail,
  Phone,
  MapPin,
  Building,
  UserCheck,
  TrendingUp,
  Activity,
  Settings,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  Calendar,
  ChevronDown,
  Award,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
// Using existing project components structure
import Fuse from 'fuse.js';

// Simplified contact interface based on existing schema
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  department?: string;
  linkedinUrl?: string;
  isPrimary: boolean;
  status: 'active' | 'inactive';
  accountId?: string;
  accountName?: string;
  ownerId?: string;
  ownerName?: string;
  // Mock additional fields for demo
  relationshipScore: number;
  engagementStatus: string;
  totalActivities: number;
  responseRate: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContactMetrics {
  totalContacts: number;
  activeContacts: number;
  averageRelationshipScore: number;
  totalTouchpoints: number;
  responseRate: number;
  recentlyEngaged: number;
}

const EnterpriseContactsModule = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  // Fetch contacts data
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
  });

  // Fetch contact metrics
  const { data: metrics } = useQuery<ContactMetrics>({
    queryKey: ['/api/contacts/metrics'],
  });

  // Setup fuzzy search
  const fuse = useMemo(() => new Fuse(contacts, {
    keys: ['firstName', 'lastName', 'email', 'position', 'department', 'accountName'],
    threshold: 0.3,
  }), [contacts]);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let result = contacts;

    // Apply search
    if (searchTerm) {
      const searchResults = fuse.search(searchTerm);
      result = searchResults.map(r => r.item);
    }

    // Apply segment filter
    if (selectedSegment !== 'all') {
      result = result.filter(contact => 
        contact.status === selectedSegment ||
        contact.engagementStatus === selectedSegment ||
        contact.department === selectedSegment
      );
    }

    return result;
  }, [contacts, searchTerm, selectedSegment, fuse]);

  // Helper function for engagement status colors

  const getEngagementStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      recently_engaged: 'bg-blue-100 text-blue-800',
      at_risk: 'bg-yellow-100 text-yellow-800',
      dormant: 'bg-orange-100 text-orange-800',
      unresponsive: 'bg-red-100 text-red-800',
      do_not_contact: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white rounded-lg shadow-md h-full cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200">
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                {contact.firstName?.[0]}{contact.lastName?.[0]}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-sm text-gray-500">{contact.position}</p>
                {contact.accountName && (
                  <p className="text-xs text-gray-400 flex items-center">
                    <Building className="w-3 h-3 mr-1" />
                    {contact.accountName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {contact.isPrimary && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Primary
                </span>
              )}
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 pt-0">
          <div className="space-y-3">
            {/* Contact Information */}
            <div className="space-y-2">
              {contact.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {contact.email}
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {contact.phone}
                </div>
              )}
              {contact.department && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2" />
                  {contact.department}
                </div>
              )}
            </div>

            {/* Status and Type */}
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {contact.status}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getEngagementStatusColor(contact.engagementStatus)}`}>
                {contact.engagementStatus.replace('_', ' ')}
              </span>
            </div>

            {/* Relationship Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Relationship Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      contact.relationshipScore >= 80 ? 'bg-green-500' :
                      contact.relationshipScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${contact.relationshipScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{contact.relationshipScore}</span>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {contact.totalActivities}
                </div>
                <div className="text-xs text-gray-500">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {contact.responseRate}%
                </div>
                <div className="text-xs text-gray-500">Response Rate</div>
              </div>
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {contact.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded-full">
                    {tag}
                  </span>
                ))}
                {contact.tags.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded-full">
                    +{contact.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ContactListItem = ({ contact }: { contact: Contact }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white rounded-lg shadow-sm mb-2 hover:shadow-md transition-all duration-200 border border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                {contact.firstName?.[0]}{contact.lastName?.[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.isPrimary && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Primary
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {contact.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getEngagementStatusColor(contact.engagementStatus)}`}>
                    {contact.engagementStatus.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span>{contact.position}</span>
                  {contact.accountName && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {contact.accountName}
                      </span>
                    </>
                  )}
                  {contact.email && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {contact.email}
                      </span>
                    </>
                  )}
                  {contact.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {contact.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm font-semibold">{contact.relationshipScore}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold">{contact.totalActivities}</div>
                <div className="text-xs text-gray-500">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold">{contact.responseRate}%</div>
                <div className="text-xs text-gray-500">Response</div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">Manage and engage with your contact network</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Contacts</p>
                <p className="text-2xl font-bold">{metrics.totalContacts}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Contacts</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeContacts}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Relationship</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.averageRelationshipScore}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Touchpoints</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.totalTouchpoints}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Response Rate</p>
                <p className="text-2xl font-bold text-teal-600">{metrics.responseRate}%</p>
              </div>
              <Target className="w-8 h-8 text-teal-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Recently Engaged</p>
                <p className="text-2xl font-bold text-indigo-600">{metrics.recentlyEngaged}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setSelectedSegment(selectedSegment === 'all' ? 'active' : 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Segment: {selectedSegment === 'all' ? 'All' : selectedSegment.replace('_', ' ')}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
          >
            {viewMode === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Contacts Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <ContactListItem key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      {filteredContacts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first contact.'}
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      )}
    </div>
  );
};

export default EnterpriseContactsModule;