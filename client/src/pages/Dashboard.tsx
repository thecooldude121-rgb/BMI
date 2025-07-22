import React from 'react';
import { CustomizableDashboard } from '../components/Dashboard/CustomizableDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CustomizableDashboard />
    </div>
  );
};

export default Dashboard;