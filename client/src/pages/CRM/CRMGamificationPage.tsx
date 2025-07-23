import React from 'react';
import { Trophy, Award, Target, TrendingUp, Star, Users, DollarSign } from 'lucide-react';
import LeaderboardWidget from '../../components/Gamification/LeaderboardWidget';
import BadgesWidget from '../../components/Gamification/BadgesWidget';
import ProgressWidget from '../../components/Gamification/ProgressWidget';

const CRMGamificationPage: React.FC = () => {
  // In a real app, this would come from authentication context
  const currentUserId = "f310c13c-3edf-4f46-a6ec-46503ed02377";

  return (
    <div className="p-4 space-y-6">
      {/* CRM-focused Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Trophy className="mr-3 h-8 w-8" />
              Sales Performance Hub
            </h1>
            <p className="text-blue-100">
              Track your CRM performance, compete with your team, and achieve sales excellence!
            </p>
            <div className="mt-4 flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                <span>Sales Champion Program</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Team Competition</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>Revenue Tracking</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex space-x-6 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <Trophy className="h-8 w-8 mx-auto mb-1" />
              <div className="text-sm font-medium">Leaderboard</div>
              <div className="text-xs text-blue-200">See rankings</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Award className="h-8 w-8 mx-auto mb-1" />
              <div className="text-sm font-medium">Achievements</div>
              <div className="text-xs text-blue-200">Earn badges</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Target className="h-8 w-8 mx-auto mb-1" />
              <div className="text-sm font-medium">Goals</div>
              <div className="text-xs text-blue-200">Track progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats for CRM Context */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-xs text-gray-500">New Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$87K</p>
              <p className="text-xs text-gray-500">Closed Won</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Conversion</p>
              <p className="text-2xl font-bold text-gray-900">23%</p>
              <p className="text-xs text-gray-500">Lead to Deal</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rank</p>
              <p className="text-2xl font-bold text-gray-900">#2</p>
              <p className="text-xs text-gray-500">Team Position</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gamification Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress & Goals */}
        <div className="space-y-6">
          <ProgressWidget userId={currentUserId} />
          
          {/* CRM-specific achievements preview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="mr-2 h-5 w-5 text-purple-600" />
              Sales Goals
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Monthly Lead Target</p>
                  <p className="text-sm text-gray-600">Close 50 leads this month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">24/50</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '48%'}}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Revenue Target</p>
                  <p className="text-sm text-gray-600">Generate $100K in revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$87K/$100K</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard & Badges */}
        <div className="space-y-6">
          <LeaderboardWidget />
          <BadgesWidget userId={currentUserId} />
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
          Recent CRM Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Deal Closed</p>
                <p className="text-sm text-gray-600">Acme Corp - $15,000</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 font-medium">+50 points</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Lead Added</p>
                <p className="text-sm text-gray-600">Tech Solutions Inc.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 font-medium">+10 points</p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Badge Earned</p>
                <p className="text-sm text-gray-600">Lead Hunter - 25 leads this month</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-600 font-medium">+100 points</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMGamificationPage;