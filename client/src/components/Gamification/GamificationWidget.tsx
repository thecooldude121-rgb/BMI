import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Medal, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

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

interface GamificationWidgetProps {
  userId?: string;
  compact?: boolean;
}

export const GamificationWidget: React.FC<GamificationWidgetProps> = ({ 
  userId = 'f310c13c-3edf-4f46-a6ec-46503ed02377', 
  compact = false 
}) => {
  const { data: profile, isLoading } = useQuery<UserProfile>({
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

  if (isLoading || !profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <Link href="/crm/gamification">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4" />
                <span className="font-medium">Level {profile.currentLevel}</span>
              </div>
              <div className="text-xs opacity-90 mt-1">
                {profile.totalXP.toLocaleString()} XP
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Flame className="w-3 h-3" />
              <span>{profile.currentStreak}</span>
            </div>
          </div>
          <div className="mt-2 bg-white/20 rounded-full h-1">
            <div 
              className="bg-white rounded-full h-1 transition-all duration-300"
              style={{ width: `${profile.levelProgress}%` }}
            />
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Gamification
        </h3>
        <Link 
          href="/crm/gamification" 
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {/* User Level and XP */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{profile.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Level {profile.currentLevel} • {profile.totalXP.toLocaleString()} XP
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Rank</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                #{profile.leaderboardRank}
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress to Level {profile.currentLevel + 1}</span>
              <span>{profile.levelProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profile.levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-center mb-1">
              <Medal className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {profile.totalBadges}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Badges</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-center mb-1">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {profile.currentStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-center mb-1">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">
              {profile.currentLevel}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Level</div>
          </div>
        </div>

        {/* Call to Action */}
        <Link 
          href="/crm/gamification"
          className="block w-full"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4" />
            Explore Challenges
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};