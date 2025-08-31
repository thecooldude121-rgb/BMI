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
    <div style={{ marginLeft: '256px', paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Generation</h1>
              <p className="text-gray-600 mt-1">AI-powered prospecting and discovery</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-6">
          {/* Control Panel */}
          <div className="w-80 bg-white rounded-xl border shadow-sm p-6 h-fit">
            {/* Section Toggle */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Discovery Mode</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveSection('people')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeSection === 'people'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>People</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('companies')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeSection === 'companies'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Companies</span>
                </button>
              </div>
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
      </div>
    </div>
  );
};

export default LeadGeneration;