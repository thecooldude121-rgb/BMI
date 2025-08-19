import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '../../data/companies';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Users, Globe, MapPin, Phone, Mail,
  TrendingUp, Calendar, BarChart3, Star, Bookmark, MoreVertical,
  ExternalLink, Download, Settings, Layers, Database, RefreshCw,
  Tag, BookmarkCheck, X, Zap, Eye, EyeOff, Columns, ChevronLeft, ChevronRight, ChevronUp,
  Building2, User
} from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

interface PersonData {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  companyId: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  companyEmployeeCount: string;
  keywords: string[];
  accessibleEmail: boolean;
  accessiblePhone: boolean;
}

interface TableColumn {
  key: string;
  label: string;
  width: string;
  minWidth?: string;
  visible: boolean;
  sortable: boolean;
}

const PeopleDiscovery: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'company' | 'title'>('relevance');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const columnManagerRef = useRef<HTMLDivElement>(null);



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

  // Define table columns with fixed widths for proper alignment
  const [columns, setColumns] = useState<TableColumn[]>([
    { key: 'name', label: 'Name', width: '300px', minWidth: '300px', visible: true, sortable: true },
    { key: 'jobTitle', label: 'Job Title', width: '200px', minWidth: '200px', visible: true, sortable: true },
    { key: 'company', label: 'Company', width: '180px', minWidth: '180px', visible: true, sortable: true },
    { key: 'location', label: 'Location', width: '160px', minWidth: '160px', visible: true, sortable: true },
    { key: 'emails', label: 'Emails', width: '220px', minWidth: '220px', visible: true, sortable: false },
    { key: 'phoneNumbers', label: 'Phone Numbers', width: '180px', minWidth: '180px', visible: false, sortable: false },
    { key: 'actions', label: 'Actions', width: '120px', minWidth: '120px', visible: true, sortable: false },
    { key: 'links', label: 'Links', width: '80px', minWidth: '80px', visible: true, sortable: false },
    { key: 'companySize', label: 'Company/Number of Employees', width: '240px', minWidth: '240px', visible: false, sortable: true },
    { key: 'keywords', label: 'Keywords', width: '200px', minWidth: '200px', visible: false, sortable: false }
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

  // Fetch contacts from CRM
  const { data: crmContacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch CRM contacts');
      return response.json();
    }
  });

  // Get companies from CRM Accounts first, fallback to local data
  const companies = useMemo(() => {
    return getCompanies(crmAccounts);
  }, [crmAccounts]);

  // Generate people data from employees in company details and CRM contacts
  const people: PersonData[] = useMemo(() => {
    const peopleFromCompanies: PersonData[] = [];
    
    // Sample employee data structure (this would come from actual employee data)
    const sampleEmployees = [
      { name: 'Abhishek Pathak', jobTitle: 'Sr. Manager of Sales', location: 'New Delhi, India', keywords: ['location based advertising solutions'] },
      { name: 'Jose Oliveira', jobTitle: 'Sales Executive', location: 'Fortaleza, Brazil', keywords: ['digital out of home'] },
      { name: 'Walter Lins', jobTitle: 'Director', location: 'Recife, Brazil', keywords: ['digital out of home'] },
      { name: 'Jennifer Araújo', jobTitle: 'Financial Controller', location: 'Belo Horizonte, Brazil', keywords: ['digital out of home'] },
      { name: 'Kalpna Kumari', jobTitle: 'HR/admin/operation', location: 'New Delhi, India', keywords: ['location based advertising solutions'] },
      { name: 'Mohd Anwer', jobTitle: 'Full Stack Developer', location: 'New Delhi, India', keywords: ['location based advertising solutions'] },
      { name: 'Rodrigo Rodrigues', jobTitle: 'Chief Marketing Officer', location: 'São Paulo, Brazil', keywords: ['digital out of home'] },
      { name: 'Klaus Alpperspach', jobTitle: 'Salesperson', location: 'Recife, Brazil', keywords: ['digital out of home'] },
      { name: 'Renan Oliveira', jobTitle: 'Administrative Assistant', location: 'São Paulo, Brazil', keywords: ['digital out of home'] },
      { name: 'Manoj Sharma', jobTitle: 'Android Developer', location: 'New Delhi, India', keywords: ['location based advertising solutions'] },
      { name: 'Ricardo Pinto', jobTitle: 'Gerente de Inteligência Comercial', location: 'São Paulo, Brazil', keywords: ['digital out of home'] }
    ];

    // Create people from companies and their employees
    companies.forEach((company, companyIndex) => {
      // Assign employees to companies in a round-robin fashion
      const companyEmployees = sampleEmployees.filter((_, index) => index % companies.length === companyIndex);
      
      companyEmployees.forEach((employee, empIndex) => {
        peopleFromCompanies.push({
          id: `person-${company.id}-${empIndex}`,
          name: employee.name,
          jobTitle: employee.jobTitle,
          company: company.name,
          companyId: company.id,
          location: employee.location,
          email: `${employee.name.toLowerCase().replace(/\s+/g, '.')}@${company.domain}`,
          phone: `+${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 90000) + 10000}`,
          linkedinUrl: `https://linkedin.com/in/${employee.name.toLowerCase().replace(/\s+/g, '-')}`,
          companyEmployeeCount: company.employeeCount,
          keywords: employee.keywords,
          accessibleEmail: Math.random() > 0.5,
          accessiblePhone: Math.random() > 0.5
        });
      });
    });

    // Add CRM contacts
    const crmPeople = crmContacts.map((contact: any) => {
      const company = crmAccounts.find((acc: any) => acc.id === contact.accountId);
      return {
        id: contact.id,
        name: contact.name || 'Unknown Contact',
        jobTitle: contact.title || 'N/A',
        company: company?.name || 'Unknown Company',
        companyId: contact.accountId || '',
        location: contact.location || company?.location || 'Unknown',
        email: contact.email || `${contact.name?.toLowerCase().replace(/\s+/g, '.')}@${company?.domain || 'company.com'}`,
        phone: contact.phone || '+1 (555) 000-0000',
        linkedinUrl: contact.linkedinUrl || `https://linkedin.com/in/${contact.name?.toLowerCase().replace(/\s+/g, '-')}`,
        companyEmployeeCount: company?.employeeCount || '1-50',
        keywords: company?.keywords || ['Business'],
        accessibleEmail: true,
        accessiblePhone: true
      };
    });

    return [...peopleFromCompanies, ...crmPeople];
  }, [companies, crmContacts, crmAccounts]);

  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  // Filter and paginate people
  const filteredPeople = useMemo(() => {
    return people.filter(person => 
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [people, searchQuery]);

  const paginatedPeople = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPeople.slice(startIndex, endIndex);
  }, [filteredPeople, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

  const visibleColumns = useMemo(() => columns.filter(col => col.visible), [columns]);



  const togglePersonSelection = (id: string) => {
    setSelectedPeople(prev => 
      prev.includes(id) 
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    );
  };

  const toggleColumnVisibility = (key: string) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const handlePersonClick = (personId: string, person: PersonData) => {
    // Navigate to person detail view or company detail view
    setLocation(`/lead-generation/company/${person.companyId}`);
  };

  const renderTableCell = (person: PersonData, column: TableColumn) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
              {person.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <button
                onClick={() => handlePersonClick(person.id, person)}
                className="font-medium text-blue-600 hover:text-blue-800 hover:scale-105 transition-all duration-200 text-left truncate block w-full"
                title={person.name}
              >
                {person.name}
              </button>
            </div>
          </div>
        );

      case 'jobTitle':
        return <span className="text-gray-900 truncate block" title={person.jobTitle}>{person.jobTitle}</span>;

      case 'company':
        return (
          <div className="flex items-center space-x-2 min-w-0">
            <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 truncate" title={person.company}>{person.company}</span>
          </div>
        );

      case 'location':
        return (
          <div className="flex items-center space-x-2 min-w-0">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 text-sm truncate" title={person.location}>{person.location}</span>
          </div>
        );

      case 'emails':
        return (
          <div className="flex items-center space-x-2 min-w-0">
            {person.accessibleEmail ? (
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700 truncate" title={person.email}>{person.email}</span>
              </div>
            ) : (
              <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 hover:scale-105 transition-all flex-shrink-0">
                Access email
              </button>
            )}
          </div>
        );

      case 'phoneNumbers':
        return (
          <div className="flex items-center space-x-2 min-w-0">
            {person.accessiblePhone ? (
              <div className="flex items-center space-x-2 min-w-0">
                <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate" title={person.phone}>{person.phone}</span>
              </div>
            ) : (
              <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 hover:scale-105 transition-all flex-shrink-0">
                Access Mobile
              </button>
            )}
          </div>
        );

      case 'actions':
        return (
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded hover:scale-110 transition-all">
              <Mail className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded hover:scale-110 transition-all">
              <Phone className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded hover:scale-110 transition-all">
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        );

      case 'links':
        return (
          <div className="flex items-center space-x-2">
            <a
              href={person.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-blue-100 rounded hover:scale-110 transition-all"
            >
              <SiLinkedin className="h-4 w-4 text-blue-600" />
            </a>
          </div>
        );

      case 'companySize':
        return (
          <div className="min-w-0">
            <div className="text-sm text-gray-900 truncate" title={person.company}>{person.company}</div>
            <div className="text-xs text-gray-600 truncate" title={person.companyEmployeeCount}>{person.companyEmployeeCount}</div>
          </div>
        );

      case 'keywords':
        return (
          <div className="flex flex-wrap gap-1 min-w-0">
            {person.keywords.slice(0, 2).map((keyword, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full truncate max-w-20 flex-shrink-0"
                title={keyword}
              >
                {keyword}
              </span>
            ))}
            {person.keywords.length > 2 && (
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full flex-shrink-0">
                +{person.keywords.length - 2}
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title and controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">People Discovery</h1>
                <p className="text-sm text-gray-600">{filteredPeople.length.toLocaleString()} prospects found</p>
              </div>
            </div>
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
              placeholder="Search by name, job title, company, location..."
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
              <option value="company">Company</option>
              <option value="title">Job Title</option>
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
                        onClick={() => setColumns(prev => prev.map(col => ({ ...col, visible: ['name', 'jobTitle', 'company', 'location', 'emails', 'actions', 'links'].includes(col.key) })))}
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

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="min-w-max">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 h-12 flex items-center sticky top-0 z-10">
            {visibleColumns.map((column) => (
              <div 
                key={column.key} 
                className="flex-shrink-0 px-4 flex items-center border-r border-gray-200 last:border-r-0"
                style={{ width: column.width }}
              >
                {column.key === 'name' && (
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPeople(paginatedPeople.map(p => p.id));
                        } else {
                          setSelectedPeople([]);
                        }
                      }}
                      checked={selectedPeople.length === paginatedPeople.length && paginatedPeople.length > 0}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{column.label}</span>
                  </div>
                )}
                {column.key !== 'name' && (
                  <span className="text-sm font-medium text-gray-700">{column.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div>
            {paginatedPeople.map((person) => (
              <div key={person.id} className="border-b border-gray-100 h-16 flex items-center hover:bg-gray-50">
                {visibleColumns.map((column) => (
                  <div 
                    key={column.key} 
                    className="flex-shrink-0 px-4 flex items-center border-r border-gray-100 last:border-r-0 min-w-0"
                    style={{ width: column.width }}
                  >
                    {column.key === 'name' && (
                      <div className="flex items-center space-x-3 w-full min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedPeople.includes(person.id)}
                          onChange={() => togglePersonSelection(person.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          {renderTableCell(person, column)}
                        </div>
                      </div>
                    )}
                    {column.key !== 'name' && (
                      <div className="w-full min-w-0">
                        {renderTableCell(person, column)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPeople.length)} of {filteredPeople.length} results
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
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
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleDiscovery;