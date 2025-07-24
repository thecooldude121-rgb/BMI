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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Fuse from 'fuse.js';

// Enhanced contact interface based on schema
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  workPhone?: string;
  position?: string;
  title?: string;
  department?: string;
  location?: string;
  timezone?: string;
  preferredChannel: 'email' | 'phone' | 'linkedin' | 'whatsapp' | 'sms' | 'in_person' | 'video_call';
  linkedinUrl?: string;
  twitterHandle?: string;
  personalWebsite?: string;
  isPrimary: boolean;
  status: 'active' | 'inactive';
  engagementStatus: 'active' | 'at_risk' | 'do_not_contact' | 'recently_engaged' | 'dormant' | 'unresponsive';
  relationshipScore: number;
  lastTouchDate?: string;
  lastResponseDate?: string;
  responseRate: number;
  persona: 'decision_maker' | 'champion' | 'influencer' | 'gatekeeper' | 'end_user' | 'technical_buyer' | 'economic_buyer';
  influenceLevel: number;
  decisionMakingPower: number;
  accountId?: string;
  accountName?: string;
  ownerId?: string;
  ownerName?: string;
  birthday?: string;
  anniversary?: string;
  interests?: string[];
  personalNotes?: string;
  aiInsights?: any;
  communicationStyle?: string;
  emailOpens: number;
  emailClicks: number;
  meetingsAttended: number;
  callsAnswered: number;
  tags?: string[];
  segments?: string[];
  enrichmentStatus: string;
  dataQualityScore: number;
  gdprConsent: boolean;
  emailOptIn: boolean;
  marketingConsent: boolean;
  profilePhoto?: string;
  lastActivityDate?: string;
  lastActivityType?: string;
  totalActivities: number;
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
        contact.segments?.includes(selectedSegment) || 
        contact.engagementStatus === selectedSegment ||
        contact.persona === selectedSegment
      );
    }

    return result;
  }, [contacts, searchTerm, selectedSegment, fuse]);

  const getPersonaColor = (persona: string) => {
    const colors = {
      decision_maker: 'bg-red-100 text-red-800',
      champion: 'bg-green-100 text-green-800',
      influencer: 'bg-blue-100 text-blue-800',
      gatekeeper: 'bg-yellow-100 text-yellow-800',
      end_user: 'bg-purple-100 text-purple-800',
      technical_buyer: 'bg-indigo-100 text-indigo-800',
      economic_buyer: 'bg-pink-100 text-pink-800',
    };
    return colors[persona as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
      <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={contact.profilePhoto} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {contact.firstName?.[0]}{contact.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
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
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Primary
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Contact
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {contact.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {contact.location}
                </div>
              )}
            </div>

            {/* Persona and Engagement Status */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getPersonaColor(contact.persona)}>
                {contact.persona.replace('_', ' ')}
              </Badge>
              <Badge className={getEngagementStatusColor(contact.engagementStatus)}>
                {contact.engagementStatus.replace('_', ' ')}
              </Badge>
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
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {contact.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{contact.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ContactListItem = ({ contact }: { contact: Contact }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="mb-2 hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={contact.profilePhoto} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {contact.firstName?.[0]}{contact.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.isPrimary && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Primary
                    </Badge>
                  )}
                  <Badge className={getPersonaColor(contact.persona)}>
                    {contact.persona.replace('_', ' ')}
                  </Badge>
                  <Badge className={getEngagementStatusColor(contact.engagementStatus)}>
                    {contact.engagementStatus.replace('_', ' ')}
                  </Badge>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Contact
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
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
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Contacts</p>
                  <p className="text-2xl font-bold">{metrics.totalContacts}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Contacts</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.activeContacts}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Relationship</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.averageRelationshipScore}</p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Touchpoints</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.totalTouchpoints}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Response Rate</p>
                  <p className="text-2xl font-bold text-teal-600">{metrics.responseRate}%</p>
                </div>
                <Target className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Recently Engaged</p>
                  <p className="text-2xl font-bold text-indigo-600">{metrics.recentlyEngaged}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Segment: {selectedSegment === 'all' ? 'All' : selectedSegment.replace('_', ' ')}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedSegment('all')}>
                All Contacts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSegment('decision_maker')}>
                Decision Makers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSegment('champion')}>
                Champions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSegment('influencer')}>
                Influencers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSegment('active')}>
                Active Contacts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSegment('at_risk')}>
                At Risk
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {viewMode === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode('grid')}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('list')}>
                <List className="w-4 h-4 mr-2" />
                List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contacts Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
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
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnterpriseContactsModule;