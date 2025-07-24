import React from 'react';
import { Switch, Route } from 'wouter';
import SimpleLeadsPage from './SimpleLeadsPage';
import SimpleContactsPage from './SimpleContactsPage';
import SimpleAccountsPage from './SimpleAccountsPage';
import SimpleDealsPage from './SimpleDealsPage';
import WorkingActivitiesPage from './WorkingActivitiesPage';
import DiagnosticPage from './DiagnosticPage';

const CRMModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <Switch>
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
        <Route path="/crm/activities">
          <WorkingActivitiesPage />
        </Route>
        <Route path="/crm">
          <DiagnosticPage />
        </Route>
      </Switch>
    </div>
  );
};

export default CRMModule;