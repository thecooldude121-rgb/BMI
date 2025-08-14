import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Building2, Globe, Users, MapPin, DollarSign,
  TrendingUp, Calendar, BarChart3, Star, Bookmark, MoreVertical,
  ExternalLink, Download, Settings, Layers, Database, RefreshCw
} from 'lucide-react';

interface CompanyData {
  id: string;
  name: string;
  logo?: string;
  domain: string;
  industry: string;
  location: string;
  employeeCount: string;
  revenue: string;
  founded: number;
  description: string;
  technologies: string[];
  funding: string;
  lastActivity?: Date;
  saved?: boolean;
}

const CompanyDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'recent' | 'employees' | 'revenue'>('relevance');
  const [showFilters, setShowFilters] = useState(true);

  // Mock company data
  const companies: CompanyData[] = [
    {
      id: 'comp-1',
      name: 'Acme Corporation',
      logo: '🏢',
      domain: 'acme.com',
      industry: 'Technology',
      location: 'San Francisco, CA',
      employeeCount: '1,001-5,000',
      revenue: '$50M-$100M',
      founded: 2010,
      description: 'Leading provider of enterprise software solutions',
      technologies: ['Salesforce', 'AWS', 'React', 'Node.js'],
      funding: 'Series C - $25M',
      saved: false
    },
    {
      id: 'comp-2',
      name: 'Global Tech Solutions',
      logo: '💻',
      domain: 'globaltech.io',
      industry: 'Software',
      location: 'New York, NY',
      employeeCount: '501-1,000',
      revenue: '$25M-$50M',
      founded: 2015,
      description: 'Innovative cloud computing and AI solutions',
      technologies: ['Google Cloud', 'Python', 'TensorFlow'],
      funding: 'Series B - $15M',
      saved: true
    }
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Company Discovery</h2>
            <p className="text-sm text-gray-600 mt-1">Find and research target companies</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Industry Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Industry</h4>
                <div className="space-y-2">
                  {['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail'].map(industry => (
                    <label key={industry} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Size Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Employee Count</h4>
                <div className="space-y-2">
                  {['1-50', '51-200', '201-500', '501-1,000', '1,001-5,000', '5,000+'].map(size => (
                    <label key={size} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Revenue Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue</h4>
                <div className="space-y-2">
                  {['<$1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'].map(revenue => (
                    <label key={revenue} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600">{revenue}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="recent">Recently Added</option>
                <option value="employees">Employee Count</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
          </div>

          {/* Companies List */}
          <div className="p-6">
            <div className="text-sm text-gray-600 mb-4">
              Showing {companies.length} companies
            </div>
            
            <div className="space-y-4">
              {companies.map((company) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {company.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                          <span className="text-sm text-gray-500">({company.domain})</span>
                          {company.saved && <Bookmark className="w-4 h-4 text-blue-600 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{company.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Building2 className="w-3 h-3 mr-1" />
                            {company.industry}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {company.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {company.employeeCount}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {company.revenue}
                          </div>
                        </div>

                        {company.technologies.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {company.technologies.slice(0, 4).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                              {company.technologies.length > 4 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{company.technologies.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDiscovery;