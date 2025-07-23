import React from 'react';
import { Switch, Route } from 'wouter';
import CRMGamificationPage from './CRMGamificationPage';
import EnhancedLeadsPage from './EnhancedLeadsPage';
import ContactsPage from './ContactsPage';
import EnhancedAccountsPage from './EnhancedAccountsPage';
import UnifiedDealsPage from './UnifiedDealsPage';
import PipelinePage from './PipelinePage';
import EnhancedActivitiesPage from './EnhancedActivitiesPage';
import TasksPage from './TasksPage';

const CRMModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <Switch>
        <Route path="/crm/gamification">
          <CRMGamificationPage key="crm-gamification" />
        </Route>
        <Route path="/crm/leads">
          <EnhancedLeadsPage key="enhanced-leads" />
        </Route>
        <Route path="/crm/contacts" component={ContactsPage} />
        <Route path="/crm/accounts">
          <EnhancedAccountsPage key="enhanced-accounts" />
        </Route>
        <Route path="/crm/deals" component={UnifiedDealsPage} />
        <Route path="/crm/pipeline" component={PipelinePage} />
        <Route path="/crm/tasks" component={TasksPage} />
        <Route path="/crm/activities" component={EnhancedActivitiesPage} />
        <Route path="/crm">
          <CRMGamificationPage key="crm-gamification" />
        </Route>
      </Switch>
    </div>
  );
};

export default CRMModule;