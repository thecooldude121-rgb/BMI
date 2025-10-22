import React, { useState, useEffect } from 'react';
import {
  Settings, Shield, Users, Lock, Activity, Key, Globe,
  Database, Bell, FileText, Workflow, UserCheck, Zap,
  Search, ChevronRight, AlertTriangle, CheckCircle, Info
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  path: string;
  badge?: string;
}

const SettingsPage: React.FC = () => {
  const { loading, error, getSecurityMetrics } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [securityMetrics, setSecurityMetrics] = useState<any>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const metrics = await getSecurityMetrics();
    setSecurityMetrics(metrics);
  };

  const sections: SettingsSection[] = [
    {
      id: 'roles',
      title: 'Roles & Permissions',
      description: 'Manage user roles, permissions, and field-level security',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/settings/roles',
      badge: 'Core'
    },
    {
      id: 'profiles',
      title: 'Profiles & Access',
      description: 'Configure user profiles and module-level access controls',
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      path: '/settings/profiles'
    },
    {
      id: 'sharing',
      title: 'Sharing Rules',
      description: 'Set up record sharing with conditional logic',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
      path: '/settings/sharing'
    },
    {
      id: 'security',
      title: 'Security Policies',
      description: 'Password policies, IP restrictions, and 2FA settings',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      path: '/settings/security',
      badge: 'Critical'
    },
    {
      id: 'sso',
      title: 'SSO & Authentication',
      description: 'Configure SAML, OAuth2, and LDAP integrations',
      icon: Key,
      color: 'from-yellow-500 to-yellow-600',
      path: '/settings/sso'
    },
    {
      id: 'api',
      title: 'API & Tokens',
      description: 'Manage API access tokens and rate limits',
      icon: Database,
      color: 'from-cyan-500 to-cyan-600',
      path: '/settings/api'
    },
    {
      id: 'audit',
      title: 'Audit Logs',
      description: 'View system changes and activity tracking',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      path: '/settings/audit'
    },
    {
      id: 'workflows',
      title: 'Workflow Automation',
      description: 'Create automated workflows and approval processes',
      icon: Workflow,
      color: 'from-pink-500 to-pink-600',
      path: '/settings/workflows'
    },
    {
      id: 'groups',
      title: 'User Groups',
      description: 'Organize users into hierarchical groups',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      path: '/settings/groups'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure system notifications and alerts',
      icon: Bell,
      color: 'from-indigo-500 to-indigo-600',
      path: '/settings/notifications'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect third-party apps and webhooks',
      icon: Zap,
      color: 'from-violet-500 to-violet-600',
      path: '/settings/integrations'
    },
    {
      id: 'compliance',
      title: 'Compliance & Data',
      description: 'Data encryption, backup, and GDPR settings',
      icon: FileText,
      color: 'from-gray-500 to-gray-600',
      path: '/settings/compliance'
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAlert = (type: 'warning' | 'info' | 'success', message: string) => {
    const icons = {
      warning: AlertTriangle,
      info: Info,
      success: CheckCircle
    };
    const colors = {
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800'
    };

    const Icon = icons[type];

    return (
      <div className={`rounded-xl border p-4 ${colors[type]}`}>
        <div className="flex items-start space-x-3">
          <Icon className="h-5 w-5 mt-0.5" />
          <p className="text-sm">{message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings & Administration</h1>
                <p className="text-gray-600 text-lg mt-1">
                  Configure security, permissions, and system preferences
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Alerts */}
        {securityMetrics && (
          <div className="mb-6 space-y-3">
            {securityMetrics.failed_login_attempts_24h > 10 && renderAlert(
              'warning',
              `${securityMetrics.failed_login_attempts_24h} failed login attempts in the last 24 hours`
            )}

            {securityMetrics.suspicious_activities_count > 0 && renderAlert(
              'warning',
              `${securityMetrics.suspicious_activities_count} suspicious activities detected - Review now`
            )}
          </div>
        )}

        {/* Quick Stats */}
        {securityMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{securityMetrics.total_users}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{securityMetrics.active_sessions}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{securityMetrics.api_calls_today}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Logins (24h)</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{securityMetrics.failed_login_attempts_24h}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => window.location.href = section.path}
                className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg transition-all duration-200 hover:border-gray-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {section.badge && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {section.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {section.description}
                </p>

                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Configure</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* No Results */}
        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-all">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Add New User</p>
                <p className="text-xs text-gray-600">Create user account</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-all">
              <Shield className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Create Role</p>
                <p className="text-xs text-gray-600">Define permissions</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-all">
              <Activity className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">View Audit Trail</p>
                <p className="text-xs text-gray-600">System activity</p>
              </div>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Database Connection</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Healthy</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Authentication Service</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Operational</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">API Services</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Running</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Background Jobs</span>
              </div>
              <span className="text-sm text-yellow-600 font-medium">2 Queued</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
