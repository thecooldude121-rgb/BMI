import React from 'react';
import { SimpleDashboard } from '../components/Dashboard/SimpleDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleDashboard />
    </div>
  );
};

export default Dashboard;