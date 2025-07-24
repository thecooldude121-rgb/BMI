import React from 'react';
import { useParams } from 'wouter';
import { Building, ArrowLeft, Brain } from 'lucide-react';
import { GrowthRecommendations } from '@/components/GrowthRecommendations';

const TestAccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test Account Detail</h1>
              <p className="text-gray-600">Account ID: {id}</p>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-lg font-medium text-green-600 mb-2">✅ Account Detail Page is Working!</p>
          <p className="text-gray-600">Navigation successful. Now testing AI Growth feature below.</p>
        </div>
      </div>

      {/* AI Growth Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Growth Recommendations</h2>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            AI Powered
          </span>
        </div>
        
        <GrowthRecommendations accountId={id!} />
      </div>
    </div>
  );
};

export default TestAccountDetailPage;