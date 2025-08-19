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
    { key: 'keywords', label: 'Keywords & Trends', width: '320px', minWidth: '320px', visible: true, sortable: false }
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
    
    // Real-time industry trend data for keywords
    const keywordTrends: { [key: string]: { trend: 'hot' | 'rising' | 'stable' | 'declining'; growth: number; volume: string } } = {
      // Digital Advertising Trends
      'programmatic advertising': { trend: 'hot', growth: 34, volume: 'High' },
      'real-time bidding': { trend: 'rising', growth: 28, volume: 'High' },
      'demand side platform': { trend: 'stable', growth: 12, volume: 'Medium' },
      'supply side platform': { trend: 'rising', growth: 22, volume: 'Medium' },
      'ad exchange': { trend: 'stable', growth: 8, volume: 'Medium' },
      'native advertising': { trend: 'hot', growth: 45, volume: 'High' },
      'display advertising': { trend: 'declining', growth: -5, volume: 'High' },
      'video advertising': { trend: 'hot', growth: 52, volume: 'Very High' },
      'mobile advertising': { trend: 'rising', growth: 38, volume: 'Very High' },
      'retargeting campaigns': { trend: 'rising', growth: 25, volume: 'High' },
      'audience targeting': { trend: 'hot', growth: 41, volume: 'High' },
      'brand awareness': { trend: 'stable', growth: 15, volume: 'Very High' },
      'performance marketing': { trend: 'hot', growth: 48, volume: 'High' },
      'attribution modeling': { trend: 'rising', growth: 31, volume: 'Medium' },
      'viewability optimization': { trend: 'rising', growth: 19, volume: 'Medium' },
      'ad fraud prevention': { trend: 'hot', growth: 56, volume: 'Medium' },
      'cross-device tracking': { trend: 'declining', growth: -12, volume: 'Medium' },
      'location-based advertising': { trend: 'rising', growth: 33, volume: 'Medium' },
      'digital out of home': { trend: 'hot', growth: 67, volume: 'Medium' },
      'DOOH advertising': { trend: 'hot', growth: 72, volume: 'Medium' },
      'connected TV advertising': { trend: 'hot', growth: 89, volume: 'High' },
      'streaming advertising': { trend: 'hot', growth: 94, volume: 'Very High' },

      // Technology Trends
      'software development': { trend: 'stable', growth: 18, volume: 'Very High' },
      'cloud computing': { trend: 'rising', growth: 42, volume: 'Very High' },
      'artificial intelligence': { trend: 'hot', growth: 125, volume: 'Very High' },
      'machine learning': { trend: 'hot', growth: 87, volume: 'Very High' },
      'data analytics': { trend: 'rising', growth: 35, volume: 'Very High' },
      'cybersecurity': { trend: 'hot', growth: 78, volume: 'Very High' },
      'blockchain technology': { trend: 'declining', growth: -15, volume: 'Medium' },
      'API development': { trend: 'rising', growth: 29, volume: 'High' },
      'mobile app development': { trend: 'stable', growth: 22, volume: 'High' },
      'web development': { trend: 'stable', growth: 16, volume: 'Very High' },
      'DevOps': { trend: 'rising', growth: 54, volume: 'High' },
      'agile methodology': { trend: 'stable', growth: 11, volume: 'High' },
      'microservices': { trend: 'rising', growth: 46, volume: 'Medium' },
      'containerization': { trend: 'rising', growth: 39, volume: 'Medium' },
      'database management': { trend: 'stable', growth: 14, volume: 'High' },
      'user experience design': { trend: 'rising', growth: 32, volume: 'High' },
      'digital transformation': { trend: 'hot', growth: 91, volume: 'Very High' },
      'enterprise software': { trend: 'stable', growth: 19, volume: 'High' },
      'SaaS solutions': { trend: 'rising', growth: 44, volume: 'Very High' },
      'IoT development': { trend: 'rising', growth: 37, volume: 'Medium' },

      // Marketing Trends
      'digital marketing': { trend: 'rising', growth: 36, volume: 'Very High' },
      'content marketing': { trend: 'hot', growth: 58, volume: 'Very High' },
      'social media marketing': { trend: 'rising', growth: 41, volume: 'Very High' },
      'email marketing': { trend: 'stable', growth: 23, volume: 'Very High' },
      'SEO optimization': { trend: 'rising', growth: 34, volume: 'Very High' },
      'PPC advertising': { trend: 'stable', growth: 21, volume: 'High' },
      'conversion optimization': { trend: 'rising', growth: 47, volume: 'High' },
      'marketing automation': { trend: 'hot', growth: 73, volume: 'High' },
      'lead generation': { trend: 'rising', growth: 39, volume: 'Very High' },
      'brand management': { trend: 'stable', growth: 17, volume: 'High' },
      'influencer marketing': { trend: 'hot', growth: 86, volume: 'High' },
      'affiliate marketing': { trend: 'rising', growth: 31, volume: 'Medium' },
      'growth hacking': { trend: 'declining', growth: -8, volume: 'Medium' },
      'customer acquisition': { trend: 'hot', growth: 65, volume: 'High' },
      'retention marketing': { trend: 'hot', growth: 71, volume: 'Medium' },
      'marketing analytics': { trend: 'hot', growth: 82, volume: 'High' },
      'customer journey mapping': { trend: 'rising', growth: 55, volume: 'Medium' },
      'omnichannel marketing': { trend: 'hot', growth: 69, volume: 'Medium' },
      'video marketing': { trend: 'hot', growth: 95, volume: 'Very High' },
      'viral marketing': { trend: 'stable', growth: 12, volume: 'Medium' },

      // Finance Trends
      'financial services': { trend: 'stable', growth: 16, volume: 'Very High' },
      'investment management': { trend: 'rising', growth: 28, volume: 'High' },
      'risk assessment': { trend: 'rising', growth: 33, volume: 'High' },
      'portfolio management': { trend: 'stable', growth: 21, volume: 'High' },
      'financial planning': { trend: 'rising', growth: 26, volume: 'High' },
      'accounting software': { trend: 'stable', growth: 19, volume: 'Medium' },
      'fintech solutions': { trend: 'hot', growth: 118, volume: 'High' },
      'payment processing': { trend: 'rising', growth: 42, volume: 'High' },
      'cryptocurrency': { trend: 'declining', growth: -22, volume: 'High' },
      'blockchain finance': { trend: 'declining', growth: -18, volume: 'Medium' },
      'regulatory compliance': { trend: 'hot', growth: 74, volume: 'High' },
      'audit services': { trend: 'stable', growth: 13, volume: 'Medium' },
      'tax optimization': { trend: 'rising', growth: 24, volume: 'Medium' },
      'wealth management': { trend: 'rising', growth: 35, volume: 'High' },
      'insurance technology': { trend: 'hot', growth: 89, volume: 'Medium' },
      'credit scoring': { trend: 'rising', growth: 37, volume: 'Medium' },
      'lending platforms': { trend: 'rising', growth: 51, volume: 'Medium' },
      'robo-advisors': { trend: 'stable', growth: 18, volume: 'Medium' },
      'financial analytics': { trend: 'hot', growth: 76, volume: 'High' },
      'banking solutions': { trend: 'rising', growth: 29, volume: 'High' },

      // Healthcare Trends
      'healthcare technology': { trend: 'hot', growth: 156, volume: 'Very High' },
      'telemedicine': { trend: 'hot', growth: 234, volume: 'Very High' },
      'electronic health records': { trend: 'rising', growth: 45, volume: 'High' },
      'medical devices': { trend: 'rising', growth: 38, volume: 'High' },
      'pharmaceutical': { trend: 'stable', growth: 22, volume: 'Very High' },
      'clinical research': { trend: 'rising', growth: 41, volume: 'High' },
      'patient care': { trend: 'hot', growth: 67, volume: 'Very High' },
      'health analytics': { trend: 'hot', growth: 93, volume: 'High' },
      'medical software': { trend: 'hot', growth: 108, volume: 'Medium' },
      'healthcare compliance': { trend: 'hot', growth: 85, volume: 'High' },
      'digital health': { trend: 'hot', growth: 178, volume: 'Very High' },
      'wellness platforms': { trend: 'hot', growth: 142, volume: 'High' },
      'medical imaging': { trend: 'rising', growth: 52, volume: 'High' },
      'laboratory services': { trend: 'rising', growth: 34, volume: 'High' },
      'healthcare data': { trend: 'hot', growth: 112, volume: 'High' },
      'patient engagement': { trend: 'hot', growth: 89, volume: 'Medium' },
      'medical AI': { trend: 'hot', growth: 203, volume: 'Medium' },
      'remote monitoring': { trend: 'hot', growth: 167, volume: 'High' },
      'healthcare cybersecurity': { trend: 'hot', growth: 145, volume: 'Medium' },
      'precision medicine': { trend: 'hot', growth: 124, volume: 'Medium' }
    };

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
          <div className="min-w-0" title={person.keywords.join(', ')}>
            <div className="flex flex-wrap gap-1">
              {person.keywords.slice(0, 2).map((keyword, index) => {
                const trendData = keywordTrends[keyword] || { trend: 'stable', growth: 0, volume: 'Medium' };
                const trendColor = {
                  hot: 'bg-red-50 text-red-700 border-red-200',
                  rising: 'bg-green-50 text-green-700 border-green-200',
                  stable: 'bg-blue-50 text-blue-700 border-blue-200',
                  declining: 'bg-gray-50 text-gray-700 border-gray-200'
                }[trendData.trend];
                
                const trendIcon = {
                  hot: '🔥',
                  rising: '📈',
                  stable: '➡️',
                  declining: '📉'
                }[trendData.trend];

                return (
                  <div key={index} className="flex items-center space-x-1 flex-shrink-0">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full truncate max-w-20 border ${trendColor}`}
                      title={`${keyword} - ${trendData.trend.toUpperCase()} (${trendData.growth > 0 ? '+' : ''}${trendData.growth}%) - ${trendData.volume} volume`}
                    >
                      {keyword}
                    </span>
                    <span className="text-xs" title={`${trendData.trend.toUpperCase()} trend: ${trendData.growth > 0 ? '+' : ''}${trendData.growth}%`}>
                      {trendIcon}
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
            
            {/* Trend Summary */}
            <div className="mt-1 flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full" title="Hot trends"></div>
                <span className="text-gray-600">
                  {person.keywords.filter(k => keywordTrends[k]?.trend === 'hot').length}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" title="Rising trends"></div>
                <span className="text-gray-600">
                  {person.keywords.filter(k => keywordTrends[k]?.trend === 'rising').length}
                </span>
              </div>
              <div className="text-gray-500 truncate">
                Avg: {Math.round(person.keywords.reduce((acc, k) => acc + (keywordTrends[k]?.growth || 0), 0) / person.keywords.length)}% growth
              </div>
            </div>

            {/* Additional keywords with trends */}
            {person.keywords.length > 2 && (
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                {person.keywords.slice(2, 4).map((keyword, index) => {
                  const trendData = keywordTrends[keyword] || { trend: 'stable', growth: 0, volume: 'Medium' };
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="truncate flex-1" title={keyword}>{keyword}</span>
                      <span 
                        className={`ml-1 px-1 rounded text-xs ${
                          trendData.growth > 50 ? 'text-red-600' : 
                          trendData.growth > 20 ? 'text-green-600' : 
                          trendData.growth > 0 ? 'text-blue-600' : 'text-gray-500'
                        }`}
                        title={`${trendData.growth > 0 ? '+' : ''}${trendData.growth}% growth`}
                      >
                        {trendData.growth > 0 ? '+' : ''}{trendData.growth}%
                      </span>
                    </div>
                  );
                })}
                {person.keywords.length > 4 && (
                  <div className="text-gray-400">+{person.keywords.length - 4} more...</div>
                )}
              </div>
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