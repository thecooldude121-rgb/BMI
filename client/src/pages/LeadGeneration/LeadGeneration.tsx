import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Users, Building2, ChevronRight, ChevronDown, MessageSquare, Mail
} from 'lucide-react';
import ProspectDiscovery from '../../components/LeadGeneration/ProspectDiscovery';
import PeopleDiscovery from '../../components/LeadGeneration/PeopleDiscovery';
import CompanyDiscovery from '../../components/LeadGeneration/CompanyDiscovery';
import SequencesModule from '../Sequences/SequencesModule';
import LeadGenLogo from '../../components/ui/LeadGenLogo';
import FeedbackModal from '../../components/ui/FeedbackModal';
import { ABTestProvider, useABTestVariant } from '../../components/ui/ABTestProvider';

const LeadGenerationContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'people' | 'companies' | 'sequences'>('people');
  const [enrichDataExpanded, setEnrichDataExpanded] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const { variant: themeVariant, config: themeConfig } = useABTestVariant('theme-test');
  const { trackConversion } = useABTestVariant('sync-button-test');

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex page-transition">
      {/* Left Navigation Pane */}
      <div className="w-44 bg-white/90 backdrop-blur-sm border-r border-gray-200 flex-shrink-0 card-modern">
        

        <div className="p-2">
          {/* Enrich & data section */}
          <div className="mb-3 animate-slide-in-left">
            <button
              onClick={() => setEnrichDataExpanded(!enrichDataExpanded)}
              className="flex items-center justify-between w-full text-left p-1.5 text-xs font-medium text-gray-700 hover:bg-blue-50 rounded-lg btn-secondary transition-all duration-200"
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
                  className={`flex items-center space-x-2 w-full text-left p-1.5 text-xs rounded-lg transition-all duration-200 hover-lift ${
                    activeSection === 'people'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  <Users className="w-3 h-3 icon-hover flex-shrink-0" />
                  <span className="truncate">People</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('companies')}
                  className={`flex items-center space-x-2 w-full text-left p-1.5 text-xs rounded-lg transition-all duration-200 hover-lift ${
                    activeSection === 'companies'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <Building2 className="w-3 h-3 icon-hover flex-shrink-0" />
                  <span className="truncate">Companies</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('sequences')}
                  className={`flex items-center space-x-2 w-full text-left p-1.5 text-xs rounded-lg transition-all duration-200 hover-lift ${
                    activeSection === 'sequences'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-emerald-50'
                  }`}
                >
                  <Mail className="w-3 h-3 icon-hover flex-shrink-0" />
                  <span className="truncate">Sequences</span>
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-2 pt-3 border-t border-gray-200 animate-slide-in-right">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Performance</div>
            <div className="space-y-1.5 stagger-children">
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
            
            {/* Feedback Button */}
            <div className="pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowFeedback(true);
                  trackConversion('feedback_opened', { source: 'sidebar' });
                }}
                className="flex items-center space-x-2 w-full text-left p-1.5 text-xs rounded-lg text-gray-600 hover:bg-blue-50 transition-all duration-200 hover-lift"
                title="Share Feedback"
              >
                <MessageSquare className="w-3 h-3 icon-hover flex-shrink-0" />
                <span className="truncate">Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full overflow-hidden animate-slide-in-up">
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

          {activeSection === 'sequences' && (
            <motion.div
              key="sequences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SequencesModule />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        feature="lead-generation"
      />
    </div>
  );
};

const LeadGeneration: React.FC = () => {
  return (
    <ABTestProvider userId="demo-user">
      <LeadGenerationContent />
    </ABTestProvider>
  );
};

export default LeadGeneration;