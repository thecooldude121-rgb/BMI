import React, { useState, useEffect } from 'react';
import { Building, Phone, Mail, MapPin, Users, DollarSign, Plus, Filter, Search } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string | { street?: string; city?: string; state?: string; zip?: string; country?: string };
  employees?: number;
  revenue?: number;
  type?: string;
  description?: string;
  createdAt: string;
}

const SimpleAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        console.log('🚀 Fetching accounts...');
        const response = await fetch('/api/accounts');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Accounts loaded:', data.length);
        setAccounts(data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Accounts</h1>
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Accounts</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatEmployees = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">{accounts.length} accounts found</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Account
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{account.name}</h3>
                  <p className="text-sm text-gray-600">{account.industry || 'Industry not specified'}</p>
                </div>
              </div>
              {account.type && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {account.type}
                </span>
              )}
            </div>

            {account.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{account.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              {account.employees && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{formatEmployees(account.employees)} employees</span>
                </div>
              )}

              {account.revenue && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{formatCurrency(account.revenue)} revenue</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {account.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{account.email}</span>
                </div>
              )}
              
              {account.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{account.phone}</span>
                </div>
              )}

              {account.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">
                    {typeof account.address === 'string' 
                      ? account.address 
                      : typeof account.address === 'object' && account.address
                        ? `${account.address.street || ''} ${account.address.city || ''} ${account.address.state || ''} ${account.address.zip || ''}`.trim()
                        : 'Address not available'
                    }
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                View Details
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
          <p className="text-gray-600 mb-4">Start by creating your first account.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleAccountsPage;