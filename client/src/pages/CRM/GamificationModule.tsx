import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, Medal, Target, Users, Star, Award, 
  Gift, Bell, TrendingUp, Zap, Crown, Flame,
  Plus, ChevronRight, Calendar, Clock, CheckCircle
} from 'lucide-react';

// Import Next-Gen Components
import NextGenGamificationDashboard from '../../components/gamification/NextGenGamificationDashboard';
import NextGenBadgeVault from '../../components/gamification/NextGenBadgeVault';
import NextGenLeaderboard from '../../components/gamification/NextGenLeaderboard';
import NextGenChallenges from '../../components/gamification/NextGenChallenges';
import NextGenRewardsMarketplace from '../../components/gamification/NextGenRewardsMarketplace';

interface UserProfile {
  id: string;
  userId: string;
  totalXP: number;
  currentLevel: number;
  levelProgress: number;
  totalBadges: number;
  currentStreak: number;
  longestStreak: number;
  title: string;
  leaderboardRank?: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  badgeType: string;
  iconColor: string;
  points: number;
  rarity: string;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  challengeType: string;
  status: string;
  difficulty: string;
  goal: any;
  progress: any;
  rewards: any[];
  startDate: string;
  endDate: string;
  participants: any[];
}

interface LeaderboardEntry {
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  totalXP: number;
  currentLevel: number;
  totalBadges: number;
  currentStreak: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  priority: string;
  createdAt: string;
}

export function GamificationModule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const queryClient = useQueryClient();
  
  // Mock user ID - in real app this would come from auth
  const userId = 'f310c13c-3edf-4f46-a6ec-46503ed02377';
  
  // Queries
  const { data: profile } = useQuery<UserProfile>({
    queryKey: [`/api/gamification/profile/${userId}`],
    initialData: {
      id: '1',
      userId,
      totalXP: 1250,
      currentLevel: 8,
      levelProgress: 65.5,
      totalBadges: 12,
      currentStreak: 15,
      longestStreak: 28,
      title: 'Sales Champion',
      leaderboardRank: 3
    }
  });

  const { data: badges = [] } = useQuery<Badge[]>({
    queryKey: ['/api/gamification/badges'],
    initialData: [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first CRM action',
        badgeType: 'achievement',
        iconColor: '#10B981',
        points: 10,
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Lead Generator',
        description: 'Create 10 leads in a month',
        badgeType: 'milestone',
        iconColor: '#3B82F6',
        points: 50,
        rarity: 'rare'
      },
      {
        id: '3',
        name: 'Deal Closer',
        description: 'Close 5 deals successfully',
        badgeType: 'achievement',
        iconColor: '#F59E0B',
        points: 100,
        rarity: 'epic'
      }
    ]
  });

  const { data: challenges = [] } = useQuery<Challenge[]>({
    queryKey: ['/api/gamification/challenges'],
    initialData: [
      {
        id: '1',
        name: 'Monthly Sales Blitz',
        description: 'Complete 20 activities and close 3 deals this month',
        challengeType: 'individual',
        status: 'active',
        difficulty: 'medium',
        goal: { activities: 20, deals: 3 },
        progress: { activities: 14, deals: 1 },
        rewards: [{ type: 'points', value: 500 }, { type: 'badge', value: 'sales_blitz_winner' }],
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        participants: []
      }
    ]
  });

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/gamification/leaderboard'],
    initialData: [
      {
        userId: '1',
        user: { firstName: 'Alex', lastName: 'Johnson' },
        totalXP: 2150,
        currentLevel: 12,
        totalBadges: 18,
        currentStreak: 22
      },
      {
        userId: '2',
        user: { firstName: 'Sarah', lastName: 'Chen' },
        totalXP: 1890,
        currentLevel: 10,
        totalBadges: 15,
        currentStreak: 18
      },
      {
        userId: userId,
        user: { firstName: 'John', lastName: 'Doe' },
        totalXP: 1250,
        currentLevel: 8,
        totalBadges: 12,
        currentStreak: 15
      }
    ]
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: [`/api/gamification/notifications/${userId}`],
    initialData: [
      {
        id: '1',
        type: 'badge_earned',
        title: 'Badge Earned: Deal Closer',
        message: 'Congratulations on closing 5 deals!',
        data: { badgeId: '3', badgeName: 'Deal Closer' },
        isRead: false,
        priority: 'normal',
        createdAt: '2025-01-25T10:30:00Z'
      }
    ]
  });

  // Mutations
  const triggerAction = useMutation({
    mutationFn: async (actionData: any) => {
      const response = await fetch('/api/gamification/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/gamification/profile/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/gamification/notifications/${userId}`] });
    }
  });

  // Helper functions
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      case 'expert': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateXPToNextLevel = () => {
    const baseXP = 100;
    const nextLevel = profile.currentLevel + 1;
    const xpForNextLevel = Math.floor(baseXP * Math.pow(1.5, nextLevel - 1));
    const currentLevelXP = Math.floor(baseXP * Math.pow(1.5, profile.currentLevel - 1));
    return xpForNextLevel - currentLevelXP;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gamification Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">Drive engagement, competition, and productivity</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => triggerAction.mutate({
              actionType: 'daily_login',
              targetEntity: 'user',
              entityId: userId,
              userId,
              points: 5,
              context: { loginTime: new Date().toISOString() }
            })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={triggerAction.isPending}
          >
            <Zap className="w-4 h-4" />
            {triggerAction.isPending ? 'Processing...' : 'Daily Check-in'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Trophy },
            { id: 'badges', label: 'Badges', icon: Medal },
            { id: 'challenges', label: 'Challenges', icon: Target },
            { id: 'leaderboard', label: 'Leaderboard', icon: Users },
            { id: 'rewards', label: 'Rewards', icon: Gift },
            { id: 'notifications', label: 'Notifications', icon: Bell }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'notifications' && notifications.filter(n => !n.isRead).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* User Profile Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile.title}</h2>
                  <p className="text-blue-100">Level {profile.currentLevel} • {profile.totalXP} XP</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {profile.currentStreak} day streak
                    </span>
                    <span className="flex items-center gap-1">
                      <Medal className="w-4 h-4" />
                      {profile.totalBadges} badges
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      Rank #{profile.leaderboardRank}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100 mb-1">Next Level</div>
                <div className="w-32 bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${profile.levelProgress}%` }}
                  />
                </div>
                <div className="text-xs text-blue-100">
                  {Math.round((profile.levelProgress / 100) * calculateXPToNextLevel())} / {calculateXPToNextLevel()} XP
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total XP', value: profile.totalXP.toLocaleString(), icon: Star, color: 'blue' },
              { label: 'Current Level', value: profile.currentLevel, icon: TrendingUp, color: 'green' },
              { label: 'Active Streak', value: `${profile.currentStreak} days`, icon: Flame, color: 'orange' },
              { label: 'Badges Earned', value: profile.totalBadges, icon: Medal, color: 'purple' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Badges and Active Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Badges</h3>
                <button 
                  onClick={() => setActiveTab('badges')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {badges.slice(0, 3).map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: badge.iconColor + '20', color: badge.iconColor }}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{badge.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{badge.points} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Challenges */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Challenges</h3>
                <button 
                  onClick={() => setActiveTab('challenges')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {challenges.filter(c => c.status === 'active').map(challenge => (
                  <div key={challenge.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{challenge.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{challenge.description}</p>
                    
                    {/* Progress bars */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Activities</span>
                          <span>{challenge.progress.activities || 0}/{challenge.goal.activities}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(((challenge.progress.activities || 0) / challenge.goal.activities) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Deals</span>
                          <span>{challenge.progress.deals || 0}/{challenge.goal.deals}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(((challenge.progress.deals || 0) / challenge.goal.deals) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Badge Collection</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {profile.totalBadges} badges earned
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map(badge => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-center">
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: badge.iconColor + '20', color: badge.iconColor }}
                  >
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{badge.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{badge.description}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{badge.points} XP</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      entry.userId === userId 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {index === 0 && <Crown className="w-6 h-6 text-yellow-500" />}
                      {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
                      {index === 2 && <Medal className="w-6 h-6 text-amber-600" />}
                      {index > 2 && (
                        <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {entry.user.firstName[0]}{entry.user.lastName[0]}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {entry.user.firstName} {entry.user.lastName}
                        {entry.userId === userId && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Level {entry.currentLevel}</span>
                        <span>{entry.totalBadges} badges</span>
                        <span>{entry.currentStreak} day streak</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {entry.totalXP.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.isRead 
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'badge_earned' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    notification.type === 'level_up' ? 'bg-green-100 dark:bg-green-900/20' :
                    'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    {notification.type === 'badge_earned' && <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                    {notification.type === 'level_up' && <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {notification.type === 'challenge_complete' && <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{notification.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}