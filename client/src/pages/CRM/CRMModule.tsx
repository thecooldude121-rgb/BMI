import React from 'react';
import { Switch, Route } from 'wouter';
import NextGenLeadsModule from './NextGenLeadsModule';
import LeadDetailPage from './LeadDetailPage';
import NewLeadManagementPage from './NewLeadManagementPage';
import TestLeadsPage from './TestLeadsPage';
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
  
  return (
    <div className="min-h-screen w-full bg-white" style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Switch>
        <Route path="/crm/leads/new" component={() => {
          return (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#00ff00',
              color: 'black',
              fontSize: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999999,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1>🚀 LEAD CREATION PAGE IS VISIBLE!</h1>
                <p style={{ fontSize: '24px', marginTop: '20px' }}>
                  Path: {window.location.pathname}
                </p>
                <p style={{ fontSize: '20px', marginTop: '10px' }}>
                  This should be clearly visible with green background
                </p>
              </div>
            </div>
          );
        }} />
        <Route path="/crm/leads/:id" component={({ params }: { params: { id: string } }) => (
          <LeadDetailPage params={params} />
        )} />
        <Route path="/crm/leads" component={TestLeadsPage} />
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