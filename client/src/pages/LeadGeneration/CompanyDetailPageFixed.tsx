import React, { useState } from 'react';
import { ArrowLeft, Edit, Plus, Building, MapPin, Globe, Users, Mail, Phone, MoreVertical } from 'lucide-react';

interface Employee {
  name: string;
  title: string;
  department: string;
  location: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface CompanyData {
  name: string;
  domain: string;
  logo: string;
  description: string;
  industry: string;
  website: string;
  location: string;
  founded: string;
  size: string;
  keywords?: string[];
  employees?: Employee[];
}

const CompanyDetailPageFixed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees'>('overview');

  // Sample company data
  const companyData: CompanyData = {
    name: 'TechCorp Solutions',
    domain: 'techcorp.com',
    logo: 'TC',
    description: 'Leading technology solutions provider specializing in enterprise software development and digital transformation.',
    industry: 'Technology',
    website: 'https://techcorp.com',
    location: 'San Francisco, CA',
    founded: '2010',
    size: '500-1000 employees',
    keywords: ['Software Development', 'Enterprise Solutions', 'Digital Transformation', 'Cloud Computing'],
    employees: [
      {
        name: 'John Smith',
        title: 'CEO',
        department: 'Executive',
        location: 'San Francisco, CA',
        email: 'john.smith@techcorp.com',
        phone: '+1 555-0101'
      },
      {
        name: 'Sarah Johnson',
        title: 'CTO',
        department: 'Technology',
        location: 'San Francisco, CA',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1 555-0102'
      },
      {
        name: 'Mike Chen',
        title: 'VP Engineering',
        department: 'Engineering',
        location: 'San Francisco, CA',
        email: 'mike.chen@techcorp.com',
        phone: '+1 555-0103'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {companyData.logo}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{companyData.name}</h1>
                  <p className="text-sm text-gray-500">{companyData.domain}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button className="flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add to CRM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'employees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Employees
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Company Information */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-gray-600 text-sm mb-4">{companyData.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Industry</h4>
                        <p className="text-sm text-gray-900">{companyData.industry}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Company Size</h4>
                        <p className="text-sm text-gray-900">{companyData.size}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Founded</h4>
                        <p className="text-sm text-gray-900">{companyData.founded}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                        <p className="text-sm text-gray-900">{companyData.location}</p>
                      </div>
                    </div>

                    {companyData.keywords && companyData.keywords.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {companyData.keywords.map((keyword, index) => (
                            <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Employees ({companyData.employees?.length || 0})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companyData.employees?.map((employee, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.title}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.department}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employee.location}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              {employee.email && (
                                <button className="flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </button>
                              )}
                              {employee.phone && (
                                <button className="flex items-center px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Call
                                </button>
                              )}
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPageFixed;