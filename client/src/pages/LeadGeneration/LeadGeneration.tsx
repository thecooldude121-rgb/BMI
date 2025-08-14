import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Target, Users, Database, BarChart3, Settings, 
  Plus, TrendingUp, Zap, Activity, Globe, Shield 
} from 'lucide-react';
import AIProspectingEngine from '../../components/LeadGeneration/AIProspectingEngine';
import ProspectDiscovery from '../../components/LeadGeneration/ProspectDiscovery';

const LeadGeneration: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'prospecting' | 'enrichment' | 'sequences' | 'analytics' | 'compliance'>('prospecting');

  const modules = [
    {
      id: 'prospecting',
      name: 'AI Prospecting',
      icon: Brain,
      description: 'Advanced AI-powered lead discovery and scoring',
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'enrichment',
      name: 'Data Enrichment',
      icon: Database,
      description: 'Real-time contact and company data enrichment',
      color: 'from-green-600 to-teal-600'
    },
    {
      id: 'sequences',
      name: 'Engagement Sequences',
      icon: Zap,
      description: 'Automated multi-channel outreach campaigns',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'analytics',
      name: 'Analytics & Insights',
      icon: BarChart3,
      description: 'Performance tracking and optimization',
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'compliance',
      name: 'Compliance & GDPR',
      icon: Shield,
      description: 'Data privacy and regulatory compliance',
      color: 'from-gray-600 to-slate-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Lead Generation Platform</h1>
                <p className="text-gray-600 mt-1">Next-generation prospecting that surpasses Apollo.io, Hunter.io, and ZoomInfo</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-6 mr-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">94.5%</div>
                  <div className="text-xs text-gray-600">Email Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">87.3</div>
                  <div className="text-xs text-gray-600">Avg Lead Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">23.4%</div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8 py-4">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id as any)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeModule === module.id
                    ? 'bg-gradient-to-r ' + module.color + ' text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">{module.name}</div>
                  <div className={`text-xs ${activeModule === module.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {module.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {activeModule === 'prospecting' && (
            <motion.div
              key="prospecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProspectDiscovery />
            </motion.div>
          )}

          {activeModule === 'enrichment' && (
            <motion.div
              key="enrichment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DataEnrichmentModule />
            </motion.div>
          )}

          {activeModule === 'sequences' && (
            <motion.div
              key="sequences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EngagementSequencesModule />
            </motion.div>
          )}

          {activeModule === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsModule />
            </motion.div>
          )}

          {activeModule === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ComplianceModule />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Data Enrichment Module
const DataEnrichmentModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="h-6 w-6 text-green-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Real-Time Data Enrichment</h2>
            <p className="text-sm text-gray-600">Professional-grade data enrichment with 95%+ accuracy</p>
          </div>
        </div>

        {/* Enrichment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Email Verification</p>
                <p className="text-lg font-bold text-green-900">94.5%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Phone Numbers</p>
                <p className="text-lg font-bold text-blue-900">87.2%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Company Intel</p>
                <p className="text-lg font-bold text-purple-900">92.8%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Social Profiles</p>
                <p className="text-lg font-bold text-yellow-900">78.4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Premium Data Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'LinkedIn Sales Navigator', 'ZoomInfo Database', 'Clearbit API', 'Hunter.io',
              'Apollo.io', 'Salesforce Data.com', 'FullContact', 'PeopleDataLabs'
            ].map((source) => (
              <div key={source} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Engagement Sequences Module
const EngagementSequencesModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="h-6 w-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Automated Engagement Sequences</h2>
            <p className="text-sm text-gray-600">Multi-channel outreach with AI personalization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Cold Email Sequences</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">AI-personalized email campaigns with smart follow-ups</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Open Rate</span>
                <span className="font-semibold text-blue-600">34.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold text-green-600">12.8%</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">LinkedIn Outreach</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Professional networking with personalized messages</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Connection Rate</span>
                <span className="font-semibold text-blue-600">28.6%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Message Response</span>
                <span className="font-semibold text-green-600">18.4%</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Multi-Channel Mix</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Combined email, LinkedIn, and phone outreach</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Response</span>
                <span className="font-semibold text-blue-600">23.7%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Meeting Rate</span>
                <span className="font-semibold text-green-600">8.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Module
const AnalyticsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-6 w-6 text-orange-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Performance Analytics & Insights</h2>
            <p className="text-sm text-gray-600">Real-time tracking and optimization recommendations</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Prospects</p>
                <p className="text-2xl font-bold text-blue-900">47,328</p>
                <p className="text-xs text-blue-600">+12.3% this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Qualified Leads</p>
                <p className="text-2xl font-bold text-green-900">8,943</p>
                <p className="text-xs text-green-600">+18.7% this month</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-900">18.9%</p>
                <p className="text-xs text-purple-600">+2.1% this month</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">ROI</p>
                <p className="text-2xl font-bold text-yellow-900">342%</p>
                <p className="text-xs text-yellow-600">+45% this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Performance Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Campaign Performance Trends</h3>
            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Interactive charts would be displayed here</p>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Lead Source Attribution</h3>
            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Lead source visualization would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compliance Module
const ComplianceModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-6 w-6 text-gray-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Data Privacy & Compliance</h2>
            <p className="text-sm text-gray-600">GDPR, CCPA, and SOC2 compliant data handling</p>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">GDPR Compliance</p>
                <p className="text-lg font-bold text-green-900">100%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Data Retention</p>
                <p className="text-lg font-bold text-blue-900">Policy Active</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Consent Records</p>
                <p className="text-lg font-bold text-purple-900">Tracked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Features */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Data Processing Rights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Right to Access Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Right to Rectification</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Right to Erasure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Data Portability</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Automated Compliance</h3>
            <p className="text-sm text-gray-600 mb-3">AI-powered compliance monitoring ensures all data processing activities meet regulatory requirements.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Data Processing Activities Monitored</span>
                <span className="font-semibold text-green-600">47,328</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Compliance Violations Detected</span>
                <span className="font-semibold text-green-600">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Data Subject Requests Processed</span>
                <span className="font-semibold text-blue-600">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadGeneration;