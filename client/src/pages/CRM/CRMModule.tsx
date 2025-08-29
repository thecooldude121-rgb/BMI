import React from 'react';
import { Switch, Route } from 'wouter';
import NextGenLeadsModule from './NextGenLeadsModule';
import LeadDetailPage from './LeadDetailPage';
import NewLeadManagementPage from './NewLeadManagementPage';
import NewLeadForm from '../../components/CRM/NewLeadForm';
import EnterpriseContactsModule from './EnterpriseContactsModule';
import NextGenAccountModule from './NextGenAccountModule';
import NextGenAccountsModule from './NextGenAccountsModule';
import UltimateAccountsModule from './UltimateAccountsModule';
import NextGenContactsModule from './NextGenContactsModule';
import BasicAccountsPage from './BasicAccountsPage';
import TestAccountDetailPage from './TestAccountDetailPage';
import SimpleTestPage from './SimpleTestPage';
import WorkingAccountDetail from './WorkingAccountDetail';

import AccountHealthDashboard from './AccountHealthDashboard';
import SimpleAdvancedDealsModule from './SimpleAdvancedDealsModule';
import DealDetailView from './DealDetailView';
import EnhancedDealDetailPageWorking from './EnhancedDealDetailPageWorking';
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
        <Route path="/crm/leads/new" component={() => {
          console.log('Lead creation page rendering');
          // Show only the lead creation form on a dedicated page
          return (
            <div className="min-h-screen bg-gray-50" style={{ backgroundColor: 'green', border: '3px solid orange' }}>
              <div className="max-w-4xl mx-auto py-8">
                <h1 style={{ color: 'white', fontSize: '24px', padding: '20px' }}>LEAD CREATION PAGE</h1>
                <NewLeadForm 
                  isOpen={true}
                  onClose={() => window.history.back()} 
                  onSuccess={() => window.history.back()}
                  mode="create"
                />
              </div>
            </div>
          );
        }} />
        <Route path="/crm/leads/:id" component={({ params }: { params: { id: string } }) => (
          <LeadDetailPage params={params} />
        )} />
        <Route path="/crm/leads" component={NewLeadManagementPage} />
        <Route path="/crm/contacts/:id" component={() => <div>Contact Detail Page Coming Soon</div>} />
        <Route path="/crm/contacts">
          <NextGenContactsModule />
        </Route>
        <Route path="/crm/accounts/health" component={AccountHealthDashboard} />
        <Route path="/crm/accounts/test" component={SimpleTestPage} />
        <Route path="/crm/accounts">
          <UltimateAccountsModule />
        </Route>
        <Route path="/crm/deals/enhanced/:id" component={EnhancedDealDetailPageWorking} />
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
        <Route path="/crm/gamification" component={() => (
          <div className="min-h-screen w-full">
            <GamificationModule />
          </div>
        )} />
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
        <Route path="/crm" component={() => (
          <div className="min-h-screen w-full">
            <GamificationModule />
          </div>
        )} />
      </Switch>
    </div>
  );
};

export default CRMModule;