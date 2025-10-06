import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AccountsProvider } from '../../contexts/AccountsContext';
import AccountsListView from './AccountsListView';
import AccountDetailView from './AccountDetailView';
import AccountHierarchyView from './AccountHierarchyView';
import AccountAnalytics from './AccountAnalytics';
import AccountImportExport from './AccountImportExport';
import AccountDuplicates from './AccountDuplicates';
import AccountWorkflows from './AccountWorkflows';

const AccountsModule: React.FC = () => {
  return (
    <AccountsProvider>
      <Routes>
        <Route path="/" element={<AccountsListView />} />
        <Route path="/list" element={<AccountsListView />} />
        <Route path="/hierarchy" element={<AccountHierarchyView />} />
        <Route path="/analytics" element={<AccountAnalytics />} />
        <Route path="/import-export" element={<AccountImportExport />} />
        <Route path="/duplicates" element={<AccountDuplicates />} />
        <Route path="/workflows" element={<AccountWorkflows />} />
        <Route path="/:accountId" element={<AccountDetailView />} />
        <Route path="*" element={<Navigate to="/accounts" replace />} />
      </Routes>
    </AccountsProvider>
  );
};

export default AccountsModule;
