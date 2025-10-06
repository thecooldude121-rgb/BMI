import React from 'react';
import { useParams } from 'react-router-dom';

const AccountDetailView: React.FC = () => {
  const { accountId } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Account Detail View</h1>
      <p className="text-gray-600">Account ID: {accountId}</p>
      <p className="text-sm text-gray-500">This component will display the 360° account view with activity timeline, contacts, deals, and documents.</p>
    </div>
  );
};

export default AccountDetailView;
