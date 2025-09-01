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
      <div className="w-32 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-2 border-b border-gray-200">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-gray-900 truncate">Lead Gen</h1>
              <p className="text-xs text-gray-600 truncate">AI-powered</p>
            </div>
          </div>
        </div>

        <div className="p-2">
          {/* Enrich & data section */}
          <div className="mb-3">
            <button
              onClick={() => setEnrichDataExpanded(!enrichDataExpanded)}
              className="flex items-center justify-between w-full text-left p-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded btn-hover"
            >
              <span className="truncate">Enrich & data</span>
              {enrichDataExpanded ? (
                <ChevronDown className="w-3 h-3 icon-hover flex-shrink-0" />
              ) : (
                <ChevronRight className="w-3 h-3 icon-hover flex-shrink-0" />
              )}
            </button>
            
            {enrichDataExpanded && (
              <div className="ml-2 mt-1 space-y-1">
                <button
                  onClick={() => setActiveSection('people')}
                  className={`flex items-center space-x-2 w-full text-left p-1.5 text-xs rounded btn-hover ${
                    activeSection === 'people'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-3 h-3 icon-hover flex-shrink-0" />
                  <span className="truncate">People</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('companies')}
                  className={`flex items-center space-x-2 w-full text-left p-1.5 text-xs rounded btn-hover ${
                    activeSection === 'companies'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-3 h-3 icon-hover flex-shrink-0" />
                  <span className="truncate">Companies</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Performance</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 truncate">Email</span>
                <span className="font-medium text-green-600 flex-shrink-0">94.5%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 truncate">Score</span>
                <span className="font-medium text-blue-600 flex-shrink-0">87.3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 truncate">Response</span>
                <span className="font-medium text-purple-600 flex-shrink-0">23.4%</span>
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