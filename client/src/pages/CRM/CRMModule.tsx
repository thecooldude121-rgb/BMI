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

const CRMModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <Switch>
        <Route path="/crm/gamification">
          <CRMGamificationPage key="crm-gamification" />
        </Route>
        <Route path="/crm/leads">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Leads</h1>
            <p>Leads module loading...</p>
          </div>
        </Route>
        <Route path="/crm/contacts">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Contacts</h1>
            <p>Contacts module loading...</p>
          </div>
        </Route>
        <Route path="/crm/accounts">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Accounts</h1>
            <p>Accounts module loading...</p>
          </div>
        </Route>
        <Route path="/crm/deals">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Deals</h1>
            <p>Deals module loading...</p>
          </div>
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