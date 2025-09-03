import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import SequenceDashboard from './SequenceDashboard';
import SequenceDetailPage from './SequenceDetailPage';
import CreateSequencePage from './CreateSequencePage';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { navigateTo } from '../../utils/navigation';

/**
 * Main Sequences Module - Apollo.io style sequence management system
 * Handles routing and layout for all sequence-related pages
 */
const SequencesModule: React.FC = () => {
  const [location] = useLocation();
  const [pageTitle, setPageTitle] = useState('Sequences');

  // Update page title based on current route
  useEffect(() => {
    if (location?.includes('/sequences/create')) {
      setPageTitle('Create Sequence');
    } else if (location?.includes('/sequences/') && location.split('/').length > 2) {
      setPageTitle('Sequence Details');
    } else {
      setPageTitle('Sequences');
    }
  }, [location]);

  const showBackButton = location !== '/sequences' && !location?.endsWith('/sequences');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => navigateTo('/sequences')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="button-back-sequences"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </motion.button>
              )}
              <div>
                <motion.h1 
                  key={pageTitle}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {pageTitle}
                </motion.h1>
                <p className="text-sm text-gray-600 mt-1">
                  {location?.includes('/create') ? 'Design your email and call sequence' : 
                   location?.includes('/sequences/') && location.split('/').length > 2 ? 'Manage sequence steps and analytics' :
                   'Manage your email and call sequences'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Switch>
          <Route path="/sequences/create" component={CreateSequencePage} />
          <Route path="/sequences/:id" component={SequenceDetailPage} />
          <Route path="/sequences" component={SequenceDashboard} />
          <Route component={SequenceDashboard} />
        </Switch>
      </div>
    </div>
  );
};

export default SequencesModule;