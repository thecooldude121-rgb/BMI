import React from 'react';
import { Switch, Route } from 'wouter';
import NextGenLeadsModule from './NextGenLeadsModule';
import LeadDetailPage from './LeadDetailPage';
import EnterpriseContactsModule from './EnterpriseContactsModule';
import NextGenAccountModule from './NextGenAccountModule';
import TestAccountDetailPage from './TestAccountDetailPage';
import SimpleTestPage from './SimpleTestPage';
import WorkingAccountDetail from './WorkingAccountDetail';
import AccountHealthDashboard from './AccountHealthDashboard';
import SimpleAdvancedDealsModule from './SimpleAdvancedDealsModule';
import NextGenActivitiesModule from './NextGenActivitiesModule';
import WorkingActivitiesPage from './WorkingActivitiesPage';
import DiagnosticPage from './DiagnosticPage';

const CRMModule = () => {
  console.log('CRMModule rendering');
  
  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div style={{ padding: '10px', backgroundColor: 'yellow', marginBottom: '10px' }}>
        DEBUG: CRM Module is loading
      </div>
      <Switch>
        <Route path="/crm/leads/:id" component={LeadDetailPage} />
        <Route path="/crm/leads" component={NextGenLeadsModule} />
        <Route path="/crm/contacts/:id" component={() => <div>Contact Detail Page Coming Soon</div>} />
        <Route path="/crm/contacts">
          <EnterpriseContactsModule />
        </Route>
        <Route path="/crm/accounts/health" component={AccountHealthDashboard} />
        <Route path="/crm/accounts/test" component={SimpleTestPage} />
        <Route path="/crm/accounts/:id" component={WorkingAccountDetail} />
        <Route path="/crm/accounts">
          <NextGenAccountModule />
        </Route>
        <Route path="/crm/deals">
          <SimpleAdvancedDealsModule />
        </Route>
        <Route path="/crm/activities">
          <NextGenActivitiesModule />
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