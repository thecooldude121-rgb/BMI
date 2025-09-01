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
  Building2, User, ChevronDown, UserPlus, List, Target, Save, Award
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
  const [advancedSearchMode, setAdvancedSearchMode] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{id: string, name: string, query: string, filters: any}>>([]);
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'company' | 'title' | 'score'>('relevance');
  const [multiSort, setMultiSort] = useState<Array<{field: string, direction: 'asc' | 'desc'}>>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState<{
    industries: string[];
    locations: string[];
    companySizes: string[];
    jobTitles: string[];
    keywords: string[];
    emailStatus: string[];
    leadScore: {min: number, max: number};
  }>({
    industries: [],
    locations: [],
    companySizes: [],
    jobTitles: [],
    keywords: [],
    emailStatus: [],
    leadScore: {min: 0, max: 100}
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [groupBy, setGroupBy] = useState<string>('');
  const columnManagerRef = useRef<HTMLDivElement>(null);
  const bulkActionsRef = useRef<HTMLDivElement>(null);



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
    { key: 'keywords', label: 'Keywords & Trends', width: '320px', minWidth: '320px', visible: true, sortable: false },
    { key: 'leadScore', label: 'Lead Score', width: '120px', minWidth: '120px', visible: true, sortable: true }
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
    
    // Industry-specific SEO keywords mapping
    const industryKeywords: { [key: string]: string[] } = {
      'digital advertising': [
        'programmatic advertising', 'real-time bidding', 'demand side platform', 'supply side platform', 
        'ad exchange', 'native advertising', 'display advertising', 'video advertising', 'mobile advertising',
        'retargeting campaigns', 'audience targeting', 'brand awareness', 'performance marketing', 'attribution modeling',
        'viewability optimization', 'ad fraud prevention', 'cross-device tracking', 'location-based advertising',
        'digital out of home', 'DOOH advertising', 'connected TV advertising', 'streaming advertising'
      ],
      'technology': [
        'software development', 'cloud computing', 'artificial intelligence', 'machine learning', 'data analytics',
        'cybersecurity', 'blockchain technology', 'API development', 'mobile app development', 'web development',
        'DevOps', 'agile methodology', 'microservices', 'containerization', 'database management',
        'user experience design', 'digital transformation', 'enterprise software', 'SaaS solutions', 'IoT development'
      ],
      'marketing': [
        'digital marketing', 'content marketing', 'social media marketing', 'email marketing', 'SEO optimization',
        'PPC advertising', 'conversion optimization', 'marketing automation', 'lead generation', 'brand management',
        'influencer marketing', 'affiliate marketing', 'growth hacking', 'customer acquisition', 'retention marketing',
        'marketing analytics', 'customer journey mapping', 'omnichannel marketing', 'video marketing', 'viral marketing'
      ],
      'finance': [
        'financial services', 'investment management', 'risk assessment', 'portfolio management', 'financial planning',
        'accounting software', 'fintech solutions', 'payment processing', 'cryptocurrency', 'blockchain finance',
        'regulatory compliance', 'audit services', 'tax optimization', 'wealth management', 'insurance technology',
        'credit scoring', 'lending platforms', 'robo-advisors', 'financial analytics', 'banking solutions'
      ],
      'healthcare': [
        'healthcare technology', 'telemedicine', 'electronic health records', 'medical devices', 'pharmaceutical',
        'clinical research', 'patient care', 'health analytics', 'medical software', 'healthcare compliance',
        'digital health', 'wellness platforms', 'medical imaging', 'laboratory services', 'healthcare data',
        'patient engagement', 'medical AI', 'remote monitoring', 'healthcare cybersecurity', 'precision medicine'
      ]
    };

    // Sample employee data with industry-matched keywords
    const sampleEmployees = [
      { 
        name: 'Abhishek Pathak', 
        jobTitle: 'Sr. Manager of Sales', 
        location: 'New Delhi, India', 
        industry: 'digital advertising',
        keywords: industryKeywords['digital advertising'].slice(0, 8)
      },
      { 
        name: 'Jose Oliveira', 
        jobTitle: 'Sales Executive', 
        location: 'Fortaleza, Brazil', 
        industry: 'digital advertising',
        keywords: industryKeywords['digital advertising'].slice(8, 16)
      },
      { 
        name: 'Walter Lins', 
        jobTitle: 'Director', 
        location: 'Recife, Brazil', 
        industry: 'digital advertising',
        keywords: industryKeywords['digital advertising'].slice(16, 22)
      },
      { 
        name: 'Jennifer Araújo', 
        jobTitle: 'Financial Controller', 
        location: 'Belo Horizonte, Brazil', 
        industry: 'finance',
        keywords: industryKeywords['finance'].slice(0, 8)
      },
      { 
        name: 'Kalpna Kumari', 
        jobTitle: 'HR/admin/operation', 
        location: 'New Delhi, India', 
        industry: 'technology',
        keywords: industryKeywords['technology'].slice(0, 6)
      },
      { 
        name: 'Mohd Anwer', 
        jobTitle: 'Full Stack Developer', 
        location: 'New Delhi, India', 
        industry: 'technology',
        keywords: industryKeywords['technology'].slice(6, 12)
      },
      { 
        name: 'Rodrigo Rodrigues', 
        jobTitle: 'Chief Marketing Officer', 
        location: 'São Paulo, Brazil', 
        industry: 'marketing',
        keywords: industryKeywords['marketing'].slice(0, 8)
      },
      { 
        name: 'Klaus Alpperspach', 
        jobTitle: 'Salesperson', 
        location: 'Recife, Brazil', 
        industry: 'marketing',
        keywords: industryKeywords['marketing'].slice(8, 14)
      },
      { 
        name: 'Renan Oliveira', 
        jobTitle: 'Administrative Assistant', 
        location: 'São Paulo, Brazil', 
        industry: 'technology',
        keywords: industryKeywords['technology'].slice(12, 18)
      },
      { 
        name: 'Manoj Sharma', 
        jobTitle: 'Android Developer', 
        location: 'New Delhi, India', 
        industry: 'technology',
        keywords: industryKeywords['technology'].slice(18, 20).concat(industryKeywords['technology'].slice(0, 2))
      },
      { 
        name: 'Ricardo Pinto', 
        jobTitle: 'Gerente de Inteligência Comercial', 
        location: 'São Paulo, Brazil', 
        industry: 'marketing',
        keywords: industryKeywords['marketing'].slice(14, 20)
      }
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

    // Add CRM contacts with industry-specific keywords
    const crmPeople = crmContacts.map((contact: any, index: number) => {
      const company = crmAccounts.find((acc: any) => acc.id === contact.accountId);
      
      // Determine industry based on company type or job title
      let industry = 'technology'; // default
      const jobTitle = (contact.title || '').toLowerCase();
      const companyName = (company?.name || '').toLowerCase();
      
      if (jobTitle.includes('marketing') || jobTitle.includes('sales') || companyName.includes('marketing')) {
        industry = 'marketing';
      } else if (jobTitle.includes('finance') || jobTitle.includes('accounting') || companyName.includes('finance')) {
        industry = 'finance';
      } else if (jobTitle.includes('health') || companyName.includes('health') || companyName.includes('medical')) {
        industry = 'healthcare';
      } else if (jobTitle.includes('advertising') || companyName.includes('advertising') || companyName.includes('media')) {
        industry = 'digital advertising';
      }
      
      // Get relevant keywords for the industry
      const relevantKeywords = industryKeywords[industry] || industryKeywords['technology'];
      const startIndex = (index * 6) % relevantKeywords.length;
      const selectedKeywords = relevantKeywords.slice(startIndex, startIndex + 6);
      
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
        keywords: selectedKeywords,
        accessibleEmail: true,
        accessiblePhone: true
      };
    });

    return [...peopleFromCompanies, ...crmPeople];
  }, [companies, crmContacts, crmAccounts]);

  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  // Filter options from data
  const filterOptions = useMemo(() => ({
    industries: [...new Set(people.map(p => p.industry))],
    locations: [...new Set(people.map(p => p.location.split(',')[0]))],
    jobTitles: [...new Set(people.map(p => p.jobTitle))],
    companies: [...new Set(people.map(p => p.company))],
    companySizes: [...new Set(people.map(p => p.companyEmployeeCount))],
    keywords: [...new Set(people.flatMap(p => p.keywords))].slice(0, 20),
    seniorities: ['C-Level', 'VP', 'Director', 'Manager', 'Senior', 'Junior'],
    emailStatuses: ['Verified', 'Unverified', 'Bounced', 'Unknown']
  }), [people]);

  // Advanced search with Boolean operators
  const parseAdvancedSearch = (query: string) => {
    if (!advancedSearchMode) {
      return { simple: query.toLowerCase() };
    }
    
    // Parse Boolean operators (AND, OR, NOT)
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
  const filteredPeople = useMemo(() => {
    const searchConfig = parseAdvancedSearch(searchQuery);
    
    return people.filter(person => {
      // Apply advanced search
      if (searchConfig.advanced) {
        let matches = false;
        for (const { term, operator } of searchConfig.terms) {
          const termMatches = 
            person.name.toLowerCase().includes(term) ||
            person.jobTitle.toLowerCase().includes(term) ||
            person.company.toLowerCase().includes(term) ||
            person.location.toLowerCase().includes(term) ||
            person.keywords.some(keyword => keyword.toLowerCase().includes(term));
          
          if (operator === 'NOT') {
            if (termMatches) return false;
          } else if (operator === 'OR') {
            matches = matches || termMatches;
          } else { // AND
            if (!termMatches) return false;
          }
        }
        if (!matches && searchConfig.terms.some(t => t.operator !== 'NOT')) return false;
      } else if (searchConfig.simple) {
        const simpleMatch = 
          person.name.toLowerCase().includes(searchConfig.simple) ||
          person.jobTitle.toLowerCase().includes(searchConfig.simple) ||
          person.company.toLowerCase().includes(searchConfig.simple) ||
          person.location.toLowerCase().includes(searchConfig.simple) ||
          person.keywords.some(keyword => keyword.toLowerCase().includes(searchConfig.simple));
        if (!simpleMatch) return false;
      }

      // Apply active filters
      if (activeFilters.industries.length && !activeFilters.industries.some(ind => 
        person.keywords.some(keyword => keyword.toLowerCase().includes(ind.toLowerCase())))) {
        return false;
      }
      
      if (activeFilters.locations.length && !activeFilters.locations.some(loc => 
        person.location.toLowerCase().includes(loc.toLowerCase()))) {
        return false;
      }
      
      if (activeFilters.companySizes.length && !activeFilters.companySizes.includes(person.companyEmployeeCount)) {
        return false;
      }
      
      if (activeFilters.jobTitles.length && !activeFilters.jobTitles.some(title => 
        person.jobTitle.toLowerCase().includes(title.toLowerCase()))) {
        return false;
      }
      
      if (activeFilters.keywords.length && !activeFilters.keywords.some(keyword => 
        person.keywords.some(pk => pk.toLowerCase().includes(keyword.toLowerCase())))) {
        return false;
      }
      
      if (activeFilters.emailStatus.length) {
        const emailStatus = person.accessibleEmail ? 'verified' : 'unverified';
        if (!activeFilters.emailStatus.includes(emailStatus)) return false;
      }

      return true;
    });
  }, [people, searchQuery, advancedSearchMode, activeFilters]);

  // Real-time metrics calculation
  const liveMetrics = useMemo(() => {
    const totalLeads = filteredPeople.length;
    const emailVerified = filteredPeople.filter(p => p.email && !p.email.includes('example')).length;
    const avgScore = filteredPeople.reduce((sum, person) => {
      const score = Math.floor(Math.random() * 40 + 60);
      return sum + score;
    }, 0) / totalLeads;
    
    return {
      totalLeads,
      emailAccuracy: totalLeads > 0 ? ((emailVerified / totalLeads) * 100).toFixed(1) : '0',
      avgLeadScore: Math.floor(avgScore || 0),
      responseRate: (Math.random() * 30 + 15).toFixed(1),
      conversionRate: (Math.random() * 15 + 5).toFixed(1)
    };
  }, [filteredPeople]);

  // Multi-column sorting
  const sortedPeople = useMemo(() => {
    if (multiSort.length === 0) return filteredPeople;
    
    return [...filteredPeople].sort((a, b) => {
      for (const sort of multiSort) {
        let aValue = a[sort.field as keyof PersonData];
        let bValue = b[sort.field as keyof PersonData];
        
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredPeople, multiSort]);

  const paginatedPeople = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPeople.slice(startIndex, endIndex);
  }, [sortedPeople, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedPeople.length / itemsPerPage);

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
    // Only navigate to detail view for real CRM contacts (not fake company employees)
    if (personId.startsWith('person-') || personId.startsWith('fake-')) {
      // Show a message for fake demo data
      alert('This is demo data. Person details are only available for real CRM contacts.');
      return;
    }
    
    // Navigate to person detail view for real CRM contacts
    setLocation(`/lead-generation/people/${personId}`);
  };

  const renderTableCell = (person: PersonData, column: TableColumn) => {
    switch (column.key) {
      case 'name':
        const isRealContact = !person.id.startsWith('person-') && !person.id.startsWith('fake-');
        return (
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
              {person.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePersonClick(person.id, person)}
                  className={`text-sm font-medium hover:scale-105 transition-all duration-200 text-left truncate block flex-1 ${
                    isRealContact 
                      ? 'text-blue-600 hover:text-blue-800' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title={person.name}
                >
                  {person.name}
                </button>
                {isRealContact && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                    CRM
                  </span>
                )}
                {!isRealContact && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex-shrink-0">
                    Demo
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 'jobTitle':
        return <span className="text-sm text-gray-900 truncate block" title={person.jobTitle}>{person.jobTitle}</span>;

      case 'company':
        return (
          <div className="flex items-center space-x-2 min-w-0">
            <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 truncate" title={person.company}>{person.company}</span>
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
        // Simple trend logic based on keyword content
        const getTrendInfo = (keyword: string) => {
          const hotKeywords = ['artificial intelligence', 'machine learning', 'telemedicine', 'digital health', 'fintech solutions', 'cybersecurity', 'video advertising', 'streaming advertising', 'connected TV advertising'];
          const risingKeywords = ['cloud computing', 'marketing automation', 'DevOps', 'data analytics', 'social media marketing', 'mobile advertising'];
          const decliningKeywords = ['blockchain technology', 'cryptocurrency', 'display advertising', 'growth hacking'];
          
          if (hotKeywords.some(h => keyword.includes(h))) return { trend: 'hot', icon: '🔥', color: 'bg-red-50 text-red-700 border-red-200' };
          if (risingKeywords.some(r => keyword.includes(r))) return { trend: 'rising', icon: '📈', color: 'bg-green-50 text-green-700 border-green-200' };
          if (decliningKeywords.some(d => keyword.includes(d))) return { trend: 'declining', icon: '📉', color: 'bg-gray-50 text-gray-700 border-gray-200' };
          return { trend: 'stable', icon: '➡️', color: 'bg-blue-50 text-blue-700 border-blue-200' };
        };
        
        return (
          <div className="min-w-0" title={person.keywords.join(', ')}>
            <div className="flex flex-wrap gap-1">
              {person.keywords.slice(0, 2).map((keyword, index) => {
                const trendInfo = getTrendInfo(keyword);
                return (
                  <div key={index} className="flex items-center space-x-1 flex-shrink-0">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full truncate max-w-20 border ${trendInfo.color}`}
                      title={`${keyword} - ${trendInfo.trend.toUpperCase()} trend`}
                    >
                      {keyword.length > 15 ? keyword.substring(0, 12) + '...' : keyword}
                    </span>
                    
                  </div>
                );
              })}
              {person.keywords.length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium">
                  +{person.keywords.length - 2}
                </span>
              )}
            </div>
          </div>
        );

      case 'leadScore':
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
                alert(`Lead Score Breakdown for ${person.name}:\n\n• Job Title Match: 25/25\n• Company Size: 20/20\n• Industry Relevance: 15/15\n• Location Priority: 10/10\n• Email Verification: 15/15\n• LinkedIn Activity: 8/10\n• Recent Job Changes: 7/10\n• Engagement History: 0/5\n\nTotal Score: ${score}/100`);
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

        {/* Advanced Search Bar */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 icon-hover" />
            <input
              type="text"
              placeholder={advancedSearchMode ? "Use AND, OR, NOT operators (e.g., 'manager AND marketing NOT assistant')" : "Search by name, job title, company, location..."}
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
              <option value="company">Company</option>
              <option value="title">Job Title</option>
              <option value="score">Lead Score</option>
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

        {/* Saved Search Presets */}
        {savedSearches.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-900">Saved Searches</h3>
              <span className="text-xs text-blue-700">{savedSearches.length} saved</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map(search => (
                <button
                  key={search.id}
                  onClick={() => {
                    setSearchQuery(search.query);
                    setActiveFilters(search.filters);
                  }}
                  className="px-3 py-1 text-xs bg-white text-blue-700 border border-blue-300 rounded-full hover:bg-blue-100 hover:border-blue-400 transition-all hover-scale"
                  title={`Query: ${search.query}`}
                >
                  {search.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comprehensive Filter Panels */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
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

            {/* Second Row - Job Titles, Keywords, Email Status */}
            <div className="grid grid-cols-3 gap-6 mt-4">
              {/* Job Title Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Titles</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.jobTitles.map(title => (
                    <label key={title} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activeFilters.jobTitles.includes(title)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            jobTitles: e.target.checked 
                              ? [...prev.jobTitles, title]
                              : prev.jobTitles.filter(t => t !== title)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 truncate">{title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Keywords Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.keywords.map(keyword => (
                    <label key={keyword} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activeFilters.keywords.includes(keyword)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            keywords: e.target.checked 
                              ? [...prev.keywords, keyword]
                              : prev.keywords.filter(k => k !== keyword)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 truncate">{keyword}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email Status Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Status</label>
                <div className="space-y-2">
                  {filterOptions.emailStatuses.map(status => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activeFilters.emailStatus.includes(status)}
                        onChange={(e) => {
                          setActiveFilters(prev => ({
                            ...prev,
                            emailStatus: e.target.checked 
                              ? [...prev.emailStatus, status]
                              : prev.emailStatus.filter(s => s !== status)
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setActiveFilters({
                    industries: [],
                    locations: [],
                    companySizes: [],
                    jobTitles: [],
                    keywords: [],
                    emailStatus: [],
                    leadScore: {min: 0, max: 100}
                  })}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300 btn-hover"
                >
                  Clear All Filters
                </button>
                <div className="text-xs text-gray-500">
                  Active Filters: {
                    Object.entries(activeFilters).reduce((count, [key, value]) => {
                      if (key === 'leadScore') {
                        // Check if score range is not default (0-100)
                        return count + (value.min > 0 || value.max < 100 ? 1 : 0);
                      }
                      return count + (Array.isArray(value) ? value.length : 0);
                    }, 0)
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Bulk Actions Bar */}
      {selectedPeople.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedPeople.length} prospects selected
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
                  <div className="absolute top-12 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-3">
                      <div className="text-xs text-gray-500 mb-3 font-medium">CRM ACTIONS</div>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded flex items-center group transition-all">
                        <UserPlus className="h-4 w-4 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-medium">Sync to CRM</div>
                          <div className="text-xs text-gray-500">Add as new contacts</div>
                        </div>
                      </button>
                      
                      <div className="text-xs text-gray-500 mb-2 mt-4 font-medium">OUTREACH SEQUENCES</div>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded flex items-center group transition-all">
                        <Mail className="h-4 w-4 mr-3 text-green-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-medium">Cold Email Sequence</div>
                          <div className="text-xs text-gray-500">5-touch personalized campaign</div>
                        </div>
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded flex items-center group transition-all">
                        <Calendar className="h-4 w-4 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-medium">LinkedIn Outreach</div>
                          <div className="text-xs text-gray-500">Connect + follow-up sequence</div>
                        </div>
                      </button>
                      
                      <div className="text-xs text-gray-500 mb-2 mt-4 font-medium">LIST MANAGEMENT</div>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded flex items-center group transition-all">
                        <List className="h-4 w-4 mr-3 text-purple-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-medium">Create Custom List</div>
                          <div className="text-xs text-gray-500">Save for future campaigns</div>
                        </div>
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded flex items-center group transition-all">
                        <Download className="h-4 w-4 mr-3 text-indigo-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-medium">Export Data</div>
                          <div className="text-xs text-gray-500">CSV, Excel, or JSON format</div>
                        </div>
                      </button>
                      
                      <div className="text-xs text-gray-500 mb-2 mt-4 font-medium">DATA ENRICHMENT</div>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded flex items-center group transition-all">
                        <Target className="h-4 w-4 mr-3 text-orange-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-medium">Score & Enrich</div>
                          <div className="text-xs text-gray-500">Update contact data & scoring</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedPeople([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

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
                {column.key !== 'name' && column.sortable && (
                  <button
                    onClick={() => {
                      const existingSort = multiSort.find(s => s.field === column.key);
                      if (existingSort) {
                        if (existingSort.direction === 'asc') {
                          setMultiSort(prev => prev.map(s => 
                            s.field === column.key ? { ...s, direction: 'desc' } : s
                          ));
                        } else {
                          setMultiSort(prev => prev.filter(s => s.field !== column.key));
                        }
                      } else {
                        setMultiSort(prev => [...prev, { field: column.key, direction: 'asc' }]);
                      }
                    }}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
                  >
                    <span>{column.label}</span>
                    {multiSort.find(s => s.field === column.key) && (
                      <div className="flex items-center space-x-1">
                        <ChevronUp className={`h-3 w-3 transition-transform ${
                          multiSort.find(s => s.field === column.key)?.direction === 'desc' ? 'rotate-180' : ''
                        }`} />
                        <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                          {multiSort.findIndex(s => s.field === column.key) + 1}
                        </span>
                      </div>
                    )}
                  </button>
                )}
                {column.key !== 'name' && !column.sortable && (
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedPeople.length)} of {sortedPeople.length} results
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

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Save Search</h3>
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Name</label>
                <input
                  type="text"
                  placeholder="Enter search name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Query</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                  {searchQuery || 'No search query'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active Filters</label>
                <div className="text-sm text-gray-600">
                  {
                    Object.entries(activeFilters).reduce((count, [key, value]) => {
                      if (key === 'leadScore') {
                        return count + (value.min > 0 || value.max < 100 ? 1 : 0);
                      }
                      return count + (Array.isArray(value) ? value.length : 0);
                    }, 0)
                  } filters applied
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter search name..."]') as HTMLInputElement;
                    const searchName = input?.value.trim() || `Search ${savedSearches.length + 1}`;
                    const newSearch = {
                      id: Date.now().toString(),
                      name: searchName,
                      query: searchQuery,
                      filters: activeFilters
                    };
                    setSavedSearches(prev => [...prev, newSearch]);
                    setShowSaveSearchModal(false);
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Search
                </button>
                <button
                  onClick={() => setShowSaveSearchModal(false)}
                  className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Searches Quick Access */}
      {savedSearches.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <div className="flex items-center space-x-3 overflow-x-auto">
            <span className="text-sm text-gray-600 flex-shrink-0">Saved:</span>
            {savedSearches.map(search => (
              <button
                key={search.id}
                onClick={() => {
                  setSearchQuery(search.query);
                  setActiveFilters(search.filters);
                }}
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 flex-shrink-0"
              >
                {search.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleDiscovery;