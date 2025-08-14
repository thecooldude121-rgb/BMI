import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, ChevronRight, Mail, Phone, MapPin, Building2,
  CheckCircle, XCircle, AlertCircle, User, Download, Upload, Settings,
  Bookmark, BookmarkCheck, MoreVertical, ExternalLink, Copy, Shield,
  Clock, Users, Briefcase, Globe, Hash, Building, Tag, Layers, TrendingUp,
  X, Plus, RefreshCw, Save, Share2, Database, Zap, ArrowUpDown
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ProspectData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified?: boolean;
  linkedinUrl?: string;
  department?: string;
  seniority?: string;
  companySize?: string;
  industry?: string;
  revenue?: string;
  technologies?: string[];
  lastActivity?: Date;
  leadScore?: number;
  saved?: boolean;
  optedOut?: boolean;
  lists?: string[];
  persona?: string;
  emailStatus?: 'verified' | 'unverified' | 'invalid' | 'catch-all';
}

interface FilterOptions {
  optedOutCalls: boolean;
  lists: string[];
  personas: string[];
  emailStatus: string[];
  jobTitles: string[];
  companies: string[];
  companyLookalikes: string[];
  locations: string[];
  employeeRanges: string[];
  industries: string[];
  keywords: string[];
}

const ProspectDiscovery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'total' | 'netNew' | 'saved'>('total');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'score'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    lists: true,
    persona: true,
    emailStatus: true,
    jobTitles: true,
    company: false,
    location: false,
    employees: false,
    industry: false
  });

  const [filters, setFilters] = useState<FilterOptions>({
    optedOutCalls: false,
    lists: [],
    personas: [],
    emailStatus: [],
    jobTitles: [],
    companies: [],
    companyLookalikes: [],
    locations: [],
    employeeRanges: [],
    industries: [],
    keywords: []
  });

  const queryClient = useQueryClient();

  // Generate realistic mock data
  const generateMockProspects = (): ProspectData[] => {
    const companies = [
      { name: 'Avic Outdoor', logo: '🏢' },
      { name: 'Mobeee DOOH', logo: '📱' },
      { name: 'Bright Outdoor Media Lim', logo: '☀️' },
      { name: 'LIVE BOARD,INC.', logo: '📺' },
      { name: 'Seni Jaya Corporation Ber', logo: '🌟' },
      { name: 'AdQuick', logo: '⚡' },
      { name: 'RioVerde OOH', logo: '🌿' },
      { name: 'Outdoor Media Association', logo: '🎯' },
      { name: 'Lumo Digital Outdoor', logo: '💡' }
    ];

    const jobTitles = [
      'Chief Executive Officer',
      'CTO & Co-Founder',
      'Chief Executive Officer',
      'CEO',
      'Chief Executive Officer',
      'CEO',
      'CEO and Co-Founder',
      'Chief Executive Officer',
      'Chief Technology Officer'
    ];

    const names = [
      { first: 'Iva', last: 'Antić' },
      { first: 'Jose', last: 'Junior' },
      { first: 'Mukesh', last: 'Sharma' },
      { first: 'Tomohiro', last: 'Takagi' },
      { first: 'Jeff', last: 'Cheah' },
      { first: 'Chris', last: 'Gadek' },
      { first: 'Flavio', last: 'Polay' },
      { first: 'Helen', last: 'Willoughby' },
      { first: 'Robin', last: 'Arnold' }
    ];

    const locations = [
      'Croatia',
      'Rio de Janeiro, Brazil',
      'Mumbai, India',
      'Tokyo, Japan',
      'Kuala Lumpur, Malaysia',
      'Seattle, Washington',
      'Sao Paulo, Brazil',
      'Sydney, Australia',
      'Auckland, New Zealand'
    ];

    return names.map((name, index) => ({
      id: `prospect-${index + 1}`,
      name: `${name.first} ${name.last}`,
      firstName: name.first,
      lastName: name.last,
      jobTitle: jobTitles[index],
      company: companies[index].name,
      companyLogo: companies[index].logo,
      location: locations[index],
      email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@${companies[index].name.toLowerCase().replace(/\s+/g, '')}.com`,
      emailVerified: Math.random() > 0.3,
      phone: Math.random() > 0.5 ? `+1 555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
      phoneVerified: Math.random() > 0.5,
      linkedinUrl: `https://linkedin.com/in/${name.first.toLowerCase()}${name.last.toLowerCase()}`,
      department: index % 3 === 0 ? 'Executive' : index % 3 === 1 ? 'Technology' : 'Operations',
      seniority: 'C-Level',
      companySize: ['1-50', '51-200', '201-500', '501-1000', '1000+'][Math.floor(Math.random() * 5)],
      industry: 'Media & Advertising',
      revenue: ['$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'][Math.floor(Math.random() * 4)],
      technologies: ['Salesforce', 'HubSpot', 'AWS', 'Google Cloud'].slice(0, Math.floor(Math.random() * 3) + 1),
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      leadScore: Math.floor(Math.random() * 30) + 70,
      saved: Math.random() > 0.7,
      optedOut: false,
      lists: Math.random() > 0.5 ? ['Tech Leaders', 'Enterprise'] : [],
      persona: ['Decision Maker', 'Influencer', 'Champion'][Math.floor(Math.random() * 3)],
      emailStatus: Math.random() > 0.2 ? 'verified' : 'unverified'
    }));
  };

  // Fetch prospects data from API
  const { data: prospectsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/lead-generation/prospects', { 
      tab: activeTab, 
      search: searchQuery, 
      filters, 
      sort: sortBy,
      page: currentPage,
      limit: itemsPerPage 
    }],
    queryFn: async () => {
      const params = new URLSearchParams({
        tab: activeTab,
        search: searchQuery,
        sort: sortBy,
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });
      const response = await fetch(`/api/lead-generation/prospects?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prospects');
      }
      return response.json();
    }
  });

  const prospects = prospectsData?.prospects || generateMockProspects();
  const totalCount = prospectsData?.total || 924;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleProspectSelection = (id: string) => {
    setSelectedProspects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllProspects = () => {
    if (selectedProspects.length === prospects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(prospects.map(p => p.id));
    }
  };

  const saveProspect = async (id: string) => {
    // API call to save prospect
    console.log("Prospect saved:", id);
    // In a real implementation, show a notification
  };

  const exportProspects = () => {
    console.log(`Exporting ${selectedProspects.length || prospects.length} prospects...`);
    // In a real implementation, trigger export and show notification
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Filters */}
      {showFilters && (
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Opted out checkbox */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.optedOutCalls}
                onChange={(e) => setFilters(prev => ({ ...prev, optedOutCalls: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span>Opted out of calls</span>
            </label>
          </div>

          {/* Filter Sections */}
          <div className="p-4 space-y-4">
            {/* Lists */}
            <div>
              <button
                onClick={() => toggleSection('lists')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">Lists</span>
                {expandedSections.lists ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expandedSections.lists && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Tech Leaders</span>
                    <span className="text-gray-500">(145)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Enterprise Accounts</span>
                    <span className="text-gray-500">(89)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Persona */}
            <div>
              <button
                onClick={() => toggleSection('persona')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">Persona</span>
                {expandedSections.persona ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expandedSections.persona && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Decision Maker</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Influencer</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Champion</span>
                  </label>
                </div>
              )}
            </div>

            {/* Email Status */}
            <div>
              <button
                onClick={() => toggleSection('emailStatus')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">Email Status</span>
                {expandedSections.emailStatus ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expandedSections.emailStatus && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Verified</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Unverified</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Catch-all</span>
                  </label>
                </div>
              )}
            </div>

            {/* Job Titles */}
            <div>
              <button
                onClick={() => toggleSection('jobTitles')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">Job Titles</span>
                <span className="text-sm text-gray-500">2</span>
                {expandedSections.jobTitles ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expandedSections.jobTitles && (
                <div className="mt-2 space-y-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded-md mr-2">
                    cto <X className="h-3 w-3 ml-1 cursor-pointer" />
                  </span>
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 rounded-md">
                    ceo <X className="h-3 w-3 ml-1 cursor-pointer" />
                  </span>
                </div>
              )}
            </div>

            {/* Company */}
            <div>
              <button
                onClick={() => toggleSection('company')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">Company</span>
                {expandedSections.company ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>

            {/* Company Lookalikes */}
            <div>
              <button className="flex items-center justify-between w-full text-left">
                <span className="font-medium text-gray-900">Company Lookalikes</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Beta</span>
              </button>
            </div>

            {/* Location */}
            <div>
              <button
                onClick={() => toggleSection('location')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">Location</span>
                {expandedSections.location ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>

            {/* # Employees */}
            <div>
              <button
                onClick={() => toggleSection('employees')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900"># Employees</span>
                <span className="text-sm text-gray-500">3</span>
                {expandedSections.employees ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expandedSections.employees && (
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <input type="number" placeholder="01:00" className="w-20 px-2 py-1 border rounded" />
                    <span className="mx-2">-</span>
                    <input type="number" placeholder="21:50" className="w-20 px-2 py-1 border rounded" />
                    <input type="number" placeholder="11:20" className="w-20 px-2 py-1 border rounded ml-2" />
                  </div>
                </div>
              )}
            </div>

            {/* Industry & Keywords */}
            <div>
              <button
                onClick={() => toggleSection('industry')}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">Industry & Keywords</span>
                <span className="text-sm text-gray-500">5</span>
                {expandedSections.industry ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Right side - Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  <Filter className="h-4 w-4 inline mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Zap className="h-4 w-4 inline mr-2" />
                  Create workflow
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, company, title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">
                Save search
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="recent">Most Recent</option>
                  <option value="score">Lead Score</option>
                </select>
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedProspects.length === prospects.length && prospects.length > 0}
              onChange={selectAllProspects}
              className="mr-4 rounded border-gray-300"
            />
            <div className="grid grid-cols-12 gap-4 flex-1 text-xs font-medium text-gray-600 uppercase tracking-wider">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Job Title</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Emails</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {prospects.map((prospect) => (
                <div key={prospect.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProspects.includes(prospect.id)}
                      onChange={() => toggleProspectSelection(prospect.id)}
                      className="mr-4 rounded border-gray-300"
                    />
                    <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                      {/* Name */}
                      <div className="col-span-3 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                            {prospect.name}
                          </a>
                          {prospect.linkedinUrl && (
                            <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer" className="ml-2">
                              <ExternalLink className="h-3 w-3 inline text-gray-400" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Job Title */}
                      <div className="col-span-2 text-sm text-gray-900">
                        {prospect.jobTitle}
                      </div>

                      {/* Company */}
                      <div className="col-span-2 flex items-center space-x-2">
                        <span className="text-2xl">{prospect.companyLogo}</span>
                        <span className="text-sm text-gray-900">{prospect.company}</span>
                      </div>

                      {/* Location */}
                      <div className="col-span-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {prospect.location}
                      </div>

                      {/* Emails */}
                      <div className="col-span-2 flex items-center space-x-2">
                        {prospect.emailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                          <Mail className="h-3 w-3 inline mr-1" />
                          Access email
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center space-x-2">
                        <button
                          onClick={() => saveProspect(prospect.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {prospect.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Clear all
              </button>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                More Filters
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * itemsPerPage >= totalCount}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportProspects}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300"
              >
                <Download className="h-4 w-4 inline mr-2" />
                Export
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add to Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDiscovery;