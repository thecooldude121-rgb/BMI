import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Crown, Star, TrendingUp, TrendingDown, Minus,
  Calendar, Users, Target, Zap, Filter, ChevronDown, Flame
} from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    title?: string;
    department?: string;
  };
  totalXP: number;
  currentLevel: number;
  totalBadges: number;
  currentStreak: number;
  weeklyXP: number;
  monthlyXP: number;
  previousRank?: number;
  rank: number;
}

interface TeamStats {
  name: string;
  totalXP: number;
  members: number;
  avgLevel: number;
  topPerformer: string;
}

const RANK_ICONS = {
  1: { icon: Crown, color: 'text-yellow-400', bg: 'from-yellow-400 to-orange-500' },
  2: { icon: Medal, color: 'text-gray-300', bg: 'from-gray-300 to-gray-500' },
  3: { icon: Medal, color: 'text-orange-400', bg: 'from-orange-400 to-red-500' }
};

export const NextGenLeaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('monthly');
  const [metric, setMetric] = useState<'xp' | 'badges' | 'streaks' | 'activities'>('xp');
  const [viewType, setViewType] = useState<'individual' | 'teams'>('individual');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const leaderboardData: LeaderboardEntry[] = [
    {
      userId: '1',
      user: {
        firstName: 'Alex',
        lastName: 'Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        title: 'Senior Sales Manager',
        department: 'Sales'
      },
      totalXP: 8450,
      currentLevel: 24,
      totalBadges: 32,
      currentStreak: 45,
      weeklyXP: 1250,
      monthlyXP: 4800,
      previousRank: 2,
      rank: 1
    },
    {
      userId: '2',
      user: {
        firstName: 'Sarah',
        lastName: 'Rodriguez',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9b2b044?w=150',
        title: 'Account Executive',
        department: 'Sales'
      },
      totalXP: 7890,
      currentLevel: 22,
      totalBadges: 28,
      currentStreak: 38,
      weeklyXP: 980,
      monthlyXP: 4200,
      previousRank: 1,
      rank: 2
    },
    {
      userId: '3',
      user: {
        firstName: 'Marcus',
        lastName: 'Thompson',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        title: 'Business Development Rep',
        department: 'Sales'
      },
      totalXP: 7320,
      currentLevel: 21,
      totalBadges: 25,
      currentStreak: 32,
      weeklyXP: 1150,
      monthlyXP: 3900,
      previousRank: 4,
      rank: 3
    },
    {
      userId: '4',
      user: {
        firstName: 'Emily',
        lastName: 'Wang',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        title: 'Marketing Manager',
        department: 'Marketing'
      },
      totalXP: 6850,
      currentLevel: 19,
      totalBadges: 23,
      currentStreak: 28,
      weeklyXP: 890,
      monthlyXP: 3500,
      previousRank: 3,
      rank: 4
    },
    {
      userId: '5',
      user: {
        firstName: 'David',
        lastName: 'Kumar',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        title: 'Customer Success Manager',
        department: 'Customer Success'
      },
      totalXP: 6420,
      currentLevel: 18,
      totalBadges: 21,
      currentStreak: 25,
      weeklyXP: 780,
      monthlyXP: 3200,
      previousRank: 5,
      rank: 5
    }
  ];

  const teamStats: TeamStats[] = [
    {
      name: 'Sales Titans',
      totalXP: 24660,
      members: 8,
      avgLevel: 22.1,
      topPerformer: 'Alex Chen'
    },
    {
      name: 'Marketing Mavericks',
      totalXP: 18450,
      members: 6,
      avgLevel: 19.3,
      topPerformer: 'Emily Wang'
    },
    {
      name: 'Success Squad',
      totalXP: 15680,
      members: 5,
      avgLevel: 18.8,
      topPerformer: 'David Kumar'
    }
  ];

  const departments = ['all', 'Sales', 'Marketing', 'Customer Success', 'Engineering'];

  const getRankMovement = (entry: LeaderboardEntry) => {
    if (!entry.previousRank) return { icon: Minus, color: 'text-gray-400' };
    const movement = entry.previousRank - entry.rank;
    if (movement > 0) return { icon: TrendingUp, color: 'text-green-400' };
    if (movement < 0) return { icon: TrendingDown, color: 'text-red-400' };
    return { icon: Minus, color: 'text-gray-400' };
  };

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (metric) {
      case 'xp': return timeframe === 'weekly' ? entry.weeklyXP : timeframe === 'monthly' ? entry.monthlyXP : entry.totalXP;
      case 'badges': return entry.totalBadges;
      case 'streaks': return entry.currentStreak;
      case 'activities': return Math.floor(entry.totalXP / 10); // Approximate activities from XP
      default: return entry.totalXP;
    }
  };

  const filteredData = leaderboardData
    .filter(entry => selectedDepartment === 'all' || entry.user.department === selectedDepartment)
    .sort((a, b) => getMetricValue(b) - getMetricValue(a))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Leaderboard</span>
            </h1>
            <p className="text-gray-300">Compete with your colleagues and climb the ranks</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mt-4 lg:mt-0">
            {/* View Type Toggle */}
            <div className="flex bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewType('individual')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewType === 'individual' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setViewType('teams')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewType === 'teams' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Teams
              </button>
            </div>

            {/* Timeframe */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="weekly" className="bg-gray-800">This Week</option>
              <option value="monthly" className="bg-gray-800">This Month</option>
              <option value="all-time" className="bg-gray-800">All Time</option>
            </select>

            {/* Metric */}
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as any)}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="xp" className="bg-gray-800">XP Earned</option>
              <option value="badges" className="bg-gray-800">Badges</option>
              <option value="streaks" className="bg-gray-800">Streaks</option>
              <option value="activities" className="bg-gray-800">Activities</option>
            </select>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-gray-800">
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {viewType === 'individual' ? (
        <div className="space-y-6">
          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {filteredData.slice(0, 3).map((entry, index) => {
              const rankConfig = RANK_ICONS[entry.rank] || { icon: Medal, color: 'text-gray-400', bg: 'from-gray-400 to-gray-600' };
              const IconComponent = rankConfig.icon;
              
              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative group ${index === 0 ? 'md:order-2 transform md:scale-110' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${rankConfig.bg} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  
                  <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
                    {/* Rank Icon */}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${rankConfig.bg} rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className={`w-6 h-6 ${rankConfig.color}`} />
                      </div>
                    </motion.div>

                    {/* Avatar */}
                    <div className="mt-6 mb-4">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-white/20">
                        {entry.user.avatarUrl ? (
                          <img 
                            src={entry.user.avatarUrl} 
                            alt={`${entry.user.firstName} ${entry.user.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                              {entry.user.firstName[0]}{entry.user.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {entry.user.firstName} {entry.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">{entry.user.title}</p>

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-white">
                        {getMetricValue(entry).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {metric === 'xp' ? 'XP' : metric === 'badges' ? 'Badges' : metric === 'streaks' ? 'Day Streak' : 'Activities'}
                      </div>
                      <div className="text-xs text-purple-300">
                        Level {entry.currentLevel}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Rest of Leaderboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Full Rankings</h2>
            </div>

            <div className="divide-y divide-white/10">
              {filteredData.slice(3).map((entry, index) => {
                const movement = getRankMovement(entry);
                const MovementIcon = movement.icon;
                
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white">
                        #{entry.rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        {entry.user.avatarUrl ? (
                          <img 
                            src={entry.user.avatarUrl} 
                            alt={`${entry.user.firstName} ${entry.user.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {entry.user.firstName[0]}{entry.user.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-white">
                            {entry.user.firstName} {entry.user.lastName}
                          </h3>
                          <MovementIcon className={`w-4 h-4 ${movement.color}`} />
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{entry.user.title}</span>
                          <span>•</span>
                          <span>Level {entry.currentLevel}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-orange-400" />
                            <span>{entry.currentStreak} days</span>
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {getMetricValue(entry).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {metric === 'xp' ? 'XP' : metric === 'badges' ? 'Badges' : metric === 'streaks' ? 'Days' : 'Activities'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      ) : (
        /* Team Leaderboard */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {teamStats.map((team, index) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{team.name}</h3>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total XP:</span>
                    <span className="text-white font-semibold">{team.totalXP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Members:</span>
                    <span className="text-white font-semibold">{team.members}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Level:</span>
                    <span className="text-white font-semibold">{team.avgLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Performer:</span>
                    <span className="text-purple-300 font-semibold">{team.topPerformer}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default NextGenLeaderboard;