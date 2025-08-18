import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { companies as sharedCompanies } from '../../data/companies';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Building2, Globe, Users, MapPin, DollarSign,
  TrendingUp, Calendar, BarChart3, Star, Bookmark, MoreVertical,
  ExternalLink, Download, Settings, Layers, Database, RefreshCw,
  Tag, BookmarkCheck, X, Zap, Eye, EyeOff, Columns, ChevronLeft, ChevronRight, ChevronUp
} from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

interface CompanyData {
  id: string;
  name: string;
  logo?: string;
  domain: string;
  website: string;
  linkedinUrl: string;
  industry: string;
  location: string;
  employeeCount: string;
  revenue: string;
  founded: number;
  description: string;
  technologies: string[];
  keywords: string[];
  funding: string;
  lastActivity?: Date;
  saved?: boolean;
}

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
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'employees' | 'revenue'>('relevance');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const columnManagerRef = useRef<HTMLDivElement>(null);

  // References for synchronized scrolling
  const frozenScrollRef = useRef<HTMLDivElement>(null);
  const scrollableScrollRef = useRef<HTMLDivElement>(null);

  // Close column manager when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnManagerRef.current && !columnManagerRef.current.contains(event.target as Node)) {
        setShowColumnManager(false);
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
    { key: 'actions', label: 'Actions', width: 'col-span-1', minWidth: '100px', visible: true, sortable: false }
  ]);

  // Use shared company data plus additional generated companies for pagination demo
  const companies: CompanyData[] = [
    ...sharedCompanies,
    {
      id: 'comp-3',
      name: 'DataFlow Systems',
      logo: '📊',
      domain: 'dataflow.com',
      website: 'https://dataflow.com',
      linkedinUrl: 'https://linkedin.com/company/dataflow-systems',
      industry: 'Data Analytics',
      location: 'Austin, TX',
      employeeCount: '201-500',
      revenue: '$10M-$25M',
      founded: 2018,
      description: 'Real-time data processing and analytics platform',
      technologies: ['Apache Kafka', 'Elasticsearch', 'Docker', 'Kubernetes'],
      keywords: ['Big Data', 'Real-time', 'Analytics', 'Platform', 'Data Science'],
      funding: 'Series A - $8M',
      saved: false
    },
    {
      id: 'comp-4',
      name: 'CloudSecure Inc',
      logo: '🔒',
      domain: 'cloudsecure.com',
      website: 'https://cloudsecure.com',
      linkedinUrl: 'https://linkedin.com/company/cloudsecure-inc',
      industry: 'Cybersecurity',
      location: 'Seattle, WA',
      employeeCount: '101-200',
      revenue: '$5M-$10M',
      founded: 2020,
      description: 'Cloud security and compliance solutions',
      technologies: ['AWS Security', 'Azure', 'Zero Trust', 'SIEM'],
      keywords: ['Security', 'Compliance', 'Cloud Protection', 'Zero Trust', 'DevSecOps'],
      funding: 'Seed - $3M',
      saved: false
    },
    {
      id: 'comp-5',
      name: 'FinTech Innovations',
      logo: '💳',
      domain: 'fintechinnovations.com',
      website: 'https://fintechinnovations.com',
      linkedinUrl: 'https://linkedin.com/company/fintech-innovations',
      industry: 'Financial Technology',
      location: 'Boston, MA',
      employeeCount: '51-100',
      revenue: '$1M-$5M',
      founded: 2021,
      description: 'Digital payment and lending solutions',
      technologies: ['Blockchain', 'React Native', 'Node.js', 'PostgreSQL'],
      keywords: ['FinTech', 'Payments', 'Lending', 'Digital Banking', 'Blockchain'],
      funding: 'Pre-seed - $1.5M',
      saved: true
    },
    // Add more companies for demonstration
    {
      id: 'comp-6',
      name: 'TechCorp Solutions',
      logo: '⚡',
      domain: 'techcorp.com',
      website: 'https://techcorp.com',
      linkedinUrl: 'https://linkedin.com/company/techcorp-solutions',
      industry: 'Software Development',
      location: 'Chicago, IL',
      employeeCount: '301-500',
      revenue: '$15M-$25M',
      founded: 2016,
      description: 'Custom software development and consulting',
      technologies: ['React', 'Python', 'AWS', 'Docker'],
      keywords: ['Software', 'Consulting', 'Custom Development', 'Agile'],
      funding: 'Bootstrap',
      saved: false
    },
    // Adding more entries to demonstrate pagination
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `comp-${i + 7}`,
      name: `Company ${i + 7}`,
      logo: '🏢',
      domain: `company${i + 7}.com`,
      website: `https://company${i + 7}.com`,
      linkedinUrl: `https://linkedin.com/company/company-${i + 7}`,
      industry: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail'][i % 5],
      location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'][i % 5],
      employeeCount: ['1-50', '51-200', '201-500', '501-1000', '1001-5000'][i % 5],
      revenue: ['$1M-$5M', '$5M-$10M', '$10M-$25M', '$25M-$50M', '$50M-$100M'][i % 5],
      founded: 2010 + (i % 10),
      description: `Sample company description for Company ${i + 7}`,
      technologies: [['React', 'Node.js'], ['Python', 'Django'], ['Java', 'Spring'], ['Vue', 'Express'], ['Angular', 'Rails']][i % 5],
      keywords: [['Tech', 'Innovation'], ['Health', 'Medical'], ['Finance', 'Banking'], ['Manufacturing', 'Industrial'], ['Retail', 'E-commerce']][i % 5],
      funding: ['Seed', 'Series A', 'Series B', 'Series C', 'Bootstrap'][i % 5],
      saved: i % 3 === 0
    }))
  ];

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Filter and paginate companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [companies, searchQuery]);

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

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
      
      default:
        return null;
    }
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
                className="text-gray-500 hover:text-gray-700 icon-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Empty Filter State */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="text-center">
              <Filter className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No filters applied</p>
              <p className="text-xs text-gray-400 mt-1">Add filters to refine your search</p>
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
              {/* Left side - Title */}
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">Companies</h1>
                <span className="text-gray-500">({companies.length})</span>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 btn-hover"
                >
                  <Filter className="h-4 w-4 inline mr-2 icon-hover" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 btn-hover">
                  <Zap className="h-4 w-4 inline mr-2 icon-hover" />
                  Enrich Data
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 icon-hover" />
                <input
                  type="text"
                  placeholder="Search by company name, industry, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover-border-glow"
                />
              </div>
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 btn-hover">
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
        </div>

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
      </div>
    </div>
  );
};

export default CompanyDiscovery;