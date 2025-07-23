import React from 'react';
import { Switch, Route } from 'wouter';
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
        <Route path="/crm/leads" render={() => <EnhancedLeadsPage key="leads" />} />
        <Route path="/crm/contacts" component={ContactsPage} />
        <Route path="/crm/accounts" render={() => <EnhancedAccountsPage key="accounts" />} />
        <Route path="/crm/deals" component={UnifiedDealsPage} />
        <Route path="/crm/pipeline" component={PipelinePage} />
        <Route path="/crm/tasks" component={TasksPage} />
        <Route path="/crm/activities" component={EnhancedActivitiesPage} />
        <Route path="/crm" render={() => <EnhancedLeadsPage key="leads" />} />
      </Switch>
    </div>
  );
};

export default CRMModule;