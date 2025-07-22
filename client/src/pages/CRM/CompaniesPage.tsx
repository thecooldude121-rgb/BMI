import React, { useState } from 'react';
import { Plus, Search, Building, Globe, Users, DollarSign, Filter, Download, CheckSquare, Square, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CompanyForm from '../../components/CRM/CompanyForm';
import BulkActionsDropdown from '../../components/CRM/BulkActionsDropdown';
import { apiRequest } from '../../lib/queryClient';

const CompaniesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['/api/accounts'],
  });
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/contacts'],
  });
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
  });

  const accountsArray = Array.isArray(accounts) ? accounts : [];
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  const leadsArray = Array.isArray(leads) ? leads : [];
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const deleteAccountsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiRequest('/api/accounts', {
        method: 'DELETE',
        body: { ids }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      setSelectedAccounts([]);
      setIsSelectionMode(false);
    }
  });

  if (accountsLoading || contactsLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading companies...</div>
      </div>
    );
  }

  const filteredCompanies = accountsArray.filter((company: any) => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.domain && company.domain.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    const matchesSize = sizeFilter === 'all' || company.companySize === sizeFilter;
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const industries = Array.from(new Set(accountsArray.map((c: any) => c.industry).filter(Boolean)));
  const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  const getCompanyContacts = (companyId: string) => {
    return contactsArray.filter((contact: any) => contact.accountId === companyId);
  };

  const getCompanyLeads = (companyId: string) => {
    return leadsArray.filter((lead: any) => lead.accountId === companyId);
  };

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredCompanies.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredCompanies.map((account: any) => account.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedAccounts.length > 0 && window.confirm(`Delete ${selectedAccounts.length} selected companies?`)) {
      deleteAccountsMutation.mutate(selectedAccounts);
    }
  };

  const handleBulkTransfer = () => {
    alert(`Bulk Transfer feature for ${selectedAccounts.length} companies - Coming Soon!`);
  };

  const handleBulkUpdate = () => {
    alert(`Bulk Update feature for ${selectedAccounts.length} companies - Coming Soon!`);
  };

  const handleBulkEmail = () => {
    alert(`Bulk Email feature for ${selectedAccounts.length} companies - Coming Soon!`);
  };

  const handlePrintView = () => {
    alert(`Print View feature for ${selectedAccounts.length} companies - Coming Soon!`);
  };

  const getSizeColor = (size: string) => {
    const colors = {
      '1-10': 'bg-gray-100 text-gray-800',
      '11-50': 'bg-blue-100 text-blue-800',
      '51-200': 'bg-green-100 text-green-800',
      '201-500': 'bg-yellow-100 text-yellow-800',
      '501-1000': 'bg-orange-100 text-orange-800',
      '1000+': 'bg-purple-100 text-purple-800'
    };
    return colors[size as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
          <p className="text-gray-600">{filteredCompanies.length} of {accountsArray.length} companies</p>
        </div>
        <div className="flex space-x-3">
          {isSelectionMode ? (
            <>
              <button
                onClick={handleSelectAll}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                {selectedAccounts.length === filteredCompanies.length ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
                Select All
              </button>
              <BulkActionsDropdown
                selectedItems={selectedAccounts}
                itemType="accounts"
                onBulkTransfer={handleBulkTransfer}
                onBulkUpdate={handleBulkUpdate}
                onBulkDelete={handleDeleteSelected}
                onBulkEmail={handleBulkEmail}
                onPrintView={handlePrintView}
                isVisible={true}
              />
              <button
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedAccounts([]);
                }}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelectionMode(true)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Select
              </button>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(company => {
          const companyContacts = getCompanyContacts(company.id);
          const companyLeads = getCompanyLeads(company.id);
          
          return (
            <div key={company.id} className="relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              {isSelectionMode && (
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleSelectAccount(company.id)}
                    className="p-1 bg-white rounded-md shadow-md border border-gray-300 hover:bg-gray-50"
                  >
                    {selectedAccounts.includes(company.id) ? 
                      <CheckSquare className="h-4 w-4 text-blue-600" /> : 
                      <Square className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                </div>
              )}
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.industry}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSizeColor(company.size)}`}>
                  {company.size}
                </span>
              </div>

              {/* Company Info */}
              <div className="space-y-2 mb-4">
                {company.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{company.phone}</span>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">
                      {company.address.city}, {company.address.state}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm font-medium text-gray-900">
                    {companyContacts.length} contacts
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-gray-900">
                    {companyLeads.length} leads
                  </span>
                </div>
              </div>

              {/* Revenue */}
              {company.revenue && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Revenue: </span>
                  <span className="text-sm font-medium text-green-600">
                    ${(company.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              )}

              {/* Description */}
              {company.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Added {new Date(company.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">Edit</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500">
            <p className="text-lg font-medium">No companies found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        </div>
      )}

      {/* Company Form Modal */}
      {showForm && (
        <CompanyForm
          onClose={() => setShowForm(false)}
          onSubmit={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CompaniesPage;