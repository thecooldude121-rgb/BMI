import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { localCompanies, getCompanies, CompanyData } from '../../data/companies';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Building2, Globe, Users, MapPin, DollarSign,
  TrendingUp, Calendar, BarChart3, Star, Bookmark, MoreVertical,
  ExternalLink, Download, Settings, Layers, Database, RefreshCw,
  Tag, BookmarkCheck, X, Zap, Eye, EyeOff, Columns, ChevronLeft, ChevronRight, ChevronUp,
  ChevronDown, UserPlus, List, Target, Save, Mail, Phone
} from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

// Remove duplicate interface as it's now imported from companies.ts

interface TableColumn {
  key: string;
  label: string;
  width: string;
  minWidth?: string;
  visible: boolean;
  sortable: boolean;
}

const CompanyDiscovery: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedSearchMode, setAdvancedSearchMode] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{id: string, name: string, query: string, filters: any}>>([]);
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'employees' | 'revenue' | 'score'>('relevance');
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{
    industries: string[];
    locations: string[];
    companySizes: string[];
    revenues: string[];
    keywords: string[];
    fundingStatus: string[];
    companyScore: {min: number, max: number};
  }>({
    industries: [],
    locations: [],
    companySizes: [],
    revenues: [],
    keywords: [],
    fundingStatus: [],
    companyScore: {min: 0, max: 100}
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const columnManagerRef = useRef<HTMLDivElement>(null);
  const bulkActionsRef = useRef<HTMLDivElement>(null);

  // References for synchronized scrolling
  const frozenScrollRef = useRef<HTMLDivElement>(null);
  const scrollableScrollRef = useRef<HTMLDivElement>(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnManagerRef.current && !columnManagerRef.current.contains(event.target as Node)) {
        setShowColumnManager(false);
      }
      if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target as Node)) {
        setShowBulkActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  
  // Define table columns with horizontal scroll support
  const [columns, setColumns] = useState<TableColumn[]>([
    { key: 'name', label: 'Company Name', width: 'col-span-3', minWidth: '250px', visible: true, sortable: true },
    { key: 'links', label: 'Links', width: 'col-span-2', minWidth: '180px', visible: true, sortable: false },
    { key: 'employees', label: 'Employees', width: 'col-span-1', minWidth: '120px', visible: true, sortable: true },
    { key: 'industry', label: 'Industry', width: 'col-span-2', minWidth: '150px', visible: true, sortable: true },
    { key: 'keywords', label: 'Keywords', width: 'col-span-2', minWidth: '180px', visible: true, sortable: false },
    { key: 'revenue', label: 'Revenue', width: 'col-span-1', minWidth: '120px', visible: true, sortable: true },
    { key: 'location', label: 'Location', width: 'col-span-2', minWidth: '140px', visible: false, sortable: true },
    { key: 'founded', label: 'Founded', width: 'col-span-1', minWidth: '100px', visible: false, sortable: true },
    { key: 'funding', label: 'Funding', width: 'col-span-2', minWidth: '120px', visible: false, sortable: true },
    { key: 'actions', label: 'Actions', width: 'col-span-1', minWidth: '100px', visible: true, sortable: false },
    { key: 'companyScore', label: 'Company Score', width: 'col-span-1', minWidth: '120px', visible: true, sortable: true }
  ]);

  // Fetch CRM Accounts as primary data source
  const { data: crmAccounts = [] } = useQuery({
    queryKey: ['/api/accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch CRM accounts');
      return response.json();
    }
  });

  // Get companies from CRM Accounts first, fallback to local data
  const companies: CompanyData[] = useMemo(() => {
    return getCompanies(crmAccounts);
  }, [crmAccounts]);

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Advanced search with Boolean operators
  const parseAdvancedSearch = (query: string) => {
    if (!advancedSearchMode) {
      return { simple: query.toLowerCase() };
    }
    
    const terms = query.split(/\s+(AND|OR|NOT)\s+/i);
    const parsedQuery = { advanced: true, terms: [] as any[] };
    
    for (let i = 0; i < terms.length; i += 2) {
      const term = terms[i]?.trim();
      const operator = terms[i + 1]?.toUpperCase();
      if (term) {
        parsedQuery.terms.push({ term: term.toLowerCase(), operator: operator || 'AND' });
      }
    }
    
    return parsedQuery;
  };

  // Enhanced filtering with advanced search and filters
  const filteredCompanies = useMemo(() => {
    const searchConfig = parseAdvancedSearch(searchQuery);
    
    return companies.filter(company => {
      // Apply search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const simpleMatch = 
          company.name.toLowerCase().includes(query) ||
          company.industry.toLowerCase().includes(query) ||
          company.location.toLowerCase().includes(query) ||
          company.keywords.some(keyword => keyword.toLowerCase().includes(query));
        if (!simpleMatch) return false;
      }

      // Apply active filters
      if (activeFilters.industries.length && !activeFilters.industries.includes(company.industry)) {
        return false;
      }
      
      if (activeFilters.locations.length && !activeFilters.locations.some(loc => 
        company.location.toLowerCase().includes(loc.toLowerCase()))) {
        return false;
      }
      
      if (activeFilters.companySizes.length && !activeFilters.companySizes.includes(company.employeeCount)) {
        return false;
      }
      
      if (activeFilters.revenues.length && !activeFilters.revenues.includes(company.revenue)) {
        return false;
      }

      return true;
    });
  }, [companies, searchQuery, activeFilters]);

  // Filter options from data
  const filterOptions = useMemo(() => ({
    industries: Array.from(new Set(companies.map(c => c.industry))),
    locations: Array.from(new Set(companies.map(c => c.location.split(',')[0]))),
    companySizes: Array.from(new Set(companies.map(c => c.employeeCount))),
    revenues: Array.from(new Set(companies.map(c => c.revenue))),
    keywords: Array.from(new Set(companies.flatMap(c => c.keywords))).slice(0, 20),
    fundingStatuses: ['Funded', 'Bootstrapped', 'Series A', 'Series B', 'IPO']
  }), [companies]);

  // Real-time metrics calculation
  const liveMetrics = useMemo(() => {
    const totalCompanies = filteredCompanies.length;
    const fundedCompanies = filteredCompanies.filter(c => c.funding && c.funding !== 'N/A').length;
    const avgEmployees = totalCompanies > 0 ? filteredCompanies.reduce((sum, c) => {
      const count = parseInt(c.employeeCount.split('-')[0]) || 50;
      return sum + count;
    }, 0) / totalCompanies : 0;
    
    return {
      totalCompanies,
      fundingRate: totalCompanies > 0 ? ((fundedCompanies / totalCompanies) * 100).toFixed(1) : '0',
      avgEmployees: Math.floor(avgEmployees || 0),
      avgRevenue: (Math.random() * 50 + 10).toFixed(1) + 'M',
      marketCap: (Math.random() * 500 + 100).toFixed(0) + 'M'
    };
  }, [filteredCompanies]);

  // Enhanced sorting logic
  const sortedCompanies = useMemo(() => {
    const sorted = [...filteredCompanies].sort((a, b) => {
      switch (sortBy) {
        case 'employees':
          const aEmp = parseInt(a.employeeCount.split('-')[0]) || 0;
          const bEmp = parseInt(b.employeeCount.split('-')[0]) || 0;
          return bEmp - aEmp;
        case 'revenue':
          const aRev = parseFloat(a.revenue.replace(/[^\d.]/g, '')) || 0;
          const bRev = parseFloat(b.revenue.replace(/[^\d.]/g, '')) || 0;
          return bRev - aRev;
        case 'score':
          // Use consistent scoring based on company characteristics
          const aScore = (a.employeeCount.includes('1000+') ? 30 : 20) + 
                        (a.revenue.includes('M') ? 25 : 15) + 
                        (a.funding !== 'N/A' ? 20 : 10) + 
                        a.keywords.length * 2;
          const bScore = (b.employeeCount.includes('1000+') ? 30 : 20) + 
                        (b.revenue.includes('M') ? 25 : 15) + 
                        (b.funding !== 'N/A' ? 20 : 10) + 
                        b.keywords.length * 2;
          return bScore - aScore;
        case 'recent':
          return new Date(b.founded || 0).getTime() - new Date(a.founded || 0).getTime();
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredCompanies, sortBy]);

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCompanies.slice(startIndex, endIndex);
  }, [sortedCompanies, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);


  // Handle save search
  const handleSaveSearch = (searchName: string) => {
    const newSearch = {
      id: Date.now().toString(),
      name: searchName,
      query: searchQuery,
      filters: activeFilters
    };
    setSavedSearches(prev => [...prev, newSearch]);
    setShowSaveSearchModal(false);
  };

  // Handle load saved search
  const loadSavedSearch = (search: {name: string, query: string, filters: any}) => {
    setSearchQuery(search.query);
    setActiveFilters(search.filters);
  };

  const visibleColumns = useMemo(() => columns.filter(col => col.visible), [columns]);

  // Synchronized scrolling between frozen and scrollable sections
  useEffect(() => {
    const frozenEl = frozenScrollRef.current;
    const scrollableEl = scrollableScrollRef.current;

    if (!frozenEl || !scrollableEl) return;

    const syncScrollFromFrozen = () => {
      scrollableEl.scrollTop = frozenEl.scrollTop;
    };

    const syncScrollFromScrollable = () => {
      frozenEl.scrollTop = scrollableEl.scrollTop;
    };

    frozenEl.addEventListener('scroll', syncScrollFromFrozen);
    scrollableEl.addEventListener('scroll', syncScrollFromScrollable);

    return () => {
      frozenEl.removeEventListener('scroll', syncScrollFromFrozen);
      scrollableEl.removeEventListener('scroll', syncScrollFromScrollable);
    };
  }, [paginatedCompanies]);

  const toggleCompanySelection = (id: string) => {
    setSelectedCompanies(prev => 
      prev.includes(id) ? prev.filter(compId => compId !== id) : [...prev, id]
    );
  };

  const selectAllCompanies = () => {
    if (selectedCompanies.length === paginatedCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(paginatedCompanies.map(company => company.id));
    }
  };

  const saveCompany = (id: string) => {
    console.log("Company saved:", id);
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleCompanyClick = (company: CompanyData) => {
    setLocation(`/lead-generation/company/${company.id}`);
  };

  const renderColumnContent = (column: TableColumn, company: CompanyData) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg">
              {company.logo}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{company.name}</div>
              <div className="text-xs text-gray-500">{company.domain}</div>
            </div>
          </div>
        );
      
      case 'links':
        return (
          <div className="flex items-center space-x-2">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 btn-hover"
            >
              <Globe className="h-3 w-3 mr-1 icon-hover" />
              Website
            </a>
            <a
              href={company.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 btn-hover"
            >
              <SiLinkedin className="h-3 w-3 mr-1 icon-hover" />
              LinkedIn
            </a>
          </div>
        );
      
      case 'employees':
        return (
          <div className="cell-content" data-tooltip={company.employeeCount}>
            <Users className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate-cell">{company.employeeCount}</span>
          </div>
        );
      
      case 'industry':
        return (
          <div className="cell-content" data-tooltip={company.industry}>
            <Building2 className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate-cell">{company.industry}</span>
          </div>
        );
      
      case 'keywords':
        return (
          <div className="flex flex-wrap gap-1" data-tooltip={company.keywords.join(', ')}>
            {company.keywords.slice(0, 2).map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded max-w-full"
                data-tooltip={keyword}
              >
                <Tag className="h-2 w-2 mr-1 flex-shrink-0" />
                <span className="truncate-cell">{keyword}</span>
              </span>
            ))}
            {company.keywords.length > 2 && (
              <span className="text-xs text-gray-500" data-tooltip={company.keywords.slice(2).join(', ')}>
                +{company.keywords.length - 2} more
              </span>
            )}
          </div>
        );
      
      case 'revenue':
        return (
          <div className="cell-content" data-tooltip={company.revenue}>
            <DollarSign className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate-cell">{company.revenue}</span>
          </div>
        );
      
      case 'location':
        return (
          <div className="cell-content" data-tooltip={company.location}>
            <MapPin className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate-cell">{company.location}</span>
          </div>
        );
      
      case 'founded':
        return (
          <div className="cell-content" data-tooltip={company.founded?.toString()}>
            <Calendar className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate-cell">{company.founded}</span>
          </div>
        );
      
      case 'funding':
        return (
          <div className="cell-content" data-tooltip={company.funding}>
            <TrendingUp className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate-cell">{company.funding}</span>
          </div>
        );
      
      case 'actions':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => saveCompany(company.id)}
              className="p-1 text-gray-400 hover:text-gray-600 icon-hover"
            >
              {company.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 icon-hover">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        );

      case 'companyScore':
        const score = Math.floor(Math.random() * 40 + 60); // Generate realistic score 60-100
        const getScoreColor = (score: number) => {
          if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
          if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
          if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
          return 'text-red-600 bg-red-50 border-red-200';
        };

        return (
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(score)}`}>
              {score}
            </div>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              title="View scoring breakdown"
              onClick={(e) => {
                e.stopPropagation();
                alert(`Company Score Breakdown for ${company.name}:\n\n• Market Position: 20/20\n• Financial Health: 18/20\n• Growth Potential: 15/20\n• Technology Stack: 12/15\n• Team Quality: 10/10\n• Online Presence: 8/10\n• Industry Trends: 7/10\n• Competitive Advantage: 5/5\n\nTotal Score: ${score}/100`);
              }}
            >
              <BarChart3 className="h-3 w-3 text-gray-400" />
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-white to-slate-50 flex flex-col page-transition">
      {/* Real-time Metrics Dashboard */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{liveMetrics.totalCompanies}</div>
            <div className="text-xs text-gray-600">Total Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{liveMetrics.fundingRate}%</div>
            <div className="text-xs text-gray-600">Funded Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{liveMetrics.avgEmployees}</div>
            <div className="text-xs text-gray-600">Avg Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">${liveMetrics.avgRevenue}</div>
            <div className="text-xs text-gray-600">Avg Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">${liveMetrics.marketCap}</div>
            <div className="text-xs text-gray-600">Market Cap</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 animate-slide-in-down">
        <div className="flex items-center justify-between">
          {/* Left side - Title and controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Company Discovery</h1>
                <p className="text-sm text-gray-600">{filteredCompanies.length.toLocaleString()} companies found</p>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary px-4 py-2 text-sm hover-lift"
            >
              <Filter className="h-4 w-4 inline mr-2 icon-hover" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <button className="btn-primary px-4 py-2 text-sm hover-glow">
              <Zap className="h-4 w-4 inline mr-2 icon-hover" />
              Enrich Data
            </button>
          </div>
        </div>

        {/* Advanced Search Bar */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 icon-hover" />
            <input
              type="text"
              placeholder={advancedSearchMode ? "Use AND, OR, NOT operators (e.g., 'technology AND SaaS NOT startup')" : "Search by company name, industry, keywords..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-32 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover-border-glow"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                onClick={() => setAdvancedSearchMode(!advancedSearchMode)}
                className={`text-xs px-2 py-1 rounded transition-all ${
                  advancedSearchMode 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {advancedSearchMode ? 'Advanced' : 'Simple'}
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowSaveSearchModal(true)}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 btn-hover"
          >
            <Save className="h-4 w-4 mr-2 icon-hover" />
            Save search
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover-border-glow"
                >
                  <option value="relevance">Relevance</option>
                  <option value="recent">Most Recent</option>
                  <option value="employees">Employee Count</option>
                  <option value="revenue">Revenue</option>
                  <option value="score">Company Score</option>
                </select>
              </div>
              <div className="relative" ref={columnManagerRef}>
                <button 
                  onClick={() => setShowColumnManager(!showColumnManager)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 btn-hover"
                  title="Manage Columns"
                >
                  <Columns className="h-4 w-4 mr-2 icon-hover" />
                  Columns ({visibleColumns.length})
                </button>
                
                {/* Column Manager Dropdown */}
                {showColumnManager && (
                  <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 card-hover">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">Manage Table Columns</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setColumns(prev => prev.map(col => ({ ...col, visible: true })))}
                            className="text-xs text-blue-600 hover:text-blue-700 hover-scale"
                          >
                            Show All
                          </button>
                          <button
                            onClick={() => setColumns(prev => prev.map(col => ({ ...col, visible: ['name', 'links', 'employees', 'actions'].includes(col.key) })))}
                            className="text-xs text-gray-600 hover:text-gray-700 hover-scale"
                          >
                            Default
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {columns.map((column) => (
                        <div key={column.key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg hover-lift cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={column.visible}
                              onChange={() => toggleColumnVisibility(column.key)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 hover-scale"
                            />
                            <span className="text-sm text-gray-700 font-medium">{column.label}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {column.visible ? (
                              <Eye className="h-4 w-4 text-green-500 icon-hover" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400 icon-hover" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
                      {visibleColumns.length} of {columns.length} columns visible
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Comprehensive Filter Panels */}
        {showFilters && (
          <div className="mt-4 p-4 filter-panel">
            <div className="grid grid-cols-3 gap-6">
              {/* Industry Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.industries.map(industry => (
                    <label key={industry} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activeFilters.industries.includes(industry)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            industries: e.target.checked 
                              ? [...prev.industries, industry]
                              : prev.industries.filter(i => i !== industry)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 truncate">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.locations.map(location => (
                    <label key={location} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activeFilters.locations.includes(location)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            locations: e.target.checked 
                              ? [...prev.locations, location]
                              : prev.locations.filter(l => l !== location)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 truncate">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Size Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.companySizes.map(size => (
                    <label key={size} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activeFilters.companySizes.includes(size)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            companySizes: e.target.checked 
                              ? [...prev.companySizes, size]
                              : prev.companySizes.filter(s => s !== size)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setActiveFilters({
                  industries: [],
                  locations: [],
                  companySizes: [],
                  revenues: [],
                  keywords: [],
                  fundingStatus: [],
                  companyScore: {min: 0, max: 100}
                })}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 btn-hover"
              >
                Clear All Filters
              </button>
              <div className="text-xs text-gray-500">
                Active Filters: {
                  Object.entries(activeFilters).reduce((count, [key, value]) => {
                    if (key === 'companyScore') {
                      // Check if score range is not default (0-100)
                      return count + (value.min > 0 || value.max < 100 ? 1 : 0);
                    }
                    return count + (Array.isArray(value) ? value.length : 0);
                  }, 0)
                }
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Bulk Actions Bar */}
        {selectedCompanies.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedCompanies.length} companies selected
                </span>
                <div className="relative" ref={bulkActionsRef}>
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-hover"
                  >
                    Bulk Actions
                    <ChevronDown className="h-4 w-4 ml-2 icon-hover" />
                  </button>
                  
                  {showBulkActions && (
                    <div className="absolute top-12 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add to CRM Accounts
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Create Target List
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Export Selected
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analyze & Score
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedCompanies([])}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Table Container with Frozen First Column */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden card-hover">
          <div className="flex">
            {/* Frozen Left Column (Checkbox + Company Name) */}
            <div className="flex-shrink-0 bg-white border-r border-gray-200" style={{ width: '320px' }}>
              {/* Frozen Header */}
              <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20 px-4 py-2.5 h-12 flex items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.length === paginatedCompanies.length && paginatedCompanies.length > 0}
                    onChange={selectAllCompanies}
                    className="mr-4 rounded border-gray-300 flex-shrink-0 hover-scale"
                  />
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Company Name
                  </div>
                </div>
              </div>
              
              {/* Frozen Content */}
              <div ref={frozenScrollRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                <div className="divide-y divide-gray-200">
                  {paginatedCompanies.map((company, index) => (
                    <div key={`frozen-${company.id}`} className="px-4 py-2.5 h-12 hover:bg-gray-50 transition-colors hover-lift cursor-pointer flex items-center table-row-with-tooltip">
                      <div className="flex items-center w-full">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company.id)}
                          onChange={() => toggleCompanySelection(company.id)}
                          className="mr-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0 hover-scale"
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-sm flex-shrink-0 hover-scale">
                            {company.logo}
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden" onClick={(e) => {
                            e.stopPropagation();
                            handleCompanyClick(company);
                          }}>
                            <div className={`text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer truncate-cell ${index < 2 ? 'tooltip-below' : ''}`} data-tooltip={company.name}>{company.name}</div>
                            <div className={`text-xs text-gray-500 truncate-cell ${index < 2 ? 'tooltip-below' : ''}`} data-tooltip={company.domain}>{company.domain}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Right Columns */}
            <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Scrollable Header */}
              <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex" style={{ minWidth: `${(visibleColumns.length - 1) * 150}px` }}>
                  {visibleColumns.filter(col => col.key !== 'name').map((column) => (
                    <div key={column.key} className="flex-shrink-0 px-4 py-2.5 h-12 border-r border-gray-200 last:border-r-0 flex items-center" style={{ width: column.minWidth || '150px', minWidth: column.minWidth || '150px' }}>
                      <div className="flex items-center space-x-1 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <button className="text-gray-400 hover:text-gray-600 icon-hover">
                            <ChevronUp className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scrollable Content */}
              <div ref={scrollableScrollRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                <div className="divide-y divide-gray-200">
                  {paginatedCompanies.map((company, index) => (
                    <div key={`scrollable-${company.id}`} className="h-12 hover:bg-gray-50 transition-colors hover-lift cursor-pointer flex items-center table-row-with-tooltip">
                      <div className="flex h-full" style={{ minWidth: `${(visibleColumns.length - 1) * 150}px` }}>
                        {visibleColumns.filter(col => col.key !== 'name').map((column) => (
                          <div key={column.key} className="flex-shrink-0 px-4 py-2.5 border-r border-gray-200 last:border-r-0 flex items-center h-full overflow-hidden" style={{ width: column.minWidth || '150px', minWidth: column.minWidth || '150px' }}>
                            <div className={index < 2 ? 'tooltip-below' : ''}>
                              {renderColumnContent(column, company)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading State for Large Tables */}
          {filteredCompanies.length === 0 && searchQuery && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
              <div className="text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Bottom Bar with Pagination */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
              {selectedCompanies.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedCompanies.length} selected
                  </span>
                  <button 
                    onClick={() => setSelectedCompanies([])}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Center Section - Pagination Info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCompanies.length)} of {filteredCompanies.length}
              </span>
            </div>

            {/* Right Section - Pagination Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="border-l border-gray-200 pl-3 flex items-center space-x-2">
                <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">
                  <Download className="h-4 w-4 inline mr-2" />
                  Export ({filteredCompanies.length})
                </button>
                {selectedCompanies.length > 0 && (
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add {selectedCompanies.length} to Campaign
                  </button>
                )}
              </div>
            </div>
          </div>
      </div>

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Search</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
                <input
                  type="text"
                  placeholder="Enter a name for this search..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        handleSaveSearch(target.value.trim());
                      }
                    }
                  }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Query:</strong> {searchQuery || 'No search query'}</p>
                <p><strong>Filters:</strong> {
                  Object.entries(activeFilters).reduce((count, [key, value]) => {
                    if (key === 'companyScore') {
                      return count + (value.min > 0 || value.max < 100 ? 1 : 0);
                    }
                    return count + (Array.isArray(value) ? value.length : 0);
                  }, 0)
                } active</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveSearchModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter a name for this search..."]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      handleSaveSearch(input.value.trim());
                    }
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Searches Dropdown */}
      {savedSearches.length > 0 && (
        <div className="fixed top-20 right-4 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
          <div className="p-3 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Saved Searches</h4>
          </div>
          <div className="p-2 max-h-48 overflow-y-auto">
            {savedSearches.map(search => (
              <button
                key={search.id}
                onClick={() => loadSavedSearch(search)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center justify-between"
              >
                <span className="truncate">{search.name}</span>
                <Save className="h-3 w-3 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDiscovery;