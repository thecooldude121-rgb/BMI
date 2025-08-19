import React, { useState, useMemo } from 'react';
import { useRoute } from 'wouter';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  ExternalLink, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Settings, 
  Filter, 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  Save,
  Eye,
  TrendingUp,
  Star,
  MessageSquare,
  FileText,
  CheckSquare,
  Search,
  Download,
  Share,
  Shield,
  CheckCircle,
  Network,
  List,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { Link } from 'wouter';
import { companies, CompanyData as SharedCompanyData } from '../../data/companies';

interface Contact {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  avatar?: string;
  initials: string;
}

interface CompanyData {
  id: string;
  name: string;
  logo: string;
  domain: string;
  description: string;
  industry: string;
  location: string;
  founded: string;
  employees: string;
  revenue: string;
  phone: string;
  tradingSymbol: string;
  subsidiaries: number;
  score: number;
  rating: string;
}

interface ProspectData {
  id: string;
  name: string;
  title: string;
  location: string;
  department: string;
  reason: string;
  actions: string[];
}

interface EmployeeData {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  source: string;
  email?: string;
  phone?: string;
  linkedinProfile?: string;
  yearStarted?: string;
  lastActivity?: string;
  verified: boolean;
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Executive';
}

interface LookalikeCompany {
  id: string;
  name: string;
  logo: string;
  location: string;
  employees: string;
}

const CompanyDetailPageBMI: React.FC = () => {
  const [match, params] = useRoute('/lead-generation/company/:id');
  const companyId = params?.id || '1';
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [activeInsightTab, setActiveInsightTab] = useState('ai-score');
  const [activeActivityTab, setActiveActivityTab] = useState('all');
  const [activeMainTab, setActiveMainTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeCurrentPage, setEmployeeCurrentPage] = useState(1);
  const totalPages = 5;
  const contactsPerPage = 5;
  const employeesPerPage = 8;
  
  // Network visualization state
  const [employeeViewMode, setEmployeeViewMode] = useState<'list' | 'network'>('list');
  const [networkView, setNetworkView] = useState<'hierarchy' | 'department' | 'connections'>('hierarchy');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [networkFullscreen, setNetworkFullscreen] = useState(false);
  
  // Export feature state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [exportFilters, setExportFilters] = useState({
    departments: [] as string[],
    seniorities: [] as string[],
    sources: [] as string[],
    includeContactInfo: true,
    includeVerifiedOnly: false
  });
  
  // Track accessed contact info
  const [accessedEmails, setAccessedEmails] = useState<Set<number>>(new Set());
  const [accessedNumbers, setAccessedNumbers] = useState<Set<number>>(new Set());
  
  // Handler functions for accessing contact info
  const handleAccessEmail = (contactIndex: number) => {
    setAccessedEmails(prev => new Set(Array.from(prev).concat(contactIndex)));
  };
  
  const handleAccessNumber = (contactIndex: number) => {
    setAccessedNumbers(prev => new Set(Array.from(prev).concat(contactIndex)));
  };

  // Comprehensive employee data sourced from web, LinkedIn, company website, and databases
  const allEmployees: EmployeeData[] = [
    // Executive Team
    {
      id: "emp_001",
      name: "Sarah Mitchell", 
      title: "Chief Investment Officer",
      department: "Executive",
      location: "Sydney, NSW",
      source: "LinkedIn Premium",
      email: "s.mitchell@vgipartners.com",
      phone: "+61 2 8267 8001",
      linkedinProfile: "linkedin.com/in/sarah-mitchell-cio",
      yearStarted: "2019",
      lastActivity: "2 hours ago",
      verified: true,
      seniority: "Executive"
    },
    {
      id: "emp_002", 
      name: "David Chen",
      title: "Senior Portfolio Manager",
      department: "Investment Management", 
      location: "Melbourne, VIC",
      source: "Company Website",
      email: "d.chen@vgipartners.com",
      phone: "+61 3 9123 4567",
      linkedinProfile: "linkedin.com/in/david-chen-pm",
      yearStarted: "2021",
      lastActivity: "5 hours ago",
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_003",
      name: "Emma Thompson",
      title: "Head of Research",
      department: "Research & Analytics",
      location: "Sydney, NSW",
      source: "LinkedIn Sales Navigator",
      email: "e.thompson@vgipartners.com", 
      phone: "+61 2 8267 8003",
      linkedinProfile: "linkedin.com/in/emma-thompson-research",
      yearStarted: "2020",
      lastActivity: "1 day ago",
      verified: true,
      seniority: "Executive"
    },
    {
      id: "emp_004",
      name: "Michael Rodriguez",
      title: "Director of Operations",
      department: "Operations",
      location: "Sydney, NSW", 
      source: "ZoomInfo",
      email: "m.rodriguez@vgipartners.com",
      phone: "+61 2 8267 8004",
      yearStarted: "2018",
      lastActivity: "3 hours ago",
      verified: true,
      seniority: "Executive"
    },
    {
      id: "emp_005",
      name: "Lisa Wang",
      title: "Senior Research Analyst",
      department: "Research & Analytics",
      location: "Melbourne, VIC",
      source: "LinkedIn Premium",
      email: "l.wang@vgipartners.com",
      phone: "+61 3 9123 4568",
      linkedinProfile: "linkedin.com/in/lisa-wang-analyst",
      yearStarted: "2022",
      lastActivity: "4 hours ago", 
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_006",
      name: "James Foster",
      title: "Portfolio Manager",
      department: "Investment Management",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "j.foster@vgipartners.com",
      phone: "+61 2 8267 8005",
      yearStarted: "2023",
      lastActivity: "6 hours ago",
      verified: false,
      seniority: "Mid"
    },
    {
      id: "emp_007", 
      name: "Anna Kowalski",
      title: "Compliance Manager",
      department: "Legal & Compliance",
      location: "Sydney, NSW",
      source: "LinkedIn Sales Navigator",
      email: "a.kowalski@vgipartners.com",
      phone: "+61 2 8267 8006",
      linkedinProfile: "linkedin.com/in/anna-kowalski-compliance",
      yearStarted: "2021",
      lastActivity: "1 day ago",
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_008",
      name: "Robert Kim", 
      title: "Senior Trader",
      department: "Trading",
      location: "Melbourne, VIC",
      source: "Clearbit",
      email: "r.kim@vgipartners.com",
      phone: "+61 3 9123 4569",
      yearStarted: "2020",
      lastActivity: "30 minutes ago",
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_009",
      name: "Sophie Martin",
      title: "Marketing Manager", 
      department: "Marketing",
      location: "Sydney, NSW",
      source: "Company Website",
      email: "s.martin@vgipartners.com",
      phone: "+61 2 8267 8007",
      linkedinProfile: "linkedin.com/in/sophie-martin-marketing",
      yearStarted: "2022",
      lastActivity: "2 hours ago",
      verified: true,
      seniority: "Mid"
    },
    {
      id: "emp_010",
      name: "Thomas Anderson",
      title: "Risk Manager",
      department: "Risk Management", 
      location: "Melbourne, VIC",
      source: "LinkedIn Premium",
      email: "t.anderson@vgipartners.com",
      phone: "+61 3 9123 4570",
      linkedinProfile: "linkedin.com/in/thomas-anderson-risk",
      yearStarted: "2019",
      lastActivity: "5 hours ago",
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_011",
      name: "Rachel Green",
      title: "HR Business Partner",
      department: "Human Resources",
      location: "Sydney, NSW",
      source: "ZoomInfo",
      email: "r.green@vgipartners.com", 
      phone: "+61 2 8267 8008",
      yearStarted: "2023",
      lastActivity: "4 hours ago",
      verified: false,
      seniority: "Mid"
    },
    {
      id: "emp_012",
      name: "Alex Thompson",
      title: "Junior Analyst",
      department: "Research & Analytics",
      location: "Melbourne, VIC",
      source: "Company Database",
      email: "a.thompson@vgipartners.com",
      phone: "+61 3 9123 4571",
      yearStarted: "2024",
      lastActivity: "1 hour ago",
      verified: false,
      seniority: "Junior"
    },
    {
      id: "emp_013", 
      name: "Maria Santos",
      title: "Client Relations Manager",
      department: "Client Services",
      location: "Sydney, NSW",
      source: "LinkedIn Sales Navigator",
      email: "m.santos@vgipartners.com",
      phone: "+61 2 8267 8009",
      linkedinProfile: "linkedin.com/in/maria-santos-client",
      yearStarted: "2021",
      lastActivity: "3 hours ago",
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_014",
      name: "Kevin O'Brien",
      title: "IT Manager",
      department: "Information Technology",
      location: "Melbourne, VIC", 
      source: "Clearbit",
      email: "k.obrien@vgipartners.com",
      phone: "+61 3 9123 4572",
      yearStarted: "2020",
      lastActivity: "6 hours ago",
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_015",
      name: "Jennifer Lee",
      title: "Financial Controller",
      department: "Finance",
      location: "Sydney, NSW",
      source: "LinkedIn Premium",
      email: "j.lee@vgipartners.com",
      phone: "+61 2 8267 8010",
      linkedinProfile: "linkedin.com/in/jennifer-lee-finance",
      yearStarted: "2018",
      lastActivity: "2 days ago", 
      verified: true,
      seniority: "Senior"
    },
    {
      id: "emp_016",
      name: "Daniel Wilson",
      title: "Business Development Manager",
      department: "Business Development",
      location: "Melbourne, VIC",
      source: "ZoomInfo",
      email: "d.wilson@vgipartners.com",
      phone: "+61 3 9123 4573",
      yearStarted: "2022",
      lastActivity: "1 day ago",
      verified: true,
      seniority: "Mid"
    }
  ];

  const employeeTotalPages = Math.ceil(allEmployees.length / employeesPerPage);

  const getCurrentPageEmployees = () => {
    const startIndex = (employeeCurrentPage - 1) * employeesPerPage;
    const endIndex = startIndex + employeesPerPage;
    return allEmployees.slice(startIndex, endIndex);
  };

  // All contacts data (expanded to show data from both LinkedIn and local database)
  const allContacts = [
    // Page 1 contacts
    {
      name: "Sarah Mitchell",
      title: "Chief Investment Officer",
      department: "Investment Management",
      location: "Sydney, NSW",
      source: "LinkedIn Premium",
      email: "s.mitchell@vgipartners.com",
      phone: "+61 2 8267 8000",
      connection: "2nd degree",
      lastActivity: "2 hours ago",
      verified: true
    },
    {
      name: "David Chen",
      title: "Senior Portfolio Manager",
      department: "Equities Division",
      location: "Melbourne, VIC",
      source: "Company Database",
      email: "d.chen@vgipartners.com", 
      phone: "+61 2 8267 8015",
      connection: "Direct contact",
      lastActivity: "1 day ago",
      verified: true
    },
    {
      name: "Emma Rodriguez",
      title: "ESG Investment Specialist",
      department: "Sustainable Investing",
      location: "Sydney, NSW",
      source: "LinkedIn Sales Navigator",
      email: "e.rodriguez@vgipartners.com",
      phone: "+61 2 8267 8023",
      connection: "3rd degree", 
      lastActivity: "3 days ago",
      verified: false
    },
    {
      name: "Michael Thompson",
      title: "Head of Research",
      department: "Investment Research",
      location: "Sydney, NSW",
      source: "Company Database", 
      email: "m.thompson@vgipartners.com",
      phone: "+61 2 8267 8045",
      connection: "Direct contact",
      lastActivity: "5 days ago",
      verified: true
    },
    {
      name: "Jennifer Wong",
      title: "Quantitative Analyst", 
      department: "Research & Analytics",
      location: "Brisbane, QLD",
      source: "LinkedIn Premium",
      email: "j.wong@vgipartners.com",
      phone: "+61 2 8267 8067",
      connection: "2nd degree",
      lastActivity: "1 week ago",
      verified: true
    },
    // Page 2 contacts
    {
      name: "Robert Anderson",
      title: "Senior Fund Manager",
      department: "Investment Management",
      location: "Perth, WA",
      source: "LinkedIn Sales Navigator",
      email: "r.anderson@vgipartners.com",
      phone: "+61 2 8267 8071",
      connection: "1st degree",
      lastActivity: "2 days ago",
      verified: true
    },
    {
      name: "Lisa Zhang",
      title: "Risk Management Director",
      department: "Risk & Compliance",
      location: "Sydney, NSW", 
      source: "Company Database",
      email: "l.zhang@vgipartners.com",
      phone: "+61 2 8267 8089",
      connection: "Direct contact",
      lastActivity: "4 hours ago",
      verified: true
    },
    {
      name: "James Wilson",
      title: "Client Relationship Manager",
      department: "Client Services",
      location: "Melbourne, VIC",
      source: "LinkedIn Premium",
      email: "j.wilson@vgipartners.com",
      phone: "+61 2 8267 8092",
      connection: "2nd degree",
      lastActivity: "1 day ago",
      verified: true
    },
    {
      name: "Maria Santos",
      title: "Investment Analyst",
      department: "Investment Research",
      location: "Adelaide, SA",
      source: "LinkedIn Sales Navigator",
      email: "m.santos@vgipartners.com",
      phone: "+61 2 8267 8105",
      connection: "3rd degree",
      lastActivity: "6 days ago",
      verified: false
    },
    {
      name: "Thomas Lee",
      title: "Portfolio Operations Manager",
      department: "Operations",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "t.lee@vgipartners.com",
      phone: "+61 2 8267 8118",
      connection: "Direct contact",
      lastActivity: "3 days ago",
      verified: true
    },
    // Page 3 contacts
    {
      name: "Alexandra Johnson",
      title: "Senior Investment Advisor",
      department: "Client Advisory",
      location: "Canberra, ACT",
      source: "LinkedIn Premium",
      email: "a.johnson@vgipartners.com",
      phone: "+61 2 8267 8125",
      connection: "2nd degree",
      lastActivity: "5 hours ago",
      verified: true
    },
    {
      name: "Kevin O'Connor",
      title: "Head of Trading",
      department: "Trading & Execution",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "k.oconnor@vgipartners.com",
      phone: "+61 2 8267 8139",
      connection: "Direct contact",
      lastActivity: "1 hour ago",
      verified: true
    },
    {
      name: "Rachel Kim",
      title: "Compliance Officer",
      department: "Risk & Compliance",
      location: "Melbourne, VIC",
      source: "LinkedIn Sales Navigator",
      email: "r.kim@vgipartners.com",
      phone: "+61 2 8267 8142",
      connection: "3rd degree",
      lastActivity: "2 weeks ago",
      verified: false
    },
    {
      name: "Daniel Martinez",
      title: "Technology Director",
      department: "Information Technology",
      location: "Brisbane, QLD",
      source: "LinkedIn Premium",
      email: "d.martinez@vgipartners.com",
      phone: "+61 2 8267 8156",
      connection: "1st degree",
      lastActivity: "4 days ago",
      verified: true
    },
    {
      name: "Sophie Turner",
      title: "Marketing Manager",
      department: "Marketing & Communications",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "s.turner@vgipartners.com",
      phone: "+61 2 8267 8163",
      connection: "Direct contact",
      lastActivity: "1 week ago",
      verified: true
    },
    // Page 4 contacts
    {
      name: "Andrew Phillips",
      title: "Senior Research Analyst",
      department: "Investment Research",
      location: "Darwin, NT",
      source: "LinkedIn Sales Navigator",
      email: "a.phillips@vgipartners.com",
      phone: "+61 2 8267 8177",
      connection: "2nd degree",
      lastActivity: "3 hours ago",
      verified: true
    },
    {
      name: "Catherine Brown",
      title: "Human Resources Director",
      department: "Human Resources",
      location: "Melbourne, VIC",
      source: "Company Database",
      email: "c.brown@vgipartners.com",
      phone: "+61 2 8267 8184",
      connection: "Direct contact",
      lastActivity: "2 days ago",
      verified: true
    },
    {
      name: "Nathan Davis",
      title: "Alternative Investments Manager",
      department: "Alternative Investments",
      location: "Perth, WA",
      source: "LinkedIn Premium",
      email: "n.davis@vgipartners.com",
      phone: "+61 2 8267 8191",
      connection: "3rd degree",
      lastActivity: "1 week ago",
      verified: false
    },
    {
      name: "Victoria Garcia",
      title: "Financial Controller",
      department: "Finance & Accounting",
      location: "Adelaide, SA",
      source: "LinkedIn Sales Navigator",
      email: "v.garcia@vgipartners.com",
      phone: "+61 2 8267 8205",
      connection: "2nd degree",
      lastActivity: "5 days ago",
      verified: true
    },
    {
      name: "Benjamin Clark",
      title: "Investment Operations Analyst",
      department: "Operations",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "b.clark@vgipartners.com",
      phone: "+61 2 8267 8212",
      connection: "Direct contact",
      lastActivity: "8 hours ago",
      verified: true
    },
    // Page 5 contacts
    {
      name: "Isabella Rodriguez",
      title: "Client Services Manager",
      department: "Client Services",
      location: "Brisbane, QLD",
      source: "LinkedIn Premium",
      email: "i.rodriguez@vgipartners.com",
      phone: "+61 2 8267 8229",
      connection: "1st degree",
      lastActivity: "6 hours ago",
      verified: true
    },
    {
      name: "Christopher Moore",
      title: "Legal Counsel",
      department: "Legal & Compliance",
      location: "Sydney, NSW",
      source: "Company Database",
      email: "c.moore@vgipartners.com",
      phone: "+61 2 8267 8236",
      connection: "Direct contact",
      lastActivity: "3 days ago",
      verified: true
    },
    {
      name: "Olivia White",
      title: "Data Analyst",
      department: "Research & Analytics",
      location: "Melbourne, VIC",
      source: "LinkedIn Sales Navigator",
      email: "o.white@vgipartners.com",
      phone: "+61 2 8267 8243",
      connection: "2nd degree",
      lastActivity: "4 days ago",
      verified: true
    }
  ];

  // Get current page contacts
  const getCurrentPageContacts = () => {
    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    return allContacts.slice(startIndex, endIndex);
  };

  // Company data
  // Get company data from the companies array based on companyId
  const selectedCompany = companies.find(c => c.id === companyId) || companies[0];
  
  const companyData: CompanyData = {
    id: selectedCompany.id,
    name: selectedCompany.name,
    logo: selectedCompany.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    domain: selectedCompany.domain || 'company.com',
    description: selectedCompany.description,
    industry: selectedCompany.industry,
    location: selectedCompany.location,
    founded: selectedCompany.founded?.toString() || '2000',
    employees: selectedCompany.employeeCount || '1-10',
    revenue: selectedCompany.revenue || 'N/A',
    phone: '+1 (555) 000-0000',
    tradingSymbol: 'N/A',
    subsidiaries: 0,
    score: 85,
    rating: 'A+'
  };

  // Sample contacts data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Robert Luciano',
      title: 'Managing Director & Chief Investment Officer',
      department: 'Executive',
      location: 'Sydney, NSW',
      initials: 'RL'
    },
    {
      id: '2', 
      name: 'David Jones',
      title: 'Portfolio Manager',
      department: 'Investment Management',
      location: 'Sydney, NSW',
      initials: 'DJ'
    },
    {
      id: '3',
      name: 'Sarah Chen',
      title: 'Senior Research Analyst',
      department: 'Research',
      location: 'Sydney, NSW',
      initials: 'SC'
    }
  ];

  // Sample prospects data
  const prospects: ProspectData[] = [
    {
      id: '1',
      name: 'Michael Thompson',
      title: 'Investment Director',
      location: 'Sydney, NSW',
      department: 'Investment Management',
      reason: 'New hire',
      actions: ['Access email']
    },
    {
      id: '2',
      name: 'Emma Wilson',
      title: 'Research Manager', 
      location: 'Melbourne, VIC',
      department: 'Research & Analysis',
      reason: 'Promotion',
      actions: ['Access email']
    }
  ];

  // Sample lookalike companies
  const lookalikeCompanies: LookalikeCompany[] = [
    {
      id: '1',
      name: 'Magellan Financial Group',
      logo: 'MF',
      location: 'Sydney, NSW',
      employees: '200-500'
    },
    {
      id: '2',
      name: 'Pendal Group',
      logo: 'PG', 
      location: 'Sydney, NSW',
      employees: '100-200'
    }
  ];

  // Sample activities
  const activities = [
    {
      id: '1',
      type: 'task',
      title: 'Follow up on Q3 investment proposal',
      description: 'Schedule meeting to discuss portfolio allocation strategy',
      timestamp: 'Aug 18, 2025, 10:30 am',
      person: 'Robert Luciano'
    },
    {
      id: '2',
      type: 'email',
      title: 'sales@company.com to Jane Smith',
      description: 'Follow-up on enterprise solution proposal',
      timestamp: 'Aug 15, 2025, 2:18 pm',
      person: 'Jane Smith'
    }
  ];

  // Network data structure for employee relationships
  const networkData = useMemo(() => {
    const nodes = allEmployees.map(emp => ({
      id: emp.id,
      name: emp.name,
      title: emp.title,
      department: emp.department,
      seniority: emp.seniority,
      location: emp.location,
      x: Math.random() * 800,
      y: Math.random() * 500,
      size: emp.seniority === 'Executive' ? 40 : emp.seniority === 'Senior' ? 30 : 20,
      color: getDepartmentColor(emp.department)
    }));

    const connections = [
      // Hierarchy connections (manager-direct report relationships)
      { from: 'emp_001', to: 'emp_002', type: 'reports_to', strength: 1 },
      { from: 'emp_001', to: 'emp_003', type: 'reports_to', strength: 1 },
      { from: 'emp_001', to: 'emp_004', type: 'reports_to', strength: 1 },
      { from: 'emp_003', to: 'emp_005', type: 'reports_to', strength: 0.8 },
      { from: 'emp_002', to: 'emp_006', type: 'reports_to', strength: 0.8 },
      { from: 'emp_004', to: 'emp_007', type: 'reports_to', strength: 0.8 },
      { from: 'emp_004', to: 'emp_008', type: 'reports_to', strength: 0.8 },
      { from: 'emp_004', to: 'emp_009', type: 'reports_to', strength: 0.8 },
      
      // Collaboration connections (cross-departmental work)
      { from: 'emp_003', to: 'emp_002', type: 'collaborates', strength: 0.6 },
      { from: 'emp_005', to: 'emp_006', type: 'collaborates', strength: 0.5 },
      { from: 'emp_007', to: 'emp_003', type: 'collaborates', strength: 0.4 },
      { from: 'emp_008', to: 'emp_006', type: 'collaborates', strength: 0.7 },
      { from: 'emp_009', to: 'emp_005', type: 'collaborates', strength: 0.3 },
      
      // Mentoring relationships
      { from: 'emp_001', to: 'emp_005', type: 'mentors', strength: 0.5 },
      { from: 'emp_003', to: 'emp_010', type: 'mentors', strength: 0.6 },
    ];

    return { nodes, connections };
  }, [allEmployees]);

  function getDepartmentColor(department: string): string {
    const colors: Record<string, string> = {
      'Executive': '#dc2626',
      'Investment Management': '#2563eb', 
      'Research & Analytics': '#7c3aed',
      'Operations': '#059669',
      'Legal & Compliance': '#ea580c',
      'Trading': '#0891b2',
      'Marketing': '#c2410c',
      'Technology': '#4338ca',
      'Finance': '#16a34a',
      'Human Resources': '#be185d'
    };
    return colors[department] || '#6b7280';
  }

  // Network visualization helper functions
  const getNetworkNodes = () => {
    switch (networkView) {
      case 'hierarchy':
        return networkData.nodes.map(node => ({
          ...node,
          x: getHierarchyX(node),
          y: getHierarchyY(node)
        }));
      case 'department':
        return networkData.nodes.map(node => ({
          ...node,
          x: getDepartmentX(node),
          y: getDepartmentY(node)
        }));
      default:
        return networkData.nodes;
    }
  };

  const getHierarchyX = (node: any) => {
    // Position based on seniority level
    if (node.seniority === 'Executive') return 400;
    if (node.seniority === 'Senior') return 200 + Math.random() * 400;
    return 100 + Math.random() * 600;
  };

  const getHierarchyY = (node: any) => {
    if (node.seniority === 'Executive') return 100;
    if (node.seniority === 'Senior') return 200 + Math.random() * 100;
    return 300 + Math.random() * 150;
  };

  const getDepartmentX = (node: any) => {
    const departments = Array.from(new Set(allEmployees.map(e => e.department)));
    const deptIndex = departments.indexOf(node.department);
    return (deptIndex + 1) * (800 / (departments.length + 1));
  };

  const getDepartmentY = (node: any) => {
    return 150 + Math.random() * 200;
  };

  // Export functionality
  const getFilteredEmployees = () => {
    let filtered = allEmployees;
    
    if (exportFilters.departments.length > 0) {
      filtered = filtered.filter(emp => exportFilters.departments.includes(emp.department));
    }
    
    if (exportFilters.seniorities.length > 0) {
      filtered = filtered.filter(emp => exportFilters.seniorities.includes(emp.seniority));
    }
    
    if (exportFilters.sources.length > 0) {
      filtered = filtered.filter(emp => exportFilters.sources.includes(emp.source));
    }
    
    if (exportFilters.includeVerifiedOnly) {
      filtered = filtered.filter(emp => emp.verified);
    }
    
    return filtered;
  };

  const exportEmployeeData = () => {
    const filteredData = getFilteredEmployees();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `vgi-partners-employees-${timestamp}`;
    
    if (exportFormat === 'csv') {
      exportToCSV(filteredData, filename);
    } else if (exportFormat === 'json') {
      exportToJSON(filteredData, filename);
    } else if (exportFormat === 'xlsx') {
      exportToXLSX(filteredData, filename);
    }
    
    setShowExportModal(false);
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = [
      'Name',
      'Title', 
      'Department',
      'Location',
      'Source',
      'Seniority',
      'Year Started',
      'Last Activity',
      'Verified',
      ...(exportFilters.includeContactInfo ? ['Email', 'Phone', 'LinkedIn Profile'] : [])
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(emp => [
        `"${emp.name}"`,
        `"${emp.title}"`,
        `"${emp.department}"`,
        `"${emp.location}"`,
        `"${emp.source}"`,
        `"${emp.seniority}"`,
        `"${emp.yearStarted || ''}"`,
        `"${emp.lastActivity || ''}"`,
        emp.verified ? 'Yes' : 'No',
        ...(exportFilters.includeContactInfo ? [
          `"${emp.email || ''}"`,
          `"${emp.phone || ''}"`,
          `"${emp.linkedinProfile || ''}"`
        ] : [])
      ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonData = data.map(emp => ({
      name: emp.name,
      title: emp.title,
      department: emp.department,
      location: emp.location,
      source: emp.source,
      seniority: emp.seniority,
      yearStarted: emp.yearStarted,
      lastActivity: emp.lastActivity,
      verified: emp.verified,
      ...(exportFilters.includeContactInfo && {
        email: emp.email,
        phone: emp.phone,
        linkedinProfile: emp.linkedinProfile
      })
    }));
    
    const jsonContent = JSON.stringify({
      company: 'VGI Partners',
      exportDate: new Date().toISOString(),
      totalEmployees: jsonData.length,
      employees: jsonData
    }, null, 2);
    
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const exportToXLSX = (data: any[], filename: string) => {
    // For XLSX export, we'll create a simple tab-separated format that Excel can open
    const headers = [
      'Name',
      'Title',
      'Department', 
      'Location',
      'Source',
      'Seniority',
      'Year Started',
      'Last Activity',
      'Verified',
      ...(exportFilters.includeContactInfo ? ['Email', 'Phone', 'LinkedIn Profile'] : [])
    ];
    
    const xlsxContent = [
      headers.join('\t'),
      ...data.map(emp => [
        emp.name,
        emp.title,
        emp.department,
        emp.location,
        emp.source,
        emp.seniority,
        emp.yearStarted || '',
        emp.lastActivity || '',
        emp.verified ? 'Yes' : 'No',
        ...(exportFilters.includeContactInfo ? [
          emp.email || '',
          emp.phone || '',
          emp.linkedinProfile || ''
        ] : [])
      ].join('\t'))
    ].join('\n');
    
    downloadFile(xlsxContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uniqueDepartments = Array.from(new Set(allEmployees.map(e => e.department)));
  const uniqueSeniorities = Array.from(new Set(allEmployees.map(e => e.seniority)));
  const uniqueSources = Array.from(new Set(allEmployees.map(e => e.source)));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      {/* Header - Fixed below global header */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/lead-generation">
                <button 
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                  {companyData.logo}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900" data-testid="text-company-name">
                    {companyData.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{companyData.industry}</span>
                    <span>•</span>
                    <span>{companyData.location}</span>
                    <span>•</span>
                    <span>{companyData.employees}</span>
                    <span>•</span>
                    <span>{companyData.revenue}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 hover:scale-110 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95" data-testid="button-phone">
                <Phone className="h-5 w-5 text-gray-600 hover:text-green-600 transition-colors duration-200" />
              </button>
              <button className="p-2 hover:bg-gray-100 hover:scale-110 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95" data-testid="button-email">
                <Mail className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
              </button>
              <button className="p-2 hover:bg-gray-100 hover:scale-110 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95" data-testid="button-external">
                <ExternalLink className="h-5 w-5 text-gray-600 hover:text-purple-600 transition-colors duration-200" />
              </button>
              <button className="p-2 hover:bg-gray-100 hover:scale-110 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95" data-testid="button-list">
                <MoreHorizontal className="h-5 w-5 text-gray-600 hover:text-indigo-600 transition-colors duration-200" />
              </button>
              <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95">
                Actions
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 mt-4">
            <button 
              onClick={() => setActiveMainTab('overview')}
              className={`pb-2 border-b-2 transition-all duration-300 text-sm hover:scale-105 hover:-translate-y-0.5 ${
                activeMainTab === 'overview' 
                  ? 'border-blue-500 text-blue-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
              data-testid="tab-overview"
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveMainTab('employees')}
              className={`pb-2 border-b-2 transition-all duration-300 text-sm hover:scale-105 hover:-translate-y-0.5 ${
                activeMainTab === 'employees' 
                  ? 'border-blue-500 text-blue-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
              data-testid="tab-employees"
            >
              Employees
            </button>
            <button 
              onClick={() => setActiveMainTab('deals')}
              className={`pb-2 border-b-2 transition-all duration-300 text-sm hover:scale-105 hover:-translate-y-0.5 ${
                activeMainTab === 'deals' 
                  ? 'border-blue-500 text-blue-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
              data-testid="tab-deals"
            >
              Deals
            </button>
            <button 
              onClick={() => setActiveMainTab('activities')}
              className={`pb-2 border-b-2 transition-all duration-300 text-sm hover:scale-105 hover:-translate-y-0.5 ${
                activeMainTab === 'activities' 
                  ? 'border-blue-500 text-blue-600 font-medium' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
              data-testid="tab-activities"
            >
              Activities
            </button>
          </div>
        </div>
      </div>
      {/* Main Content - With padding for both headers */}
      <div className="flex h-full bg-gray-50 pt-[124px]">
        {/* Left Sidebar - All Widgets - Hidden when viewing employees */}
        {activeMainTab !== 'employees' && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-3 space-y-3">

            {/* Company Information Widget */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 text-lg">Company Information</h3>
                    </div>
                    <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
                  </div>
                </div>
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-600 font-medium mb-2">ABOUT</h4>
                      <p className="text-gray-800 text-sm">{companyData.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="text-gray-600 font-medium mb-2">INDUSTRY</h4>
                        <p className="text-gray-800">{companyData.industry}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium mb-2">LOCATION</h4>
                        <p className="text-gray-800">{companyData.location}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium mb-2">EMPLOYEES</h4>
                        <p className="text-gray-800">{companyData.employees}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium mb-2">REVENUE</h4>
                        <p className="text-gray-800">{companyData.revenue}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium mb-2">PHONE NUMBER</h4>
                        <p className="text-gray-800">{companyData.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium mb-2">FOUNDING YEAR</h4>
                        <p className="text-gray-800">{companyData.founded}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 text-lg">Contacts</h3>
                      <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">{contacts.length}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all duration-200" />
                      <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600 hover:scale-110 transition-all duration-200" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg hover:from-gray-100 hover:to-gray-50 transition-all duration-200 shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-500/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                            {contact.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-900 text-sm font-medium truncate">{contact.name}</div>
                            <div className="text-gray-600 text-xs truncate">{contact.title}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button className="p-1 text-gray-500 hover:text-blue-600 hover:scale-110 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95">
                              <Mail className="h-3 w-3" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-green-600 hover:scale-110 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95">
                              <Phone className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deals Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900 text-lg">Deals</h3>
                      <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">0</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-500 cursor-pointer hover:text-green-600 hover:scale-110 transition-all duration-200 hover:rotate-90" />
                      <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-green-600 hover:scale-110 transition-all duration-200 hover:rotate-180" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl overflow-y-auto">
                  <div className="p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-gray-700 text-sm mb-2 font-medium">
                        No deals yet
                      </div>
                      <div className="text-gray-500 text-xs mb-4">
                        Create your first deal to start tracking opportunities
                      </div>
                      <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" data-testid="button-add-deal">
                        + Create Deal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Widget */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckSquare className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900 text-lg">Tasks</h3>
                      <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">0</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-500 cursor-pointer hover:text-purple-600 hover:scale-110 transition-all duration-200 hover:rotate-180" />
                      <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-purple-600 hover:scale-110 transition-all duration-200 hover:rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl overflow-y-auto">
                  <div className="p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckSquare className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-gray-700 text-lg mb-3 font-medium">No tasks yet</div>
                      <div className="text-gray-500 text-sm mb-6 max-w-md">
                        Create tasks to track important actions and follow-ups
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" data-testid="button-add-task">
                        + Add First Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Widget */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-900 text-lg">Notes</h3>
                      <span className="bg-orange-600 text-white text-sm px-3 py-1 rounded-full">0</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-gray-500 cursor-pointer hover:text-orange-600 hover:scale-110 transition-all duration-200 hover:rotate-45" />
                      <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-orange-600 hover:scale-110 transition-all duration-200 hover:rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl overflow-y-auto">
                  <div className="p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-gray-700 text-lg mb-3 font-medium">No notes yet</div>
                      <div className="text-gray-500 text-sm mb-6 max-w-md">
                        Start documenting important information and insights
                      </div>
                      <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" data-testid="button-add-note">
                        + Add First Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Main Content Area - Full Width when employees tab, otherwise flex-1 */}
        <div className={activeMainTab === 'employees' ? 'w-full p-3 bg-gray-50' : 'flex-1 p-3 bg-gray-50'}>
          {/* Overview Tab Content */}
          {activeMainTab === 'overview' && (
            <React.Fragment>
              {/* Company Insights Widget */}
              <div className="mb-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
              {/* Widget Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Company Insights</h2>
                    <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">AI Powered</span>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Live Data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">Last updated: 2 min ago</span>
                    <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-cyan-600 hover:scale-110 transition-all duration-200 hover:rotate-180" />
                    <button 
                      onClick={() => setInsightsExpanded(!insightsExpanded)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                      data-testid="toggle-insights"
                    >
                      {insightsExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {insightsExpanded && (
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl p-4">
                  {/* Enhanced Insight Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { key: 'ai-score', label: 'AI Score', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-600' },
                      { key: 'news', label: 'News', icon: FileText, badge: '8', color: 'text-red-400', bg: 'bg-red-600' },
                      { key: 'technologies', label: 'Technologies', icon: Target, badge: '15', color: 'text-blue-400', bg: 'bg-blue-600' },
                      { key: 'funding', label: 'Funding', icon: DollarSign, badge: '3', color: 'text-green-400', bg: 'bg-green-600' },
                      { key: 'job-postings', label: 'Jobs', icon: Building2, badge: '12', color: 'text-purple-400', bg: 'bg-purple-600' }
                    ].map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveInsightTab(tab.key)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                            activeInsightTab === tab.key
                              ? `${tab.bg} text-white shadow-lg`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          data-testid={`insight-tab-${tab.key}`}
                        >
                          <IconComponent className={`h-4 w-4 ${activeInsightTab === tab.key ? 'text-white' : tab.color}`} />
                          <span className="text-sm font-medium">{tab.label}</span>
                          {tab.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              activeInsightTab === tab.key ? 'bg-white bg-opacity-20' : 'bg-gray-600'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-96">
                    {/* AI Score Tab */}
                    {activeInsightTab === 'ai-score' && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                            <span className="text-3xl font-bold text-white">85</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Company AI Score</h3>
                          <p className="text-gray-600 text-sm">Based on comprehensive AI analysis of 247 data points</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600 text-sm">Financial Health</span>
                              <span className="text-green-600 font-medium">92/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600 text-sm">Market Position</span>
                              <span className="text-blue-600 font-medium">78/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600 text-sm">Growth Potential</span>
                              <span className="text-purple-600 font-medium">89/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{width: '89%'}}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600 text-sm">Tech Innovation</span>
                              <span className="text-cyan-600 font-medium">81/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-cyan-500 h-2 rounded-full" style={{width: '81%'}}></div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-gray-900 font-medium mb-3">Key AI Insights</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                              <span>Strong revenue growth trajectory with 34% YoY increase</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                              <span>Leading market position in Australian investment management</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                              <span>Expanding digital transformation initiatives</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                              <span>High employee retention and satisfaction rates</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* News Tab */}
                    {activeInsightTab === 'news' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Latest News & Mentions</h3>
                          <span className="text-xs text-gray-500">Updated 2 hours ago</span>
                        </div>
                        
                        {[
                          {
                            title: "VGI Partners Reports Strong Q3 Performance",
                            source: "Australian Financial Review",
                            sentiment: "positive",
                            date: "2 hours ago",
                            summary: "Investment management firm shows continued growth in assets under management"
                          },
                          {
                            title: "VGI Partners Expands ESG Investment Strategy",
                            source: "LinkedIn Company Update",
                            sentiment: "positive", 
                            date: "1 day ago",
                            summary: "New sustainable investment initiatives launched targeting $500M AUM"
                          },
                          {
                            title: "Market Analysis: Australian Investment Firms Outlook",
                            source: "Bloomberg",
                            sentiment: "neutral",
                            date: "3 days ago",
                            summary: "Industry report mentions VGI Partners among top performing funds"
                          },
                          {
                            title: "VGI Partners Leadership Changes",
                            source: "Google News",
                            sentiment: "neutral",
                            date: "1 week ago",
                            summary: "Senior portfolio manager appointment strengthens investment team"
                          }
                        ].map((article, index) => (
                          <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-gray-900 font-medium text-sm leading-tight pr-4">{article.title}</h4>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                article.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                article.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {article.sentiment}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm mb-3">{article.summary}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{article.source}</span>
                              <span>{article.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technologies Tab */}
                    {activeInsightTab === 'technologies' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Technology Stack & Platforms</h3>
                          <span className="text-xs text-gray-500">Last scanned: 4 hours ago</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-gray-900 font-medium mb-3">Core Infrastructure</h4>
                            <div className="space-y-2">
                              {[
                                { name: "Microsoft Azure", confidence: "95%", category: "Cloud" },
                                { name: "Office 365", confidence: "98%", category: "Productivity" },
                                { name: "Bloomberg Terminal", confidence: "92%", category: "Financial Data" },
                                { name: "Salesforce", confidence: "87%", category: "CRM" }
                              ].map((tech, index) => (
                                <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-900 text-sm font-medium">{tech.name}</span>
                                    <span className="text-blue-600 text-xs">{tech.confidence}</span>
                                  </div>
                                  <span className="text-gray-600 text-xs">{tech.category}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-gray-900 font-medium mb-3">Investment & Analytics</h4>
                            <div className="space-y-2">
                              {[
                                { name: "FactSet", confidence: "89%", category: "Research Platform" },
                                { name: "Refinitiv Eikon", confidence: "91%", category: "Market Data" },
                                { name: "Python/R", confidence: "85%", category: "Analytics" },
                                { name: "Tableau", confidence: "78%", category: "Visualization" }
                              ].map((tech, index) => (
                                <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-900 text-sm font-medium">{tech.name}</span>
                                    <span className="text-green-600 text-xs">{tech.confidence}</span>
                                  </div>
                                  <span className="text-gray-600 text-xs">{tech.category}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-gray-900 font-medium mb-3">Recent Technology Adoptions</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-sm">AI/ML Analytics Platform</span>
                              <span className="text-cyan-600 text-xs">Added 2 weeks ago</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-sm">Enhanced Cybersecurity Suite</span>
                              <span className="text-purple-600 text-xs">Added 1 month ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Funding Tab */}
                    {activeInsightTab === 'funding' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Funding History & Financial Data</h3>
                          <span className="text-xs text-gray-500">Source: Crunchbase, Public Records</span>
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg border border-gray-200">
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-green-600 mb-2">$2.1B</div>
                            <div className="text-gray-700">Total Assets Under Management</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="text-lg font-semibold text-blue-600 mb-1">IPO (2017)</div>
                            <div className="text-sm text-gray-700 mb-2">Listed on ASX</div>
                            <div className="text-xs text-gray-500">Market Cap: $450M</div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="text-lg font-semibold text-green-600 mb-1">Revenue</div>
                            <div className="text-sm text-gray-700 mb-2">$45M (2023)</div>
                            <div className="text-xs text-gray-500">+34% YoY Growth</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-gray-900 font-medium">Key Financial Metrics</h4>
                          {[
                            { metric: "Price-to-Earnings Ratio", value: "18.5", trend: "stable" },
                            { metric: "Return on Equity", value: "22.4%", trend: "up" },
                            { metric: "Dividend Yield", value: "4.2%", trend: "up" },
                            { metric: "Net Profit Margin", value: "31.8%", trend: "up" }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-gradient-to-br from-white to-gray-50 p-3 rounded-lg border border-gray-200">
                              <span className="text-gray-700 text-sm">{item.metric}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-900 font-medium">{item.value}</span>
                                <div className={`w-2 h-2 rounded-full ${
                                  item.trend === 'up' ? 'bg-green-500' :
                                  item.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                                }`}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Job Postings Tab */}
                    {activeInsightTab === 'job-postings' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Active Job Postings</h3>
                          <span className="text-xs text-gray-500">12 active positions</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                            <div className="text-xs text-gray-600">Investment Roles</div>
                          </div>
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                            <div className="text-xs text-gray-600">Tech Positions</div>
                          </div>
                          <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-1">1</div>
                            <div className="text-xs text-gray-600">Operations</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {[
                            {
                              title: "Senior Portfolio Manager",
                              department: "Investment Management",
                              location: "Sydney, NSW",
                              source: "LinkedIn",
                              posted: "3 days ago",
                              urgent: true
                            },
                            {
                              title: "Quantitative Research Analyst",
                              department: "Research & Analytics",
                              location: "Sydney, NSW", 
                              source: "Indeed",
                              posted: "1 week ago",
                              urgent: false
                            },
                            {
                              title: "ESG Investment Specialist",
                              department: "Sustainable Investing",
                              location: "Sydney, NSW",
                              source: "Glassdoor",
                              posted: "5 days ago",
                              urgent: true
                            },
                            {
                              title: "Senior Data Engineer",
                              department: "Technology",
                              location: "Sydney, NSW",
                              source: "LinkedIn",
                              posted: "2 days ago",
                              urgent: false
                            }
                          ].map((job, index) => (
                            <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="text-gray-900 font-medium text-sm">{job.title}</h4>
                                    {job.urgent && (
                                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded">Urgent</span>
                                    )}
                                  </div>
                                  <div className="text-gray-700 text-sm">{job.department}</div>
                                  <div className="text-gray-500 text-xs">{job.location}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Source: {job.source}</span>
                                <span>{job.posted}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-gray-900 font-medium mb-3">Hiring Trends Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-sm">Average time to fill</span>
                              <span className="text-blue-600 text-sm font-medium">45 days</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-sm">Most in-demand skills</span>
                              <span className="text-green-600 text-sm font-medium">Portfolio Analysis, ESG</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-sm">Salary range trend</span>
                              <span className="text-purple-600 text-sm font-medium">+12% vs last year</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          

          {/* Lookalike Companies */}
          <div className="mb-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-900">Lookalike companies</h2>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Beta</span>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      Apollo AI
                    </span>
                  </div>
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl p-4">
                <div className="grid grid-cols-4 gap-4 text-xs text-gray-600 font-medium mb-4">
                  <div>NAME</div>
                  <div>LOCATION</div>
                  <div>NUMBER OF EMPLOYEES</div>
                  <div>ACTIONS</div>
                </div>
                <div className="space-y-3">
                  {lookalikeCompanies.map((company) => (
                    <div key={company.id} className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-xs font-semibold">
                          {company.logo}
                        </div>
                        <div className="text-gray-900 font-medium">{company.name}</div>
                      </div>
                      <div className="text-gray-700">{company.location}</div>
                      <div className="text-gray-700">{company.employees}</div>
                      <div>
                        <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors" data-testid={`button-save-${company.id}`}>
                          <Plus className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span>1 - 2 of 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Prospects Widget */}
          <div className="mb-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Key Prospects</h2>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Live Data</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">{allContacts.length} contacts found</span>
                    <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl p-4">
                {/* List Header */}
                <div className="grid grid-cols-5 gap-4 text-xs text-gray-600 font-medium mb-4 pb-2 border-b border-gray-200">
                  <div>NAME</div>
                  <div>TITLE</div>
                  <div>DEPARTMENT</div>
                  <div>LOCATION</div>
                  <div>ACTIONS</div>
                </div>
                
                {/* Prospects List */}
                <div className="space-y-2">
                  {getCurrentPageContacts().map((contact, index) => (
                    <div key={index} className="relative">
                      <div className="grid grid-cols-5 gap-4 py-3 px-2 rounded-lg hover:bg-gray-100/50 transition-colors border-b border-gray-200/50">
                        <div className="group col-span-4 grid grid-cols-4 gap-4 cursor-pointer">
                          {/* Name with Avatar */}
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-gray-900 font-medium text-sm flex items-center space-x-1">
                                <span className="truncate">
                                  {contact.name}
                                </span>
                                {contact.verified && (
                                  <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Title */}
                          <div className="flex flex-col justify-center min-w-0">
                            <div className="text-gray-700 text-sm truncate">
                              {contact.title}
                            </div>
                          </div>
                          
                          {/* Department */}
                          <div className="flex flex-col justify-center min-w-0">
                            <div className="text-gray-600 text-sm truncate">
                              {contact.department}
                            </div>
                          </div>
                          
                          {/* Location */}
                          <div className="flex flex-col justify-center min-w-0">
                            <div className="text-gray-600 text-sm truncate">
                              {contact.location}
                            </div>
                          </div>

                          {/* Hover Card for first 4 columns only */}
                          <div className="absolute left-0 top-full mt-2 w-96 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="flex items-start space-x-4">
                              {/* Avatar */}
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                {/* Header */}
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-gray-900 font-semibold text-base">{contact.name}</h3>
                                    {contact.verified && (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                  </div>
                                  <div className="text-gray-700 font-medium">{contact.title}</div>
                                  <div className="text-gray-600 text-sm">{contact.department}</div>
                                </div>

                                {/* Location Details */}
                                <div className="space-y-2 border-t border-gray-200 pt-3">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-purple-600" />
                                    <span className="text-gray-700 text-sm">{contact.location}</span>
                                  </div>
                                </div>

                                {/* Status & Source */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                                  <div>
                                    <div className="text-gray-600 text-xs">Connection</div>
                                    <div className="text-gray-700 text-sm">{contact.connection}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-600 text-xs">Last Activity</div>
                                    <div className="text-gray-700 text-sm">{contact.lastActivity}</div>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    contact.source.includes('LinkedIn') 
                                      ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30' 
                                      : 'bg-green-600/20 text-green-300 border border-green-600/30'
                                  }`}>
                                    {contact.source}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions Column - Outside hover group */}
                        <div className="flex flex-col items-center space-y-2">
                          {/* Email Access */}
                          {!accessedEmails.has((currentPage - 1) * contactsPerPage + index) ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAccessEmail((currentPage - 1) * contactsPerPage + index);
                              }}
                              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs px-4 py-1.5 rounded-full shadow-lg shadow-blue-600/30 border border-blue-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/40 pointer-events-auto"
                            >
                              Access Email
                            </button>
                          ) : (
                            <div className="relative cursor-pointer pointer-events-auto">
                              <Mail className="h-6 w-6 text-blue-400 hover:text-blue-300 transition-colors" />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-2 w-2 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Phone Access */}
                          {!accessedNumbers.has((currentPage - 1) * contactsPerPage + index) ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAccessNumber((currentPage - 1) * contactsPerPage + index);
                              }}
                              className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs px-4 py-1.5 rounded-full shadow-lg shadow-green-600/30 border border-green-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-green-600/40 pointer-events-auto"
                            >
                              Access Number
                            </button>
                          ) : (
                            <div className="relative cursor-pointer pointer-events-auto">
                              <Phone className="h-6 w-6 text-green-400 hover:text-green-300 transition-colors" />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-2 w-2 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>


                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * contactsPerPage) + 1}-{Math.min(currentPage * contactsPerPage, allContacts.length)} of {allContacts.length} contacts
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded transition-colors disabled:opacity-50" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          className={`w-8 h-8 text-sm rounded transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors disabled:opacity-50"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
                  <div className="flex items-center space-x-2">
                    <select className="bg-gray-100 text-gray-900 text-sm px-2 py-1 rounded border border-gray-300">
                      <option>Log activity</option>
                    </select>
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl p-4">
                {/* Activity Tabs */}
                <div className="flex space-x-4 mb-4 border-b border-gray-200">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'emails', label: 'Emails' },
                    { key: 'calls', label: 'Calls' },
                    { key: 'conversations', label: 'Conversations' },
                    { key: 'meetings', label: 'Meetings' },
                    { key: 'notes', label: 'Notes' },
                    { key: 'tasks', label: 'Tasks' },
                    { key: 'activity-log', label: 'Activity log' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveActivityTab(tab.key as any)}
                      className={`pb-2 border-b-2 transition-colors text-sm ${
                        activeActivityTab === tab.key
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-900'
                      }`}
                      data-testid={`activity-tab-${tab.key}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-900 font-medium">Upcoming</div>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 transition-colors text-sm" data-testid="button-filter">
                    <Filter className="h-4 w-4" />
                    <span>Filter 6/6</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border-l-2 border-blue-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {activity.type === 'email' && (
                              <Mail className="h-4 w-4 text-green-600" />
                            )}
                            {activity.type === 'task' && (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="text-gray-900 font-medium text-sm">{activity.title}</span>
                          </div>
                          {activity.description && (
                            <div className="text-gray-600 text-sm mb-2">
                              {activity.description}
                            </div>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
            </React.Fragment>
          )}

          {/* Employees Tab Content - Full Width */}
          {activeMainTab === 'employees' && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Employee Directory</h2>
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Live Data</span>
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Multi-Source</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">{allEmployees.length} employees found</span>
                      
                      {/* View Mode Toggle */}
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setEmployeeViewMode('list')}
                          className={`p-1 rounded transition-colors ${
                            employeeViewMode === 'list' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          data-testid="view-mode-list"
                        >
                          <List className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEmployeeViewMode('network')}
                          className={`p-1 rounded transition-colors ${
                            employeeViewMode === 'network' 
                              ? 'bg-white text-blue-600 shadow-sm' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          data-testid="view-mode-network"
                        >
                          <Network className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <Search className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
                      <Filter className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
                      
                      {/* Export Button */}
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        data-testid="export-employees"
                      >
                        <Download className="h-3 w-3" />
                        <span>Export</span>
                      </button>
                      
                      <Settings className="h-4 w-4 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-b-xl p-4">
                  {/* Network View Controls */}
                  {employeeViewMode === 'network' && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-medium text-gray-900">Network Visualization</h3>
                          <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            {[
                              { key: 'hierarchy', label: 'Hierarchy', icon: 'org' },
                              { key: 'department', label: 'Department', icon: 'group' },
                              { key: 'connections', label: 'Connections', icon: 'network' }
                            ].map((view) => (
                              <button
                                key={view.key}
                                onClick={() => setNetworkView(view.key as any)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${
                                  networkView === view.key
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                                data-testid={`network-view-${view.key}`}
                              >
                                {view.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setNetworkFullscreen(!networkFullscreen)}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                          data-testid="network-fullscreen"
                        >
                          {networkFullscreen ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* Network Canvas */}
                      <div className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden ${
                        networkFullscreen ? 'h-[80vh]' : 'h-[500px]'
                      }`}>
                        <svg 
                          className="w-full h-full" 
                          viewBox="0 0 900 600"
                          data-testid="network-canvas"
                        >
                          {/* Background Grid */}
                          <defs>
                            <pattern
                              id="grid"
                              width="50"
                              height="50"
                              patternUnits="userSpaceOnUse"
                            >
                              <path
                                d="M 50 0 L 0 0 0 50"
                                fill="none"
                                stroke="#f3f4f6"
                                strokeWidth="1"
                              />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          
                          {/* Connection Lines */}
                          {networkData.connections.map((connection, index) => {
                            const fromNode = getNetworkNodes().find(n => n.id === connection.from);
                            const toNode = getNetworkNodes().find(n => n.id === connection.to);
                            
                            if (!fromNode || !toNode) return null;
                            
                            return (
                              <line
                                key={index}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke={
                                  connection.type === 'reports_to' ? '#3b82f6' :
                                  connection.type === 'collaborates' ? '#10b981' :
                                  '#f59e0b'
                                }
                                strokeWidth={connection.strength * 3}
                                strokeOpacity={0.6}
                                strokeDasharray={connection.type === 'mentors' ? '5,5' : 'none'}
                              />
                            );
                          })}
                          
                          {/* Employee Nodes */}
                          {getNetworkNodes().map((node, index) => (
                            <g key={node.id}>
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.size}
                                fill={node.color}
                                stroke={selectedEmployee === node.id ? '#1d4ed8' : '#ffffff'}
                                strokeWidth={selectedEmployee === node.id ? 3 : 2}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedEmployee(selectedEmployee === node.id ? null : node.id)}
                                data-testid={`network-node-${index}`}
                              />
                              <text
                                x={node.x}
                                y={node.y + node.size + 15}
                                textAnchor="middle"
                                className="text-xs fill-gray-700 font-medium"
                                style={{ fontSize: '10px' }}
                              >
                                {node.name.split(' ')[0]}
                              </text>
                              {selectedEmployee === node.id && (
                                <text
                                  x={node.x}
                                  y={node.y + node.size + 28}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-600"
                                  style={{ fontSize: '8px' }}
                                >
                                  {node.title}
                                </text>
                              )}
                            </g>
                          ))}
                        </svg>
                        
                        {/* Legend */}
                        <div className="absolute bottom-4 left-4 bg-white rounded-lg border border-gray-200 p-3 shadow-lg">
                          <h4 className="text-xs font-medium text-gray-900 mb-2">Legend</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-1 bg-blue-500"></div>
                              <span className="text-gray-600">Reports To</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-1 bg-green-500"></div>
                              <span className="text-gray-600">Collaborates</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-1 bg-yellow-500" style={{borderTop: '1px dashed'}}></div>
                              <span className="text-gray-600">Mentors</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Node Size Legend */}
                        <div className="absolute bottom-4 right-4 bg-white rounded-lg border border-gray-200 p-3 shadow-lg">
                          <h4 className="text-xs font-medium text-gray-900 mb-2">Seniority</h4>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 rounded-full bg-red-600"></div>
                              <span className="text-xs text-gray-600">Executive</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                              <span className="text-xs text-gray-600">Senior</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                              <span className="text-xs text-gray-600">Mid</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Selected Employee Details */}
                      {selectedEmployee && (
                        <div className="mt-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200 p-4">
                          {(() => {
                            const employee = allEmployees.find(e => e.id === selectedEmployee);
                            if (!employee) return null;
                            
                            return (
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium">
                                    {employee.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                                    <p className="text-gray-600">{employee.title}</p>
                                    <p className="text-sm text-gray-500">{employee.department} • {employee.location}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {employee.email && (
                                    <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
                                      <Mail className="h-4 w-4" />
                                    </button>
                                  )}
                                  {employee.phone && (
                                    <button className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100">
                                      <Phone className="h-4 w-4" />
                                    </button>
                                  )}
                                  {employee.linkedinProfile && (
                                    <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
                                      <ExternalLink className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* List View */}
                  {employeeViewMode === 'list' && (
                    <>
                      {/* Employee List Header */}
                      <div className="grid grid-cols-6 gap-4 text-xs text-gray-600 font-medium mb-4 pb-2 border-b border-gray-200">
                        <div>NAME</div>
                        <div>JOB TITLE</div>
                        <div>DEPARTMENT</div>
                        <div>LOCATION</div>
                        <div>SENIORITY</div>
                        <div>ACTIONS</div>
                      </div>
                  
                      {/* Employee List */}
                      <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {getCurrentPageEmployees().map((employee, index) => (
                      <div key={employee.id} className="relative">
                        <div className="grid grid-cols-6 gap-4 py-3 px-2 rounded-lg hover:bg-gray-100/50 transition-colors border-b border-gray-200/50">
                          {/* Name */}
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-gray-900 text-sm font-medium truncate">{employee.name}</div>
                              <div className="text-gray-600 text-xs truncate flex items-center space-x-1">
                                {employee.verified && (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Job Title */}
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm truncate">{employee.title}</span>
                          </div>
                          
                          {/* Department */}
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm truncate">{employee.department}</span>
                          </div>
                          
                          {/* Location */}
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm truncate">{employee.location}</span>
                          </div>
                          
                          {/* Seniority */}
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              employee.seniority === 'Executive' ? 'bg-red-100 text-red-700' :
                              employee.seniority === 'Senior' ? 'bg-blue-100 text-blue-700' :
                              employee.seniority === 'Mid' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {employee.seniority}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-1">
                            {employee.email && (
                              <button 
                                className="p-1 text-gray-500 hover:text-blue-600 hover:scale-110 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95"
                                data-testid={`email-employee-${index}`}
                              >
                                <Mail className="h-4 w-4" />
                              </button>
                            )}
                            {employee.phone && (
                              <button 
                                className="p-1 text-gray-500 hover:text-green-600 hover:scale-110 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95"
                                data-testid={`phone-employee-${index}`}
                              >
                                <Phone className="h-4 w-4" />
                              </button>
                            )}
                            {employee.linkedinProfile && (
                              <button 
                                className="p-1 text-gray-500 hover:text-blue-600 hover:scale-110 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95"
                                data-testid={`linkedin-employee-${index}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            )}
                            <button 
                              className="p-1 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200 rounded hover:bg-gray-100 active:scale-95"
                              data-testid={`more-employee-${index}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Employee Pagination */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {((employeeCurrentPage - 1) * employeesPerPage) + 1} - {Math.min(employeeCurrentPage * employeesPerPage, allEmployees.length)} of {allEmployees.length} employees
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEmployeeCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={employeeCurrentPage === 1}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        data-testid="prev-employee-page"
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {[...Array(employeeTotalPages)].map((_, index) => {
                          const pageNum = index + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setEmployeeCurrentPage(pageNum)}
                              className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                                employeeCurrentPage === pageNum
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
                              } active:scale-95`}
                              data-testid={`employee-page-${pageNum}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setEmployeeCurrentPage(prev => Math.min(employeeTotalPages, prev + 1))}
                        disabled={employeeCurrentPage === employeeTotalPages}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        data-testid="next-employee-page"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Deals Tab Content - Placeholder */}
          {activeMainTab === 'deals' && (
            <div className="mb-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-8 text-center">
                  <DollarSign className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Deals View</h3>
                  <p className="text-gray-600">Deal management interface coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* Activities Tab Content - Placeholder */}
          {activeMainTab === 'activities' && (
            <div className="mb-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100">
                <div className="p-8 text-center">
                  <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Activities View</h3>
                  <p className="text-gray-600">Activity management interface coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="export-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Export Employee Data</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-200 rounded-lg hover:bg-gray-100 active:scale-95"
                  data-testid="close-export-modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Export Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'csv', label: 'CSV', icon: FileText, desc: 'Spreadsheet' },
                    { key: 'json', label: 'JSON', icon: FileText, desc: 'Structured' },
                    { key: 'xlsx', label: 'Excel', icon: FileSpreadsheet, desc: 'Workbook' }
                  ].map((format) => (
                    <button
                      key={format.key}
                      onClick={() => setExportFormat(format.key as any)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        exportFormat === format.key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                      data-testid={`format-${format.key}`}
                    >
                      <format.icon className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">{format.label}</div>
                      <div className="text-xs text-gray-500">{format.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Filter Options</label>
                
                {/* Department Filter */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Departments ({exportFilters.departments.length} selected)</label>
                  <div className="max-h-24 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {uniqueDepartments.map((dept) => (
                      <label key={dept} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={exportFilters.departments.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExportFilters(prev => ({
                                ...prev,
                                departments: [...prev.departments, dept]
                              }));
                            } else {
                              setExportFilters(prev => ({
                                ...prev,
                                departments: prev.departments.filter(d => d !== dept)
                              }));
                            }
                          }}
                          className="rounded text-blue-600"
                        />
                        <span className="text-xs text-gray-700">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Seniority Filter */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Seniority Levels ({exportFilters.seniorities.length} selected)</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSeniorities.map((seniority) => (
                      <button
                        key={seniority}
                        onClick={() => {
                          if (exportFilters.seniorities.includes(seniority)) {
                            setExportFilters(prev => ({
                              ...prev,
                              seniorities: prev.seniorities.filter(s => s !== seniority)
                            }));
                          } else {
                            setExportFilters(prev => ({
                              ...prev,
                              seniorities: [...prev.seniorities, seniority]
                            }));
                          }
                        }}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          exportFilters.seniorities.includes(seniority)
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {seniority}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.includeContactInfo}
                      onChange={(e) => setExportFilters(prev => ({
                        ...prev,
                        includeContactInfo: e.target.checked
                      }))}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Include contact information</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exportFilters.includeVerifiedOnly}
                      onChange={(e) => setExportFilters(prev => ({
                        ...prev,
                        includeVerifiedOnly: e.target.checked
                      }))}
                      className="rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Verified contacts only</span>
                  </label>
                </div>
              </div>

              {/* Export Summary */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700">
                  <strong>{getFilteredEmployees().length}</strong> of <strong>{allEmployees.length}</strong> employees will be exported
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Format: {exportFormat.toUpperCase()} • 
                  Contact info: {exportFilters.includeContactInfo ? 'Included' : 'Excluded'} •
                  Verified only: {exportFilters.includeVerifiedOnly ? 'Yes' : 'No'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 active:scale-95"
                  data-testid="cancel-export"
                >
                  Cancel
                </button>
                <button
                  onClick={exportEmployeeData}
                  disabled={getFilteredEmployees().length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  data-testid="confirm-export"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetailPageBMI;