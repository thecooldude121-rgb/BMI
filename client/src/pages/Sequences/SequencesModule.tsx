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
    <Switch>
      <Route path="/sequences/create" component={CreateSequencePage} />
      <Route path="/sequences/:id" component={SequenceDetailPage} />
      <Route path="/sequences" component={SequenceDashboard} />
      <Route component={SequenceDashboard} />
    </Switch>
  );
};

export default SequencesModule;