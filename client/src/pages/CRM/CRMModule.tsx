import React from 'react';
import { Switch, Route } from 'wouter';
import CRMGamificationPage from './CRMGamificationPage';
import EnhancedLeadsPage from './EnhancedLeadsPage';
import ContactsPage from './ContactsPage';
import EnhancedAccountsPage from './EnhancedAccountsPage';
import UnifiedDealsPage from './UnifiedDealsPage';
import PipelinePage from './PipelinePage';
import SyncedActivitiesPage from './SyncedActivitiesPage';
import SimpleActivitiesPage from './SimpleActivitiesPage';
import WorkingActivitiesPage from './WorkingActivitiesPage';
import TestActivitiesPage from './TestActivitiesPage';
import TasksPage from './TasksPage';
import CRMTestPage from './CRMTestPage';
import SimpleTest from './SimpleTest';
import DiagnosticPage from './DiagnosticPage';
import MinimalTest from './MinimalTest';
import SimpleLeadsPage from './SimpleLeadsPage';
import SimpleContactsPage from './SimpleContactsPage';
import SimpleAccountsPage from './SimpleAccountsPage';
import SimpleDealsPage from './SimpleDealsPage';

const CRMModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <Switch>
        <Route path="/crm/gamification">
          <CRMGamificationPage key="crm-gamification" />
        </Route>
        <Route path="/crm/leads">
          <SimpleLeadsPage />
        </Route>
        <Route path="/crm/contacts">
          <SimpleContactsPage />
        </Route>
        <Route path="/crm/accounts">
          <SimpleAccountsPage />
        </Route>
        <Route path="/crm/deals">
          <SimpleDealsPage />
        </Route>
        <Route path="/crm/pipeline" component={PipelinePage} />
        <Route path="/crm/tasks" component={TasksPage} />
        <Route path="/crm/activities">
          <WorkingActivitiesPage />
        </Route>
        <Route path="/crm/test">
          <CRMTestPage />
        </Route>
        <Route path="/crm/simple">
          <SimpleTest />
        </Route>
        <Route path="/crm">
          <DiagnosticPage />
        </Route>
      </Switch>
    </div>
  );
};

export default CRMModule;