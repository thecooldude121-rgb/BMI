import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Users, Building2, ChevronRight, ChevronDown
} from 'lucide-react';
import ProspectDiscovery from '../../components/LeadGeneration/ProspectDiscovery';
import PeopleDiscovery from '../../components/LeadGeneration/PeopleDiscovery';
import CompanyDiscovery from '../../components/LeadGeneration/CompanyDiscovery';

const LeadGeneration: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'people' | 'companies'>('people');
  const [enrichDataExpanded, setEnrichDataExpanded] = useState(true);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Navigation Pane */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Lead Generation</h1>
              <p className="text-xs text-gray-600">AI-powered prospecting</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Enrich & data section */}
          <div className="mb-4">
            <button
              onClick={() => setEnrichDataExpanded(!enrichDataExpanded)}
              className="flex items-center justify-between w-full text-left p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg btn-hover"
            >
              <span>Enrich & data</span>
              {enrichDataExpanded ? (
                <ChevronDown className="w-4 h-4 icon-hover" />
              ) : (
                <ChevronRight className="w-4 h-4 icon-hover" />
              )}
            </button>
            
            {enrichDataExpanded && (
              <div className="ml-4 mt-2 space-y-1">
                <button
                  onClick={() => setActiveSection('people')}
                  className={`flex items-center space-x-3 w-full text-left p-2 text-sm rounded-lg btn-hover ${
                    activeSection === 'people'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4 icon-hover" />
                  <span>People</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('companies')}
                  className={`flex items-center space-x-3 w-full text-left p-2 text-sm rounded-lg btn-hover ${
                    activeSection === 'companies'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 icon-hover" />
                  <span>Companies</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Email Accuracy</span>
                <span className="font-medium text-green-600">94.5%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Avg Lead Score</span>
                <span className="font-medium text-blue-600">87.3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-medium text-purple-600">23.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeSection === 'people' && (
            <motion.div
              key="people"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <PeopleDiscovery />
            </motion.div>
          )}

          {activeSection === 'companies' && (
            <motion.div
              key="companies"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CompanyDiscovery />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeadGeneration;