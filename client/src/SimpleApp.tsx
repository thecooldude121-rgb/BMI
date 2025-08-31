import React, { useState } from 'react';
import { Route, Router } from 'wouter';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, Mail, Phone, Building, Calendar, DollarSign, Star, User } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const apiRequest = async (url: string, options: any = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

const LeadManagementContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch leads
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: () => apiRequest('/api/leads')
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Leads</h3>
          <p className="text-red-600 mt-1">Failed to load leads data</p>
        </div>
      </div>
    );
  }

  // Filter leads
  const filteredLeads = leads.filter((lead: any) => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get stats
  const stats = {
    total: leads.length,
    new: leads.filter((l: any) => l.status === 'new').length,
    qualified: leads.filter((l: any) => l.status === 'qualified').length,
    converted: leads.filter((l: any) => l.status === 'converted').length,
    totalValue: leads.reduce((sum: number, l: any) => sum + (l.estimatedValue || 0), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Success Banner */}
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        border: '1px solid #bee5eb', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ color: '#0c5460', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          ✅ Lead Management Page is Working!
        </h1>
        <p style={{ color: '#0c5460', margin: '0' }}>
          Found {leads.length} leads in the system with full UI functionality
        </p>
      </div>

      {/* Stats Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Leads</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0' }}>{stats.total}</p>
            </div>
            <User style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>New Leads</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0' }}>{stats.new}</p>
            </div>
            <Plus style={{ width: '24px', height: '24px', color: '#10b981' }} />
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Qualified</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0' }}>{stats.qualified}</p>
            </div>
            <Star style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
          </div>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Value</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0' }}>
                ${stats.totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                Lead Management
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                Manage and track your sales leads
              </p>
            </div>
            <a 
              href="/crm/leads/new" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Create New Lead
            </a>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'grid' ? '#3b82f6' : 'white',
                  color: viewMode === 'grid' ? 'white' : '#374151',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'list' ? '#3b82f6' : 'white',
                  color: viewMode === 'list' ? 'white' : '#374151',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Display */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredLeads.map((lead: any) => (
            <div key={lead.id} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                    {lead.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building style={{ width: '14px', height: '14px' }} />
                    {lead.company}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px' }} className={getStatusColor(lead.status)}>
                    {lead.status}
                  </span>
                  <Star style={{ width: '14px', height: '14px' }} className={getPriorityColor(lead.priority)} />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                  <Mail style={{ width: '14px', height: '14px' }} />
                  {lead.email}
                </div>
                {lead.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                    <Phone style={{ width: '14px', height: '14px' }} />
                    {lead.phone}
                  </div>
                )}
                {lead.estimatedValue && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                    <DollarSign style={{ width: '14px', height: '14px' }} />
                    ${lead.estimatedValue.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    border: '1px solid #3b82f6',
                    borderRadius: '4px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Company</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Priority</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead: any) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#111827' }}>{lead.name}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{lead.company}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{lead.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px' }} className={getStatusColor(lead.status)}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Star style={{ width: '14px', height: '14px' }} className={getPriorityColor(lead.priority)} />
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                    ${lead.estimatedValue?.toLocaleString() || '0'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #3b82f6', borderRadius: '4px', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const LeadCreationContent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    source: 'website',
    status: 'new',
    priority: 'medium',
    estimatedValue: 0,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        title: formData.title,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        estimatedValue: formData.estimatedValue,
        notes: formData.notes
      };

      await apiRequest('/api/leads', { 
        method: 'POST', 
        body: submitData 
      });

      // Success - redirect to leads page
      window.location.href = '/crm/leads';
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Success Banner */}
      <div style={{ 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ color: '#155724', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          ✅ Lead Creation Page is Working!
        </h1>
        <p style={{ color: '#155724', margin: '0' }}>
          Complete the form below to create a new lead
        </p>
      </div>
      
      {/* Form */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Create New Lead</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Add a new lead to your CRM system</p>
          </div>
          <a 
            href="/crm/leads" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← Back to Lead List
          </a>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter last name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
              Company Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter job title"
                />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              Lead Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Lead Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social-media">Social Media</option>
                  <option value="cold-call">Cold Call</option>
                  <option value="email">Email Campaign</option>
                  <option value="trade-show">Trade Show</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', parseInt(e.target.value) || 0)}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Add any additional notes about this lead..."
            />
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <a
              href="/crm/leads"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: isSubmitting ? '#9ca3af' : '#10b981',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Creating...
                </>
              ) : (
                <>
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Create Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SimpleAppContent = () => {
  // Get current path for simple routing
  const currentPath = window.location.pathname;
  
  // Lead Management Page
  if (currentPath === '/crm/leads') {
    return <LeadManagementContent />;
  }
  
  // Lead Creation Page
  if (currentPath === '/crm/leads/new') {
    return <LeadCreationContent />;
  }
  
  // Test Page
  if (currentPath === '/test-leads') {
    return (
      <div style={{ 
        backgroundColor: '#dc3545', 
        color: 'white', 
        padding: '40px', 
        textAlign: 'center', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
          🚀 TEST LEADS PAGE IS VISIBLE!
        </h1>
        <p style={{ fontSize: '18px', margin: '0' }}>
          Path: /test-leads
        </p>
        <p style={{ fontSize: '16px', margin: '10px 0 0 0' }}>
          This should be clearly visible with red background
        </p>
      </div>
    );
  }
  
  // Default Home Page
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        border: '1px solid #bee5eb', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ color: '#0c5460', fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          ✅ Business Management Platform
        </h1>
        <p style={{ color: '#0c5460', margin: '0' }}>
          Navigate to your lead management pages
        </p>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2 style={{ marginBottom: '20px' }}>Available Pages</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a 
            href="/crm/leads" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Lead Management
          </a>
          <a 
            href="/crm/leads/new" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Create New Lead
          </a>
          <a 
            href="/test-leads" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Test Page
          </a>
        </div>
      </div>
    </div>
  );
};

const SimpleApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAppContent />
    </QueryClientProvider>
  );
};

export default SimpleApp;