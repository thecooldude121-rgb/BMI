import React from 'react';
import { Switch, Route } from 'wouter';
import NextGenLeadsModule from './NextGenLeadsModule';
import SimpleContactsPage from './SimpleContactsPage';
import SimpleAccountsPage from './SimpleAccountsPage';
import SimpleAdvancedDealsModule from './SimpleAdvancedDealsModule';
import WorkingActivitiesPage from './WorkingActivitiesPage';
import DiagnosticPage from './DiagnosticPage';

const CRMModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <Switch>
        <Route path="/crm/leads">
          <NextGenLeadsModule />
        </Route>
        <Route path="/crm/contacts">
          <SimpleContactsPage />
        </Route>
        <Route path="/crm/accounts">
          <SimpleAccountsPage />
        </Route>
        <Route path="/crm/deals">
          <SimpleAdvancedDealsModule />
        </Route>
        <Route path="/crm/activities">
          <WorkingActivitiesPage />
        </Route>
        <Route path="/crm/gamification">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gamification</h1>
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-600">Gamification dashboard coming soon...</p>
            </div>
          </div>
        </Route>
        <Route path="/crm/tasks">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tasks</h1>
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-600">Task management coming soon...</p>
            </div>
          </div>
        </Route>
        <Route path="/crm/pipeline">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sales Pipeline</h1>
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-600">Pipeline view coming soon...</p>
            </div>
          </div>
        </Route>
        <Route path="/crm">
          <DiagnosticPage />
        </Route>
      </Switch>
    </div>
  );
};

export default CRMModule;