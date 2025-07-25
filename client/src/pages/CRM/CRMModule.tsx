import React from 'react';
import { Switch, Route } from 'wouter';
import NextGenLeadsModule from './NextGenLeadsModule';
import LeadDetailPage from './LeadDetailPage';
import EnterpriseContactsModule from './EnterpriseContactsModule';
import NextGenAccountModule from './NextGenAccountModule';
import NextGenAccountsModule from './NextGenAccountsModule';
import NextGenContactsModule from './NextGenContactsModule';
import BasicAccountsPage from './BasicAccountsPage';
import TestAccountDetailPage from './TestAccountDetailPage';
import SimpleTestPage from './SimpleTestPage';
import WorkingAccountDetail from './WorkingAccountDetail';

import AccountHealthDashboard from './AccountHealthDashboard';
import SimpleAdvancedDealsModule from './SimpleAdvancedDealsModule';
import NextGenActivitiesModule from './NextGenActivitiesModule';
import WorkingActivitiesPage from './WorkingActivitiesPage';
import DiagnosticPage from './DiagnosticPage';
import CRMAnalyticsDashboard from './CRMAnalyticsDashboard';
import { GamificationModule } from './GamificationModuleNextGen';

const CRMModule = () => {
  console.log('CRMModule rendering');
  
  return (
    <div className="h-full overflow-auto bg-gray-50">


      <Switch>
        <Route path="/crm/leads/:id" component={LeadDetailPage} />
        <Route path="/crm/leads" component={NextGenLeadsModule} />
        <Route path="/crm/contacts/:id" component={() => <div>Contact Detail Page Coming Soon</div>} />
        <Route path="/crm/contacts">
          <NextGenContactsModule />
        </Route>
        <Route path="/crm/accounts/health" component={AccountHealthDashboard} />
        <Route path="/crm/accounts/test" component={SimpleTestPage} />
        <Route path="/crm/accounts">
          <NextGenAccountsModule />
        </Route>
        <Route path="/crm/deals">
          <SimpleAdvancedDealsModule />
        </Route>
        <Route path="/crm/activities">
          <NextGenActivitiesModule />
        </Route>
        <Route path="/crm/analytics">
          <CRMAnalyticsDashboard />
        </Route>
        <Route path="/crm/gamification">
          <GamificationModule />
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
          <GamificationModule />
        </Route>
      </Switch>
    </div>
  );
};

export default CRMModule;