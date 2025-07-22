import { Trophy, Award, Target, TrendingUp } from 'lucide-react';
import LeaderboardWidget from '../../components/Gamification/LeaderboardWidget';
import BadgesWidget from '../../components/Gamification/BadgesWidget';
import ProgressWidget from '../../components/Gamification/ProgressWidget';

const GamificationPage: React.FC = () => {
  // In a real app, this would come from authentication context
  const currentUserId = "f310c13c-3edf-4f46-a6ec-46503ed02377";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏆 Sales Gamification</h1>
            <p className="text-blue-100">
              Track your performance, earn badges, and compete with your team!
            </p>
          </div>
          <div className="hidden md:flex space-x-6 text-center">
            <div>
              <Trophy className="h-8 w-8 mx-auto mb-1" />
              <div className="text-sm font-medium">Leaderboard</div>
            </div>
            <div>
              <Award className="h-8 w-8 mx-auto mb-1" />
              <div className="text-sm font-medium">Achievements</div>
            </div>
            <div>
              <Target className="h-8 w-8 mx-auto mb-1" />
              <div className="text-sm font-medium">Goals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">375</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Leaderboard Rank</p>
              <p className="text-2xl font-bold text-gray-900">#1</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Target Progress</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress & Badges */}
        <div className="lg:col-span-1 space-y-6">
          <ProgressWidget userId={currentUserId} />
          <BadgesWidget userId={currentUserId} maxDisplay={9} />
        </div>

        {/* Right Column - Leaderboard */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeaderboardWidget type="all-time" />
            <LeaderboardWidget type="monthly" />
          </div>
          
          {/* Recent Activities */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-600 text-2xl mr-3">🎯</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">First Deal Badge Earned!</div>
                  <div className="text-xs text-gray-500">Closed TechCorp Enterprise License deal</div>
                </div>
                <div className="text-sm font-bold text-green-600">+100 pts</div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-600 text-2xl mr-3">💰</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Big Deal Hunter Badge Earned!</div>
                  <div className="text-xs text-gray-500">Closed deal worth $250,000</div>
                </div>
                <div className="text-sm font-bold text-blue-600">+1000 pts</div>
              </div>
              
              <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-orange-600 text-2xl mr-3">📞</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Lead Converted to Deal</div>
                  <div className="text-xs text-gray-500">Innovation Solutions Platform opportunity</div>
                </div>
                <div className="text-sm font-bold text-orange-600">+50 pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Center */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Boost Your Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="text-blue-600 text-xl mb-2">📞</div>
            <div className="text-sm font-medium text-gray-900 mb-1">Make 5 calls</div>
            <div className="text-xs text-gray-600 mb-2">Earn 25 points</div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="text-xs text-blue-600 mt-1">3/5 completed</div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="text-green-600 text-xl mb-2">💰</div>
            <div className="text-sm font-medium text-gray-900 mb-1">Close 1 deal</div>
            <div className="text-xs text-gray-600 mb-2">Earn 100 points</div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="text-xs text-green-600 mt-1">Complete!</div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg">
            <div className="text-purple-600 text-xl mb-2">📅</div>
            <div className="text-sm font-medium text-gray-900 mb-1">Schedule 3 meetings</div>
            <div className="text-xs text-gray-600 mb-2">Earn 15 points</div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
            <div className="text-xs text-purple-600 mt-1">1/3 completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;