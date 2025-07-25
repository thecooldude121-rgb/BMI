import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Target, Users, Star, Award, Gift, Bell, TrendingUp, 
  Zap, Crown, Flame, Plus, ChevronRight, Calendar, Clock, CheckCircle,
  Sparkles, Rocket, Shield, Gem
} from 'lucide-react';

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
  xpToNextLevel?: number;
  levelName?: string;
}

interface DashboardStats {
  dailyXP: number;
  weeklyXP: number;
  monthlyXP: number;
  activeChallenges: number;
  completedToday: number;
  streakDays: number;
}

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity: string;
  category: string;
  unlocked: boolean;
  claimed: boolean;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600', 
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600'
};

const RARITY_GLOW = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/40',
  epic: 'shadow-purple-500/40', 
  legendary: 'shadow-yellow-500/60'
};

export const NextGenGamificationDashboard: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    userId: 'user-1',
    totalXP: 2847,
    currentLevel: 12,
    levelProgress: 73.5,
    totalBadges: 18,
    currentStreak: 23,
    longestStreak: 45,
    title: 'Sales Virtuoso',
    leaderboardRank: 2,
    xpToNextLevel: 467,
    levelName: 'Elite Closer'
  });

  const [stats, setStats] = useState<DashboardStats>({
    dailyXP: 125,
    weeklyXP: 890,
    monthlyXP: 3240,
    activeChallenges: 4,
    completedToday: 7,
    streakDays: 23
  });

  const [rewards, setRewards] = useState<RewardItem[]>([
    {
      id: '1',
      name: 'Premium Theme Pack',
      description: 'Unlock exclusive dark themes',
      cost: 500,
      rarity: 'rare',
      category: 'cosmetic',
      unlocked: true,
      claimed: false
    },
    {
      id: '2', 
      name: 'VIP Support Access',
      description: '30 days priority support',
      cost: 1200,
      rarity: 'epic',
      category: 'utility',
      unlocked: true,
      claimed: false
    },
    {
      id: '3',
      name: 'Golden Crown Avatar',
      description: 'Legendary avatar frame',
      cost: 2500,
      rarity: 'legendary',
      category: 'cosmetic',
      unlocked: false,
      claimed: false
    }
  ]);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState(false);

  // Mock level up celebration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Champion</span>
              </h1>
              <p className="text-gray-300">Current Title: {profile.title}</p>
            </div>
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{profile.totalXP.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Level Progress Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">Lv.{profile.currentLevel}</div>
                  <div className="text-sm text-gray-300">{profile.levelName}</div>
                </div>
              </div>
              
              {/* Animated Progress Ring */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40" 
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-gray-700"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - profile.levelProgress / 100) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{Math.round(profile.levelProgress)}%</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-300">{profile.xpToNextLevel} XP to next level</div>
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{profile.currentStreak}</div>
                  <div className="text-sm text-gray-300">Day Streak</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Current</span>
                  <span className="text-white font-medium">{profile.currentStreak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Longest</span>
                  <span className="text-white font-medium">{profile.longestStreak} days</span>
                </div>
              </div>
              
              {/* Streak Calendar Dots */}
              <div className="mt-4 flex space-x-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`w-4 h-4 rounded-full ${
                      i < profile.currentStreak % 7 ? 'bg-orange-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badges Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{profile.totalBadges}</div>
                  <div className="text-sm text-gray-300">Badges Earned</div>
                </div>
              </div>
              
              {/* Recent Badges Preview */}
              <div className="flex space-x-2 overflow-hidden">
                {[1, 2, 3, 4].map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                ))}
                <div className="flex items-center text-sm text-gray-300 ml-2">
                  +{Math.max(0, profile.totalBadges - 4)} more
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">#{profile.leaderboardRank}</div>
                  <div className="text-sm text-gray-300">Rank</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-gray-300">↑ 2 places this week</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-teal-400" />
                  <span className="text-sm text-gray-300">85 XP to rank #1</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reward Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-400" />
              Available Rewards
            </h2>
            <button className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="group relative flex-shrink-0 w-64"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${RARITY_COLORS[reward.rarity]} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                <div className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 ${RARITY_GLOW[reward.rarity]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${RARITY_COLORS[reward.rarity]} text-white`}>
                      {reward.rarity.toUpperCase()}
                    </div>
                    {reward.unlocked && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{reward.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Gem className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">{reward.cost}</span>
                    </div>
                    
                    {reward.unlocked ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white text-sm font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Claim
                      </motion.button>
                    ) : (
                      <div className="px-4 py-2 bg-gray-600 rounded-lg text-gray-300 text-sm">
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {[
                { action: 'Completed 5 activities', xp: 25, time: '2 hours ago', icon: CheckCircle },
                { action: 'Closed deal worth $50k', xp: 100, time: '1 day ago', icon: Target },
                { action: 'Earned "Speed Demon" badge', xp: 50, time: '2 days ago', icon: Medal },
                { action: 'Reached 20-day streak', xp: 75, time: '3 days ago', icon: Flame },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <activity.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                  <div className="text-purple-400 font-medium text-sm">+{activity.xp} XP</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Daily Check-in', icon: Calendar, color: 'from-green-500 to-emerald-500' },
                { label: 'View Challenges', icon: Target, color: 'from-blue-500 to-cyan-500' },
                { label: 'Claim Rewards', icon: Gift, color: 'from-purple-500 to-pink-500' },
                { label: 'Leaderboard', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 bg-gradient-to-r ${action.color} rounded-lg text-white text-center hover:shadow-lg transition-all duration-200`}
                >
                  <action.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{action.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Level Up Celebration Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 p-8 rounded-2xl text-center relative overflow-hidden"
            >
              {/* Celebration particles */}
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  transition={{ 
                    duration: 2,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                />
              ))}
              
              <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">LEVEL UP!</h2>
              <p className="text-xl text-white/90 mb-4">You've reached Level {profile.currentLevel + 1}!</p>
              <p className="text-white/80">You are now an {profile.levelName}!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NextGenGamificationDashboard;