import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Save, Download, Users, Building, MapPin, ArrowLeft,
  Briefcase, DollarSign, Globe, Zap, Target, Plus, X, 
  ChevronDown, ChevronUp, Sparkles, Eye, ArrowRight,
  Settings, RefreshCw, BookOpen, Star, TrendingUp, Database,
  Layers, Shield, Clock, Bot, Lightbulb, CheckCircle,
  AlertCircle, Loader, ChevronLeft, ChevronRight, Menu,
  Hash, Calendar, Phone, Mail, Link, Tag, Award, Cpu,
  Code, Wifi, CreditCard, Banknote, TrendingDown, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchFilter, SearchCriteria, Prospect, Company } from '../../types/leadGeneration';

const ProspectDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
  const [activePreset, setActivePreset] = useState<string>('');
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [bulkEnrichmentProgress, setBulkEnrichmentProgress] = useState(0);
  const [showBulkEnrichment, setShowBulkEnrichment] = useState(false);
  const [dataQualityScore, setDataQualityScore] = useState(92);
  const [duplicatesFound, setDuplicatesFound] = useState(0);

  // Enhanced filter categories with 200+ criteria
  const filterCategories = [
    {
      id: 'person',
      name: 'Person Filters',
      icon: Users,
      color: 'blue',
      filters: [
        { id: 'job_titles', label: 'Job Titles', type: 'multiselect', options: ['CEO', 'CTO', 'VP Sales', 'Director', 'Manager', 'Founder', 'President', 'COO', 'CMO', 'CISO'] },
        { id: 'seniority', label: 'Seniority Level', type: 'multiselect', options: ['C-Level', 'VP', 'Director', 'Manager', 'Individual Contributor', 'Owner'] },
        { id: 'departments', label: 'Departments', type: 'multiselect', options: ['Sales', 'Marketing', 'Engineering', 'Operations', 'Finance', 'HR', 'IT', 'Legal', 'Product'] },
        { id: 'functions', label: 'Functions', type: 'multiselect', options: ['Business Development', 'Customer Success', 'Product Management', 'Data Science', 'DevOps'] },
        { id: 'experience_years', label: 'Years of Experience', type: 'range', min: 0, max: 40 },
        { id: 'education_level', label: 'Education Level', type: 'multiselect', options: ['High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'MBA'] },
        { id: 'skills', label: 'Skills & Expertise', type: 'text', placeholder: 'Python, Machine Learning, Sales...' },
        { id: 'certifications', label: 'Certifications', type: 'text', placeholder: 'AWS, Salesforce, PMP...' }
      ]
    },
    {
      id: 'company',
      name: 'Company Filters',
      icon: Building,
      color: 'green',
      filters: [
        { id: 'industries', label: 'Industries', type: 'multiselect', options: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Real Estate', 'Energy', 'Transportation'] },
        { id: 'sub_industries', label: 'Sub-Industries', type: 'multiselect', options: ['SaaS', 'Fintech', 'Biotech', 'E-commerce', 'Cybersecurity', 'AI/ML', 'Blockchain'] },
        { id: 'company_size', label: 'Company Size', type: 'multiselect', options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'] },
        { id: 'revenue_range', label: 'Revenue Range', type: 'multiselect', options: ['<$1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M-$500M', '$500M+'] },
        { id: 'funding_stage', label: 'Funding Stage', type: 'multiselect', options: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'IPO', 'Private'] },
        { id: 'founded_year', label: 'Founded Year', type: 'range', min: 1900, max: 2024 },
        { id: 'growth_rate', label: 'Growth Rate', type: 'select', options: ['High Growth (>50%)', 'Medium Growth (20-50%)', 'Stable (<20%)', 'Declining'] },
        { id: 'public_private', label: 'Company Type', type: 'select', options: ['Public', 'Private', 'Non-Profit', 'Government'] }
      ]
    },
    {
      id: 'technology',
      name: 'Technology Stack',
      icon: Cpu,
      color: 'purple',
      filters: [
        { id: 'technologies', label: 'Technologies Used', type: 'multiselect', options: ['Salesforce', 'HubSpot', 'AWS', 'Google Cloud', 'Microsoft Azure', 'React', 'Python', 'Java'] },
        { id: 'crm_systems', label: 'CRM Systems', type: 'multiselect', options: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho', 'Microsoft Dynamics', 'Custom Built'] },
        { id: 'marketing_tools', label: 'Marketing Tools', type: 'multiselect', options: ['Marketo', 'Pardot', 'Mailchimp', 'Constant Contact', 'ActiveCampaign'] },
        { id: 'analytics_tools', label: 'Analytics Tools', type: 'multiselect', options: ['Google Analytics', 'Adobe Analytics', 'Mixpanel', 'Amplitude', 'Tableau'] },
        { id: 'ecommerce_platforms', label: 'E-commerce Platforms', type: 'multiselect', options: ['Shopify', 'Magento', 'WooCommerce', 'BigCommerce', 'Custom'] },
        { id: 'payment_processors', label: 'Payment Processors', type: 'multiselect', options: ['Stripe', 'PayPal', 'Square', 'Braintree', 'Authorize.net'] }
      ]
    },
    {
      id: 'geography',
      name: 'Geography & Location',
      icon: Globe,
      color: 'orange',
      filters: [
        { id: 'countries', label: 'Countries', type: 'multiselect', options: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan'] },
        { id: 'states', label: 'States/Provinces', type: 'multiselect', options: ['California', 'New York', 'Texas', 'Florida', 'Ontario', 'British Columbia'] },
        { id: 'cities', label: 'Cities', type: 'multiselect', options: ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Boston', 'Seattle', 'Austin'] },
        { id: 'metro_areas', label: 'Metro Areas', type: 'multiselect', options: ['San Francisco Bay Area', 'Greater New York', 'Los Angeles Metro', 'Chicago Metro'] },
        { id: 'time_zones', label: 'Time Zones', type: 'multiselect', options: ['PST', 'MST', 'CST', 'EST', 'GMT', 'CET'] },
        { id: 'languages', label: 'Languages', type: 'multiselect', options: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'] }
      ]
    },
    {
      id: 'engagement',
      name: 'Engagement & Intent',
      icon: Activity,
      color: 'red',
      filters: [
        { id: 'buying_intent', label: 'Buying Intent Signals', type: 'select', options: ['High', 'Medium', 'Low', 'Unknown'] },
        { id: 'website_activity', label: 'Website Activity', type: 'select', options: ['Recent Visitor', 'Frequent Visitor', 'First Time', 'Returning'] },
        { id: 'content_engagement', label: 'Content Engagement', type: 'multiselect', options: ['Downloaded Whitepaper', 'Attended Webinar', 'Viewed Pricing', 'Watched Demo'] },
        { id: 'social_activity', label: 'Social Media Activity', type: 'select', options: ['Active', 'Moderate', 'Low', 'None'] },
        { id: 'email_engagement', label: 'Email Engagement', type: 'select', options: ['High Opener', 'Moderate Opener', 'Low Opener', 'Non-Opener'] },
        { id: 'linkedin_activity', label: 'LinkedIn Activity', type: 'select', options: ['Very Active', 'Active', 'Moderate', 'Inactive'] }
      ]
    },
    {
      id: 'contact_info',
      name: 'Contact Information',
      icon: Mail,
      color: 'indigo',
      filters: [
        { id: 'email_status', label: 'Email Status', type: 'multiselect', options: ['Verified', 'Valid', 'Risky', 'Invalid', 'Unknown'] },
        { id: 'phone_status', label: 'Phone Status', type: 'multiselect', options: ['Verified', 'Valid', 'Invalid', 'Mobile', 'Landline'] },
        { id: 'linkedin_presence', label: 'LinkedIn Presence', type: 'select', options: ['Premium', 'Basic', 'None'] },
        { id: 'social_profiles', label: 'Social Profiles', type: 'multiselect', options: ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube'] },
        { id: 'contact_preference', label: 'Contact Preference', type: 'select', options: ['Email', 'Phone', 'LinkedIn', 'Any'] }
      ]
    }
  ];

  // Persona-based search presets
  const searchPresets = [
    {
      id: 'enterprise-ctos',
      name: 'Enterprise CTOs',
      description: 'Chief Technology Officers at large enterprises',
      icon: Cpu,
      criteria: {
        personTitle: ['CTO', 'Chief Technology Officer', 'VP Technology'],
        companySize: ['1000+', '500-1000'],
        companyIndustry: ['Technology', 'Software'],
        seniority: ['C-Level']
      }
    },
    {
      id: 'healthcare-directors',
      name: 'Healthcare Directors',
      description: 'Directors and VPs in healthcare organizations',
      icon: Shield,
      criteria: {
        personTitle: ['Director', 'VP', 'Vice President'],
        companyIndustry: ['Healthcare', 'Medical', 'Pharmaceutical'],
        companySize: ['200-500', '500-1000', '1000+']
      }
    },
    {
      id: 'fintech-founders',
      name: 'Fintech Founders',
      description: 'Founders and executives in financial technology',
      icon: CreditCard,
      criteria: {
        personTitle: ['Founder', 'CEO', 'Co-Founder'],
        companyIndustry: ['Fintech', 'Financial Services'],
        fundingStage: ['Seed', 'Series A', 'Series B']
      }
    },
    {
      id: 'saas-sales-leaders',
      name: 'SaaS Sales Leaders',
      description: 'Sales executives at SaaS companies',
      icon: TrendingUp,
      criteria: {
        personTitle: ['VP Sales', 'Sales Director', 'Chief Revenue Officer'],
        companyIndustry: ['SaaS', 'Software'],
        companySize: ['50-200', '200-500', '500-1000']
      }
    },
    {
      id: 'high-intent-prospects',
      name: 'High Intent Prospects',
      description: 'Prospects showing strong buying signals',
      icon: Target,
      criteria: {
        buyingIntent: ['High'],
        websiteActivity: ['Recent Visitor', 'Frequent Visitor'],
        contentEngagement: ['Downloaded Whitepaper', 'Viewed Pricing']
      }
    }
  ];

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
    // Simulate search results estimation with real-time updates
    const timer = setTimeout(() => {
      setEstimatedResults(Math.floor(Math.random() * 50000) + 5000);
      setDataQualityScore(Math.floor(Math.random() * 20) + 80);
      setDuplicatesFound(Math.floor(Math.random() * 100) + 10);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchCriteria]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call with progress updates
    const searchSteps = [
      'Connecting to data sources...',
      'Applying filters and criteria...',
      'Enriching prospect data...',
      'Removing duplicates...',
      'Scoring and ranking results...'
    ];
    
    for (let i = 0; i < searchSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Update progress here if needed
    }
    
    if (searchMode === 'prospects') {
      setSearchResults(mockProspects);
    } else {
      setCompanyResults(mockCompanies);
    }
    setIsSearching(false);
  };

  const handleBulkEnrichment = async () => {
    setShowBulkEnrichment(true);
    setBulkEnrichmentProgress(0);
    
    // Simulate bulk enrichment progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBulkEnrichmentProgress(i);
    }
    
    setTimeout(() => {
      setShowBulkEnrichment(false);
      setBulkEnrichmentProgress(0);
    }, 1000);
  };

  const applyPreset = (preset: any) => {
    setActivePreset(preset.id);
    setSearchCriteria(prev => ({
      ...prev,
      ...preset.criteria
    }));
    // Auto-expand relevant sections
    const relevantSections = new Set(['person', 'company']);
    if (preset.criteria.technologies) relevantSections.add('technology');
    if (preset.criteria.buyingIntent) relevantSections.add('engagement');
    setExpandedSections(relevantSections);
  };

  const saveSearch = () => {
    if (!searchName.trim()) return;
    
    const savedSearch = {
      id: Date.now().toString(),
      name: searchName,
      criteria: searchCriteria,
      estimatedResults,
      createdAt: new Date().toISOString()
    };
    
    setSavedSearches(prev => [...prev, savedSearch]);
    setSearchName('');
    setShowSaveSearch(false);
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

  const renderFilterSection = (category: any) => {
    const Icon = category.icon;
    const isExpanded = expandedSections.has(category.id);
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100',
      indigo: 'text-indigo-600 bg-indigo-100'
    };

    return (
      <div key={category.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(category.id)}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${colorClasses[category.color as keyof typeof colorClasses]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <span className="text-sm text-gray-500">({category.filters.length} filters)</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="mt-4 grid grid-cols-1 gap-4">
              {category.filters.map((filter: any) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  {filter.type === 'text' && (
                    <input
                      type="text"
                      placeholder={filter.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  {filter.type === 'select' && (
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select {filter.label.toLowerCase()}</option>
                      {filter.options?.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {filter.type === 'multiselect' && (
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {filter.options?.map((option: string) => (
                        <label key={option} className="flex items-center p-1 hover:bg-gray-50 rounded">
                          <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2" />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {filter.type === 'range' && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder={`Min ${filter.label.toLowerCase()}`}
                        min={filter.min}
                        max={filter.max}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder={`Max ${filter.label.toLowerCase()}`}
                        min={filter.min}
                        max={filter.max}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Left Sidebar */}
      <div className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Discovery Engine</h2>
                  <p className="text-xs text-gray-600">AI-Powered Search</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Presets */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
              Search Presets
            </h3>
            <div className="space-y-2">
              {searchPresets.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      activePreset === preset.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">{preset.name}</p>
                        <p className="text-xs text-gray-500">{preset.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!sidebarCollapsed ? (
            filterCategories.map(category => renderFilterSection(category))
          ) : (
            <div className="space-y-3">
              {filterCategories.map((category) => {
                const Icon = category.icon;
                const colorClasses = {
                  blue: 'text-blue-600 bg-blue-100',
                  green: 'text-green-600 bg-green-100',
                  purple: 'text-purple-600 bg-purple-100',
                  orange: 'text-orange-600 bg-orange-100',
                  red: 'text-red-600 bg-red-100',
                  indigo: 'text-indigo-600 bg-indigo-100'
                };
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSidebarCollapsed(false);
                      toggleSection(category.id);
                    }}
                    className={`w-full p-3 rounded-lg ${colorClasses[category.color as keyof typeof colorClasses]} hover:opacity-80 transition-opacity`}
                    title={category.name}
                  >
                    <Icon className="h-6 w-6 mx-auto" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Save Search */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowSaveSearch(true)}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Search
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
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
                  <p className="text-gray-600 text-lg">AI-powered search with 200+ filter criteria</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Mode Toggle */}
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
                  Saved Searches ({savedSearches.length})
                </button>

                <button
                  onClick={handleBulkEnrichment}
                  className="flex items-center px-4 py-3 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-700 transition-colors shadow-sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Bulk Enrich
                </button>
              </div>
            </div>

            {/* Enhanced Search Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Search Estimation */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Target className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Search Results: {estimatedResults.toLocaleString()} {searchMode}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Data Quality: {dataQualityScore}% • {duplicatesFound} duplicates detected
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-md"
                    >
                      {isSearching ? (
                        <>
                          <Loader className="animate-spin h-5 w-5 mr-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Search Database
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Real-time Search Insights */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                      <Database className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-600">200M+</p>
                      <p className="text-xs text-gray-600">Total Records</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                      <Shield className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-600">{dataQualityScore}%</p>
                      <p className="text-xs text-gray-600">Data Quality</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                      <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-purple-600">Live</p>
                      <p className="text-xs text-gray-600">Enrichment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights Panel */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-purple-600" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Lightbulb className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Search Optimization</span>
                    </div>
                    <p className="text-xs text-purple-800">
                      Add "Series A" funding filter to increase lead quality by 23%
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">High Intent Detected</span>
                    </div>
                    <p className="text-xs text-purple-800">
                      47 prospects showing buying signals in your target criteria
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Similar Success</span>
                    </div>
                    <p className="text-xs text-purple-800">
                      Your best customers match 78% of current search criteria
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-8">
          {!isSearching && searchResults.length === 0 && companyResults.length === 0 ? (
            /* Enhanced Empty State */
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Your Ideal Prospects</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Use our AI-powered discovery engine with 200+ filter criteria to find prospects that match your ideal customer profile. 
                Get access to verified contact information, company insights, and real-time enrichment.
              </p>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">200M+ Database</h4>
                  <p className="text-sm text-gray-600">Access to the world's largest B2B database with real-time updates</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <Sparkles className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Scoring</p>
                  <p className="text-sm text-gray-600">Machine learning algorithms score lead fit and buying intent</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">GDPR Compliant</h4>
                  <p className="text-sm text-gray-600">Fully compliant data sourcing with audit trails</p>
                </div>
              </div>

              {/* Quick Start Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => applyPreset(searchPresets[0])}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Try Enterprise CTOs
                </button>
                <button
                  onClick={() => applyPreset(searchPresets[4])}
                  className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Find High Intent Prospects
                </button>
              </div>
            </div>
          ) : isSearching ? (
            /* Enhanced Loading State */
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="relative">
                <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Searching Global Database</h3>
              <p className="text-gray-600 mb-6">Finding prospects that match your criteria across 200M+ records</p>
              
              {/* Search Progress */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Processing filters...</span>
                  <span>Enriching data...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          ) : (
            /* Enhanced Results */
            <div className="space-y-6">
              {/* Results Header with Data Quality */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Search Results ({searchMode === 'prospects' ? searchResults.length : companyResults.length})
                    </h3>
                    {selectedProspects.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                        {selectedProspects.length} selected
                      </span>
                    )}
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>{dataQualityScore}% Data Quality</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowSaveSearch(true)}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Search
                    </button>
                    <button
                      onClick={handleBulkEnrichment}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-700 transition-colors"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enrich All
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4 mr-2" />
                      Export ({searchMode === 'prospects' ? searchResults.length : companyResults.length})
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedProspects.length > 0 && (
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedProspects.length} prospect{selectedProspects.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        <Zap className="h-4 w-4 mr-1" />
                        Add to Sequence
                      </button>
                      <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                        <Plus className="h-4 w-4 mr-1" />
                        Add to List
                      </button>
                      <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Enrich Data
                      </button>
                      <button className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors">
                        <Download className="h-4 w-4 mr-1" />
                        Export Selected
                      </button>
                    </div>
                  </div>
                )}

                {/* Data Source Indicators */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>LinkedIn API</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Public Databases</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Custom Providers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: 2 minutes ago</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Results Grid */}
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
                            Scores
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Contact Info
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Intent Signals
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
                                    <div className={`w-2 h-2 rounded-full ${
                                      prospect.temperature === 'hot' ? 'bg-red-500' :
                                      prospect.temperature === 'warm' ? 'bg-orange-500' : 'bg-blue-500'
                                    }`} />
                                    <span className="text-xs text-gray-500">{prospect.seniority}</span>
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      {prospect.department}
                                    </span>
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
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-500">{prospect.companySize}</span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">{prospect.companyLocation}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    prospect.leadScore >= 90 ? 'bg-green-100 text-green-800' :
                                    prospect.leadScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                    prospect.leadScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {prospect.leadScore}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">Lead</p>
                                </div>
                                <div className="text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    prospect.aiScore >= 90 ? 'bg-green-100 text-green-800' :
                                    prospect.aiScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                    prospect.aiScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {prospect.aiScore}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">AI</p>
                                </div>
                                <div className="text-center">
                                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                                    {prospect.dataQuality}
                                  </span>
                                  <p className="text-xs text-gray-500 mt-1">Quality</p>
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
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm text-gray-600">{prospect.phone}</span>
                                  </div>
                                )}
                                {prospect.linkedinUrl && (
                                  <div className="flex items-center space-x-2">
                                    <Link className="h-3 w-3 text-gray-400" />
                                    <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                                      LinkedIn
                                    </a>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                  <span className="text-xs text-green-700 font-medium">High Intent</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Activity className="h-3 w-3 text-blue-600" />
                                  <span className="text-xs text-blue-700">Recent Activity</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3 text-purple-600" />
                                  <span className="text-xs text-purple-700">Viewed Pricing</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigate(`/lead-generation/prospects/${prospect.id}`)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Add to List"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                                  title="Add to Sequence"
                                >
                                  <Zap className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors"
                                  title="Enrich Data"
                                >
                                  <Sparkles className="h-4 w-4" />
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
                /* Enhanced Company Results */
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
                        {company.fundingStage && (
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{company.fundingStage}</span>
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
                      
                      {/* Technology Stack Preview */}
                      {company.techStack.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Tech Stack:</p>
                          <div className="flex flex-wrap gap-1">
                            {company.techStack.slice(0, 3).map(tech => (
                              <span key={tech} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                            {company.techStack.length > 3 && (
                              <span className="text-xs text-gray-500">+{company.techStack.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          <Users className="h-4 w-4 mr-1" />
                          View Prospects
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          <Sparkles className="h-4 w-4" />
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

      {/* Save Search Modal */}
      {showSaveSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Save Search</h3>
              <button onClick={() => setShowSaveSearch(false)}>
                <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Name</label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter search name..."
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Search Summary:</p>
                <p className="text-sm font-medium text-gray-900">
                  {estimatedResults.toLocaleString()} {searchMode} found
                </p>
                <p className="text-xs text-gray-500">
                  {Object.keys(searchCriteria).length} active filters
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveSearch(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSearch}
                disabled={!searchName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Save Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Enrichment Modal */}
      {showBulkEnrichment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enriching Data</h3>
              <p className="text-gray-600 mb-6">
                Enhancing {searchMode === 'prospects' ? searchResults.length : companyResults.length} records with fresh data
              </p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{bulkEnrichmentProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${bulkEnrichmentProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>• Verifying email addresses</p>
                <p>• Updating job titles and companies</p>
                <p>• Adding social profiles</p>
                <p>• Scoring lead quality</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectDiscovery;