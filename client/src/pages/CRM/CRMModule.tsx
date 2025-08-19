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
import DealDetailView from './DealDetailView';
import NextGenActivitiesModule from './NextGenActivitiesModule';
import WorkingActivitiesPage from './WorkingActivitiesPage';
import DiagnosticPage from './DiagnosticPage';
import CRMAnalyticsDashboard from './CRMAnalyticsDashboard';
import GamificationModule from './GamificationModuleNextGen';

const CRMModule = () => {
  console.log('CRMModule rendering');
  
  return (
    <div className="min-h-screen w-full overflow-auto">


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
        <Route path="/crm/deals/:id" component={DealDetailView} />
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
          <div className="min-h-screen w-full bg-gray-50 p-8">
            <div className="text-gray-900 text-2xl mb-4">CRM Gamification Dashboard</div>
            <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome back, Champion!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg p-4">
                  <div className="text-white font-semibold">Level 12</div>
                  <div className="text-white/80">Elite Closer</div>
                  <div className="text-white text-2xl font-bold">2,847 XP</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4">
                  <div className="text-white font-semibold">Streak</div>
                  <div className="text-white text-2xl font-bold">23 Days</div>
                  <div className="text-white/80">Keep it up!</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4">
                  <div className="text-white font-semibold">Badges</div>
                  <div className="text-white text-2xl font-bold">18</div>
                  <div className="text-white/80">Collected</div>
                </div>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default CRMModule;