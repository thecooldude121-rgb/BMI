import React, { useState } from 'react';
import { Target, Brain, Users, TrendingUp, Lightbulb, Search, Filter, Download } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { aiEngine, AIRecommendation } from '../../utils/aiEngine';

const LeadGeneration: React.FC = () => {
  const { leads, deals } = useData();
  const [activeTab, setActiveTab] = useState<'recommendations' | 'personas' | 'prospecting'>('recommendations');
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const recommendations = aiEngine.generateRecommendations(leads, deals, []);
  
  const personas = [
    {
      id: 'enterprise-tech',
      name: 'Enterprise Technology Leaders',
      description: 'CTOs and VPs at large tech companies',
      avgDealSize: '$150K',
      conversionRate: '35%',
      industries: ['Technology', 'Software', 'SaaS'],
      keyMetrics: { totalLeads: 45, qualified: 16, won: 8 }
    },
    {
      id: 'healthcare-ops',
      name: 'Healthcare Operations',
      description: 'Directors managing healthcare operations',
      avgDealSize: '$75K',
      conversionRate: '28%',
      industries: ['Healthcare', 'Medical Devices', 'Hospitals'],
      keyMetrics: { totalLeads: 32, qualified: 12, won: 5 }
    },
    {
      id: 'finance-exec',
      name: 'Finance Executives',
      description: 'CFOs and Finance Directors',
      avgDealSize: '$100K',
      conversionRate: '32%',
      industries: ['Finance', 'Banking', 'Insurance'],
      keyMetrics: { totalLeads: 38, qualified: 14, won: 7 }
    }
  ];

  const prospectingSuggestions = [
    {
      id: 1,
      title: 'Healthcare Technology Leaders',
      description: 'Target CTOs at healthcare technology companies with 500+ employees',
      potentialLeads: 127,
      confidence: 92,
      criteria: ['Healthcare industry', 'Technology companies', '500+ employees', 'CTO/VP Technology titles']
    },
    {
      id: 2,
      title: 'Finance SaaS Decision Makers',
      description: 'CFOs at growing SaaS companies looking for financial optimization',
      potentialLeads: 89,
      confidence: 87,
      criteria: ['SaaS companies', 'Series B+ funding', 'CFO/Finance Director', 'Recent growth indicators']
    },
    {
      id: 3,
      title: 'Manufacturing Operations Directors',
      description: 'Operations leaders in manufacturing seeking digital transformation',
      potentialLeads: 156,
      confidence: 83,
      criteria: ['Manufacturing industry', 'Operations roles', '$50M+ revenue', 'Digital transformation initiatives']
    }
  ];

  const tabs = [
    { id: 'recommendations', name: 'AI Recommendations', icon: Brain },
    { id: 'personas', name: 'Lead Personas', icon: Users },
    { id: 'prospecting', name: 'Prospecting', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Generation & AI Intelligence</h1>
          <p className="text-gray-600">AI-powered insights to optimize your sales pipeline</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export Insights
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Find New Leads
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">AI Score Avg</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(leads.reduce((sum, lead) => sum + aiEngine.scoreLeadFit(lead), 0) / leads.length)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">High-Fit Leads</p>
              <p className="text-2xl font-bold text-gray-900">
                {leads.filter(lead => aiEngine.scoreLeadFit(lead) > 80).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Personas</p>
              <p className="text-2xl font-bold text-gray-900">{personas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">AI Insights</p>
              <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
          {recommendations.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recommendations available. Add more leads to get AI insights.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-gray-600 mt-1">{rec.description}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Confidence</p>
                        <p className="text-lg font-bold text-blue-600">
                          {Math.round(rec.confidence * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Recommended Actions:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {rec.actionItems.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Learn More
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Take Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'personas' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Lead Personas Performance</h3>
          <div className="grid gap-6">
            {personas.map((persona) => (
              <div key={persona.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{persona.name}</h4>
                    <p className="text-gray-600 mt-1">{persona.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {persona.industries.map((industry, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-bold text-green-600">{persona.conversionRate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{persona.keyMetrics.totalLeads}</p>
                    <p className="text-sm text-gray-600">Total Leads</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{persona.keyMetrics.qualified}</p>
                    <p className="text-sm text-gray-600">Qualified</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{persona.keyMetrics.won}</p>
                    <p className="text-sm text-gray-600">Won</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{persona.avgDealSize}</p>
                    <p className="text-sm text-gray-600">Avg Deal</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setSelectedPersona(persona.id)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    Find Similar Leads
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prospecting' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">AI Prospecting Suggestions</h3>
          <div className="grid gap-6">
            {prospectingSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-gray-600 mt-1">{suggestion.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Potential Leads</p>
                    <p className="text-2xl font-bold text-blue-600">{suggestion.potentialLeads}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                    <span className="text-sm text-gray-600">{suggestion.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${suggestion.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Target Criteria:</h5>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.criteria.map((criterion, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {criterion}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    Refine Criteria
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Start Prospecting
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadGeneration;