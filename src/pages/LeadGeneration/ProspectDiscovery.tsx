import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Save, Download, Users, Building, MapPin, ArrowLeft,
  Briefcase, DollarSign, Globe, Zap, Target, Plus, X, 
  ChevronDown, ChevronUp, Sparkles, Eye, ArrowRight,
  Settings, RefreshCw, BookOpen, Star, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchFilter, SearchCriteria, Prospect, Company } from '../../types/leadGeneration';

const ProspectDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    logic: 'AND'
  });
  const [searchResults, setSearchResults] = useState<Prospect[]>([]);
  const [companyResults, setCompanyResults] = useState<Company[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [estimatedResults, setEstimatedResults] = useState(0);
  const [searchMode, setSearchMode] = useState<'prospects' | 'companies'>('prospects');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['person', 'company']));

  // Mock data for demonstration
  const mockProspects: Prospect[] = [
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Chen',
      fullName: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      phone: '+1-555-0101',
      linkedinUrl: 'https://linkedin.com/in/sarahchen',
      title: 'Chief Technology Officer',
      seniority: 'C-Level',
      department: 'Technology',
      functions: ['Engineering', 'Product'],
      companyId: 'comp1',
      companyName: 'TechCorp Solutions',
      companyDomain: 'techcorp.com',
      companyIndustry: 'Software',
      companySize: '500-1000',
      companyLocation: 'San Francisco, CA',
      leadSource: 'Apollo Discovery',
      leadStatus: 'new',
      leadScore: 92,
      aiScore: 88,
      temperature: 'hot',
      emailStatus: 'valid',
      engagementLevel: 'none',
      activeSequences: [],
      campaignHistory: [],
      tags: ['enterprise', 'decision-maker'],
      customFields: {},
      notes: '',
      ownerId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enrichmentStatus: 'enriched',
      dataQuality: 95
    },
    {
      id: '2',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      fullName: 'Michael Rodriguez',
      email: 'michael.rodriguez@healthplus.com',
      phone: '+1-555-0102',
      linkedinUrl: 'https://linkedin.com/in/michaelrodriguez',
      title: 'VP of Operations',
      seniority: 'VP',
      department: 'Operations',
      functions: ['Operations', 'Strategy'],
      companyId: 'comp2',
      companyName: 'HealthPlus Medical',
      companyDomain: 'healthplus.com',
      companyIndustry: 'Healthcare',
      companySize: '200-500',
      companyLocation: 'Boston, MA',
      leadSource: 'Apollo Discovery',
      leadStatus: 'new',
      leadScore: 78,
      aiScore: 82,
      temperature: 'warm',
      emailStatus: 'valid',
      engagementLevel: 'none',
      activeSequences: [],
      campaignHistory: [],
      tags: ['healthcare', 'operations'],
      customFields: {},
      notes: '',
      ownerId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enrichmentStatus: 'enriched',
      dataQuality: 87
    }
  ];

  const mockCompanies: Company[] = [
    {
      id: 'comp1',
      name: 'TechCorp Solutions',
      domain: 'techcorp.com',
      website: 'https://techcorp.com',
      industry: 'Software',
      description: 'Leading enterprise software solutions provider',
      founded: 2015,
      employeeCount: 750,
      employeeRange: '500-1000',
      annualRevenue: 50000000,
      revenueRange: '$50M-$100M',
      headquarters: {
        city: 'San Francisco',
        state: 'CA',
        country: 'United States'
      },
      locations: [],
      technologies: [],
      techStack: ['React', 'Node.js', 'AWS', 'MongoDB'],
      socialProfiles: [],
      fundingStage: 'Series B',
      totalFunding: 25000000,
      prospectCount: 45,
      contactedCount: 12,
      repliedCount: 3,
      tags: ['enterprise', 'saas'],
      customFields: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dataQuality: 92,
      enrichmentStatus: 'enriched'
    }
  ];

  useEffect(() => {
    // Simulate search results estimation
    const timer = setTimeout(() => {
      setEstimatedResults(Math.floor(Math.random() * 10000) + 1000);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchCriteria]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      if (searchMode === 'prospects') {
        setSearchResults(mockProspects);
      } else {
        setCompanyResults(mockCompanies);
      }
      setIsSearching(false);
    }, 2000);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSelectProspect = (prospectId: string) => {
    setSelectedProspects(prev =>
      prev.includes(prospectId)
        ? prev.filter(id => id !== prospectId)
        : [...prev, prospectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProspects.length === searchResults.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(searchResults.map(p => p.id));
    }
  };

  const renderFilterSection = (
    id: string,
    title: string,
    icon: React.ElementType,
    children: React.ReactNode
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections.has(id);

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/lead-generation/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Prospect Discovery</h1>
                <p className="text-gray-600 text-lg">Find and discover your ideal prospects with AI-powered search</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setSearchMode('prospects')}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-all ${
                    searchMode === 'prospects'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Prospects
                </button>
                <button
                  onClick={() => setSearchMode('companies')}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-l transition-all ${
                    searchMode === 'companies'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Companies
                </button>
              </div>
              
              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <BookOpen className="h-4 w-4 mr-2" />
                Saved Searches
              </button>
            </div>
          </div>

          {/* Search Estimation */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  Estimated Results: {estimatedResults.toLocaleString()} {searchMode}
                </span>
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSearching ? (
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Person Filters */}
            {searchMode === 'prospects' && renderFilterSection(
              'person',
              'Person Filters',
              Users,
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Titles</label>
                  <input
                    type="text"
                    placeholder="CEO, CTO, VP of Sales..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seniority</label>
                  <div className="space-y-2">
                    {['C-Level', 'VP', 'Director', 'Manager'].map(level => (
                      <label key={level} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                  <div className="space-y-2">
                    {['Sales', 'Marketing', 'Engineering', 'Operations', 'Finance'].map(dept => (
                      <label key={dept} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Company Filters */}
            {renderFilterSection(
              'company',
              'Company Filters',
              Building,
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education'].map(industry => (
                      <label key={industry} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                  <div className="space-y-2">
                    {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map(size => (
                      <label key={size} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{size} employees</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Range</label>
                  <div className="space-y-2">
                    {['$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'].map(range => (
                      <label key={range} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  <input
                    type="text"
                    placeholder="Salesforce, HubSpot, AWS..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="United States, California..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Advanced Filters */}
            {renderFilterSection(
              'advanced',
              'Advanced Filters',
              Settings,
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
                  <div className="space-y-2">
                    {['Seed', 'Series A', 'Series B', 'Series C+', 'IPO'].map(stage => (
                      <label key={stage} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">{stage}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    placeholder="AI, machine learning, automation..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exclude Keywords</label>
                  <input
                    type="text"
                    placeholder="competitor, agency..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Save Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Save className="h-4 w-4 mr-2" />
                Save Search
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {!isSearching && searchResults.length === 0 && companyResults.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Discover Your Ideal Prospects</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Use our advanced filters to find prospects that match your ideal customer profile. 
                  Get access to verified contact information and company insights.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Precise Targeting</p>
                    <p className="text-xs text-gray-600">Filter by 50+ criteria</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Sparkles className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">AI-Powered</p>
                    <p className="text-xs text-gray-600">Smart recommendations</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">Global Database</p>
                    <p className="text-xs text-gray-600">200M+ contacts</p>
                  </div>
                </div>
              </div>
            ) : isSearching ? (
              /* Loading State */
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Searching...</h3>
                <p className="text-gray-600">Finding prospects that match your criteria</p>
              </div>
            ) : (
              /* Results */
              <div className="space-y-6">
                {/* Results Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Search Results ({searchMode === 'prospects' ? searchResults.length : companyResults.length})
                      </h3>
                      {selectedProspects.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedProspects.length} selected
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <Save className="h-4 w-4 mr-2" />
                        Save Search
                      </button>
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  {selectedProspects.length > 0 && (
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedProspects.length} prospect{selectedProspects.length > 1 ? 's' : ''} selected
                      </span>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Add to Sequence
                        </button>
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                          Add to List
                        </button>
                        <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                          Enrich Data
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Grid */}
                {searchMode === 'prospects' ? (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left">
                              <input
                                type="checkbox"
                                checked={selectedProspects.length === searchResults.length && searchResults.length > 0}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Prospect
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Company
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Score
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Contact Info
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {searchResults.map((prospect) => (
                            <tr key={prospect.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedProspects.includes(prospect.id)}
                                  onChange={() => handleSelectProspect(prospect.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {prospect.firstName.charAt(0)}{prospect.lastName.charAt(0)}
                                  </div>
                                  <div>
                                    <button
                                      onClick={() => navigate(`/lead-generation/prospects/${prospect.id}`)}
                                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                    >
                                      {prospect.fullName}
                                    </button>
                                    <p className="text-sm text-gray-600">{prospect.title}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className={`w-2 h-2 rounded-full ${
                                        prospect.temperature === 'hot' ? 'bg-red-500' :
                                        prospect.temperature === 'warm' ? 'bg-orange-500' : 'bg-blue-500'
                                      }`} />
                                      <span className="text-xs text-gray-500">{prospect.seniority}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <button
                                    onClick={() => navigate(`/lead-generation/companies/${prospect.companyId}`)}
                                    className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline transition-colors"
                                  >
                                    {prospect.companyName}
                                  </button>
                                  <p className="text-sm text-gray-600">{prospect.companyIndustry}</p>
                                  <p className="text-xs text-gray-500">{prospect.companySize} • {prospect.companyLocation}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <div className="flex flex-col items-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      prospect.leadScore >= 90 ? 'bg-green-100 text-green-800' :
                                      prospect.leadScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                      prospect.leadScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {prospect.leadScore}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">Lead</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      prospect.aiScore >= 90 ? 'bg-green-100 text-green-800' :
                                      prospect.aiScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                      prospect.aiScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {prospect.aiScore}
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">AI</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm text-gray-900">{prospect.email}</span>
                                    <span className={`w-2 h-2 rounded-full ${
                                      prospect.emailStatus === 'valid' ? 'bg-green-500' :
                                      prospect.emailStatus === 'risky' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                  </div>
                                  {prospect.phone && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">{prospect.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => navigate(`/lead-generation/prospects/${prospect.id}`)}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                                    <Plus className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors">
                                    <Zap className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Company Results */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companyResults.map((company) => (
                      <div key={company.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <button
                              onClick={() => navigate(`/lead-generation/companies/${company.id}`)}
                              className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              {company.name}
                            </button>
                            <p className="text-sm text-gray-600">{company.industry}</p>
                            <p className="text-xs text-gray-500">{company.employeeRange} employees</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-900">{company.dataQuality}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{company.domain}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{company.headquarters.city}, {company.headquarters.country}</span>
                          </div>
                          {company.revenueRange && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{company.revenueRange}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-lg font-bold text-blue-600">{company.prospectCount}</p>
                            <p className="text-xs text-gray-600">Prospects</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="text-lg font-bold text-green-600">{company.contactedCount}</p>
                            <p className="text-xs text-gray-600">Contacted</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="text-lg font-bold text-purple-600">{company.repliedCount}</p>
                            <p className="text-xs text-gray-600">Replied</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                            <Users className="h-4 w-4 mr-1" />
                            View Prospects
                          </button>
                          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDiscovery;