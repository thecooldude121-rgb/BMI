import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Building2, Globe, Users, MapPin, DollarSign,
  TrendingUp, Calendar, BarChart3, Star, Bookmark, MoreVertical,
  ExternalLink, Download, Settings, Layers, Database, RefreshCw,
  Tag, BookmarkCheck, X, Zap
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

const CompanyDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'employees' | 'revenue'>('relevance');
  const [showFilters, setShowFilters] = useState(true);

  // Mock company data with comprehensive information
  const companies: CompanyData[] = [
    {
      id: 'comp-1',
      name: 'Acme Corporation',
      logo: '🏢',
      domain: 'acme.com',
      website: 'https://acme.com',
      linkedinUrl: 'https://linkedin.com/company/acme-corp',
      industry: 'Enterprise Software',
      location: 'San Francisco, CA',
      employeeCount: '1,001-5,000',
      revenue: '$50M-$100M',
      founded: 2010,
      description: 'Leading provider of enterprise software solutions',
      technologies: ['Salesforce', 'AWS', 'React', 'Node.js'],
      keywords: ['Enterprise', 'SaaS', 'Cloud Computing', 'B2B', 'Software'],
      funding: 'Series C - $25M',
      saved: false
    },
    {
      id: 'comp-2',
      name: 'Global Tech Solutions',
      logo: '💻',
      domain: 'globaltech.io',
      website: 'https://globaltech.io',
      linkedinUrl: 'https://linkedin.com/company/global-tech-solutions',
      industry: 'Artificial Intelligence',
      location: 'New York, NY',
      employeeCount: '501-1,000',
      revenue: '$25M-$50M',
      founded: 2015,
      description: 'Innovative cloud computing and AI solutions',
      technologies: ['Google Cloud', 'Python', 'TensorFlow'],
      keywords: ['AI', 'Machine Learning', 'Cloud', 'Analytics', 'Innovation'],
      funding: 'Series B - $15M',
      saved: true
    },
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
    }
  ];

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const toggleCompanySelection = (id: string) => {
    setSelectedCompanies(prev => 
      prev.includes(id) ? prev.filter(compId => compId !== id) : [...prev, id]
    );
  };

  const selectAllCompanies = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(companies.map(company => company.id));
    }
  };

  const saveCompany = (id: string) => {
    console.log("Company saved:", id);
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
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  <Filter className="h-4 w-4 inline mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Zap className="h-4 w-4 inline mr-2" />
                  Enrich Data
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company name, industry, keywords..."
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
                  <option value="employees">Employee Count</option>
                  <option value="revenue">Revenue</option>
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
              checked={selectedCompanies.length === companies.length && companies.length > 0}
              onChange={selectAllCompanies}
              className="mr-4 rounded border-gray-300"
            />
            <div className="grid grid-cols-12 gap-4 flex-1 text-xs font-medium text-gray-600 uppercase tracking-wider">
              <div className="col-span-3">Company Name</div>
              <div className="col-span-2">Links</div>
              <div className="col-span-1">Employees</div>
              <div className="col-span-2">Industry</div>
              <div className="col-span-2">Keywords</div>
              <div className="col-span-1">Revenue</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="divide-y divide-gray-200">
            {companies.map((company) => (
              <div key={company.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company.id)}
                    onChange={() => toggleCompanySelection(company.id)}
                    className="mr-4 rounded border-gray-300"
                  />
                  <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                    {/* Company Name */}
                    <div className="col-span-3 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg">
                        {company.logo}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-xs text-gray-500">{company.domain}</div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="col-span-2 flex items-center space-x-2">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        Website
                      </a>
                      <a
                        href={company.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                      >
                        <SiLinkedin className="h-3 w-3 mr-1" />
                        LinkedIn
                      </a>
                    </div>

                    {/* Number of Employees */}
                    <div className="col-span-1 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-gray-400" />
                        {company.employeeCount}
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="col-span-2 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Building2 className="h-3 w-3 mr-1 text-gray-400" />
                        {company.industry}
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {company.keywords.slice(0, 2).map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {keyword}
                          </span>
                        ))}
                        {company.keywords.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{company.keywords.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="col-span-1 text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                        {company.revenue}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center space-x-2">
                      <button
                        onClick={() => saveCompany(company.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {company.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
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
                1 - {companies.length} of {companies.length}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">
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

export default CompanyDiscovery;