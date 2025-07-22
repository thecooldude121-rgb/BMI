import React from 'react';
import { Switch, Route } from 'wouter';
import LeadsPage from './LeadsPage';
import ContactsPage from './ContactsPage';
import CompaniesPage from './CompaniesPage';
import UnifiedDealsPage from './UnifiedDealsPage';
import PipelinePage from './PipelinePage';
import ActivitiesPage from './ActivitiesPage';
import TasksPage from './TasksPage';

const CRMModule = () => {
  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      <Switch>
        <Route path="/crm/leads" component={LeadsPage} />
        <Route path="/crm/contacts" component={ContactsPage} />
        <Route path="/crm/accounts" component={CompaniesPage} />
        <Route path="/crm/deals" component={UnifiedDealsPage} />
        <Route path="/crm/pipeline" component={PipelinePage} />
        <Route path="/crm/tasks" component={TasksPage} />
        <Route path="/crm/activities" component={ActivitiesPage} />
        <Route path="/crm" component={LeadsPage} />
      </Switch>
    </div>
  );
};

export default CRMModule;