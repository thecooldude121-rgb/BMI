import React from 'react';

const SimpleKanbanTest: React.FC = () => {
  console.log('SimpleKanbanTest rendering - Direct test component');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-8 text-center">
          🎯 KANBAN TEST PAGE - DIRECT COMPONENT LOAD
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto">
          {/* Discovery */}
          <div className="bg-blue-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-blue-800 mb-4">Discovery</h3>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">AWS Migration</h4>
              <p className="text-xs text-gray-600">$500K</p>
            </div>
          </div>

          {/* Qualification */}
          <div className="bg-purple-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-purple-800 mb-4">Qualification</h3>
            <div className="bg-white rounded p-3 shadow-sm mb-2">
              <h4 className="font-medium text-sm">Apple Enterprise</h4>
              <p className="text-xs text-gray-600">$750K</p>
            </div>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">Google Workspace</h4>
              <p className="text-xs text-gray-600">$300K</p>
            </div>
          </div>

          {/* Proposal */}
          <div className="bg-yellow-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-yellow-800 mb-4">Proposal</h3>
            <div className="bg-white rounded p-3 shadow-sm mb-2">
              <h4 className="font-medium text-sm">Microsoft Teams</h4>
              <p className="text-xs text-gray-600">$400K</p>
            </div>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">Salesforce Integration</h4>
              <p className="text-xs text-gray-600">$200K</p>
            </div>
          </div>

          {/* Demo */}
          <div className="bg-indigo-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-indigo-800 mb-4">Demo</h3>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">Oracle Database</h4>
              <p className="text-xs text-gray-600">$600K</p>
            </div>
          </div>

          {/* Trial */}
          <div className="bg-teal-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-teal-800 mb-4">Trial</h3>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">Adobe Creative Suite</h4>
              <p className="text-xs text-gray-600">$150K</p>
            </div>
          </div>

          {/* Negotiation */}
          <div className="bg-orange-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-orange-800 mb-4">Negotiation</h3>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">Netflix Enterprise</h4>
              <p className="text-xs text-gray-600">$1.2M</p>
            </div>
          </div>

          {/* Closed Won */}
          <div className="bg-green-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-green-800 mb-4">Closed Won</h3>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">Meta Business Suite</h4>
              <p className="text-xs text-gray-600">$800K</p>
            </div>
          </div>

          {/* Closed Lost */}
          <div className="bg-red-100 rounded-lg p-4 min-h-96">
            <h3 className="font-bold text-red-800 mb-4">Closed Lost</h3>
            <div className="bg-white rounded p-3 shadow-sm">
              <h4 className="font-medium text-sm">Tesla Energy</h4>
              <p className="text-xs text-gray-600">$2M</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700">
            All 8 stages displayed with horizontal scroll capability
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total: 10 deals across all stages
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleKanbanTest;