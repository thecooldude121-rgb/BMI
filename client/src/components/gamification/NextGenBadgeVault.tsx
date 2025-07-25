import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Award, Crown, Shield, Gem, Flame, Zap, Target, Trophy, Medal,
  Lock, Unlock, Sparkles, ChevronRight, Filter, Search, Grid, List
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  badgeType: string;
  iconColor: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
  story?: string;
}

const RARITY_CONFIG = {
  common: {
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
    glow: 'shadow-gray-500/20',
    ring: 'ring-gray-400/30',
    label: 'Common',
    textColor: 'text-gray-300'
  },
  rare: {
    gradient: 'from-blue-400 via-blue-500 to-blue-600', 
    glow: 'shadow-blue-500/40',
    ring: 'ring-blue-400/50',
    label: 'Rare',
    textColor: 'text-blue-300'
  },
  epic: {
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    glow: 'shadow-purple-500/50',
    ring: 'ring-purple-400/60',
    label: 'Epic',
    textColor: 'text-purple-300'
  },
  legendary: {
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    glow: 'shadow-orange-500/60',
    ring: 'ring-yellow-400/70',
    label: 'Legendary',
    textColor: 'text-yellow-300'
  }
};

const BADGE_ICONS = {
  milestone: Trophy,
  skill: Target, 
  social: Star,
  streak: Flame,
  achievement: Award,
  special: Crown,
  performance: Zap,
  collaboration: Shield
};

export const NextGenBadgeVault: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first CRM activity',
      badgeType: 'milestone',
      iconColor: '#10B981',
      points: 50,
      rarity: 'common',
      category: 'Getting Started',
      unlocked: true,
      unlockedAt: '2024-01-15',
      story: 'Every journey begins with a single step. You took yours by completing your first activity!'
    },
    {
      id: '2',
      name: 'Deal Hunter',
      description: 'Close 10 deals in a month',
      badgeType: 'performance',
      iconColor: '#F59E0B',
      points: 250,
      rarity: 'rare',
      category: 'Sales Excellence',
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      unlockedAt: '2024-01-20',
      story: 'Your dedication to closing deals has not gone unnoticed. A true sales professional!'
    },
    {
      id: '3',
      name: 'Social Butterfly',
      description: 'Receive 50 peer recognitions',
      badgeType: 'social',
      iconColor: '#8B5CF6',
      points: 300,
      rarity: 'epic',
      category: 'Teamwork',
      unlocked: false,
      progress: 32,
      maxProgress: 50
    },
    {
      id: '4',
      name: 'Legend Incarnate',
      description: 'Achieve the impossible - close 100 deals in one quarter',
      badgeType: 'special',
      iconColor: '#EF4444',
      points: 1000,
      rarity: 'legendary',
      category: 'Legendary Feats',
      unlocked: false,
      progress: 47,
      maxProgress: 100
    },
    {
      id: '5',
      name: 'Streak Master',
      description: 'Maintain a 30-day activity streak',
      badgeType: 'streak',
      iconColor: '#F97316',
      points: 200,
      rarity: 'rare',
      category: 'Consistency', 
      unlocked: true,
      progress: 30,
      maxProgress: 30,
      unlockedAt: '2024-01-25'
    },
    {
      id: '6',
      name: 'Team Player',
      description: 'Help 10 colleagues achieve their goals',
      badgeType: 'collaboration',
      iconColor: '#06B6D4',
      points: 180,
      rarity: 'rare',
      category: 'Teamwork',
      unlocked: false,
      progress: 7,
      maxProgress: 10
    }
  ];

  const categories = ['all', ...Array.from(new Set(badges.map(b => b.category)))];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  const filteredBadges = badges.filter(badge => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || badge.rarity === selectedRarity;
    const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRarity && matchesSearch;
  });

  const rarityStats = {
    common: badges.filter(b => b.rarity === 'common' && b.unlocked).length,
    rare: badges.filter(b => b.rarity === 'rare' && b.unlocked).length,
    epic: badges.filter(b => b.rarity === 'epic' && b.unlocked).length,
    legendary: badges.filter(b => b.rarity === 'legendary' && b.unlocked).length,
  };

  const totalUnlocked = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Badge <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Vault</span>
            </h1>
            <p className="text-gray-300">Your collection of achievements and milestones</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{totalUnlocked}/{badges.length}</div>
            <div className="text-sm text-gray-400">Badges Unlocked</div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(rarityStats).map(([rarity, count]) => (
            <motion.div
              key={rarity}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${RARITY_CONFIG[rarity].gradient} rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className={`text-sm ${RARITY_CONFIG[rarity].textColor} capitalize`}>{rarity}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity} className="bg-gray-800">
                  {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Badge Grid/List */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}
      >
        {filteredBadges.map((badge, index) => {
          const IconComponent = BADGE_ICONS[badge.badgeType] || Award;
          const rarityConfig = RARITY_CONFIG[badge.rarity];
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative cursor-pointer ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}
            >
              {/* 3D Card Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${rarityConfig.gradient} rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-300 ${rarityConfig.glow}`}></div>
              
              <div className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 transform group-hover:scale-105 ${rarityConfig.ring} ring-0 group-hover:ring-2`}>
                {badge.unlocked && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                )}

                <div className={viewMode === 'list' ? 'flex items-center space-x-4 w-full' : ''}>
                  {/* Badge Icon */}
                  <div className={`relative ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                    <motion.div
                      animate={badge.unlocked ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-16 h-16 mx-auto bg-gradient-to-r ${rarityConfig.gradient} rounded-full flex items-center justify-center ${badge.unlocked ? rarityConfig.glow : 'grayscale opacity-50'}`}
                    >
                      {badge.unlocked ? (
                        <IconComponent className="w-8 h-8 text-white" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-400" />
                      )}
                    </motion.div>
                    
                    {/* Progress Ring for Unlocked/Partial Badges */}
                    {badge.progress !== undefined && badge.maxProgress && (
                      <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="30"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-gray-600"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="30"
                          stroke={`url(#${badge.rarity}-gradient)`}
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 30}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - badge.progress / badge.maxProgress) }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id={`${badge.rarity}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={badge.rarity === 'legendary' ? '#F59E0B' : '#8B5CF6'} />
                            <stop offset="100%" stopColor={badge.rarity === 'legendary' ? '#EF4444' : '#06B6D4'} />
                          </linearGradient>
                        </defs>
                      </svg>
                    )}
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    {/* Badge Info */}
                    <div className={`${viewMode === 'list' ? '' : 'text-center'} mb-3`}>
                      <h3 className="text-lg font-semibold text-white mb-1">{badge.name}</h3>
                      <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                      
                      {/* Rarity and Points */}
                      <div className={`flex ${viewMode === 'list' ? 'justify-start' : 'justify-center'} space-x-2`}>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${rarityConfig.gradient} text-white`}>
                          {rarityConfig.label}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {badge.points} XP
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {badge.progress !== undefined && badge.maxProgress && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-2 rounded-full bg-gradient-to-r ${rarityConfig.gradient}`}
                          />
                        </div>
                        {!badge.unlocked && (
                          <p className="text-xs text-gray-400 mt-1">
                            {badge.maxProgress - badge.progress} more to unlock
                          </p>
                        )}
                      </div>
                    )}

                    {/* Unlock Status */}
                    {badge.unlocked && badge.unlockedAt && (
                      <div className="text-xs text-green-400 flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {viewMode === 'list' && (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full relative border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ×
              </button>

              <div className="text-center">
                {/* Large Badge Icon */}
                <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-r ${RARITY_CONFIG[selectedBadge.rarity].gradient} rounded-full flex items-center justify-center ${selectedBadge.unlocked ? RARITY_CONFIG[selectedBadge.rarity].glow : 'grayscale opacity-50'}`}>
                  {selectedBadge.unlocked ? (
                    React.createElement(BADGE_ICONS[selectedBadge.badgeType] || Award, { className: "w-12 h-12 text-white" })
                  ) : (
                    <Lock className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{selectedBadge.name}</h2>
                <p className="text-gray-300 mb-4">{selectedBadge.description}</p>

                {/* Badge Details */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{selectedBadge.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rarity:</span>
                    <span className={RARITY_CONFIG[selectedBadge.rarity].textColor}>
                      {RARITY_CONFIG[selectedBadge.rarity].label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">XP Reward:</span>
                    <span className="text-purple-400">{selectedBadge.points} XP</span>
                  </div>
                  {selectedBadge.progress !== undefined && selectedBadge.maxProgress && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Progress:</span>
                      <span className="text-white">{selectedBadge.progress}/{selectedBadge.maxProgress}</span>
                    </div>
                  )}
                </div>

                {/* Story */}
                {selectedBadge.story && selectedBadge.unlocked && (
                  <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Achievement Story</h4>
                    <p className="text-sm text-gray-400 italic">{selectedBadge.story}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NextGenBadgeVault;