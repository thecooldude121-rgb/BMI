import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Gem, Star, Crown, Palette, Zap, Trophy, Sparkles,
  ShoppingCart, Check, Lock, Filter, Search, Grid, List
} from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'cosmetic' | 'utility' | 'exclusive' | 'experience';
  unlocked: boolean;
  claimed: boolean;
  discount?: number;
  limited?: boolean;
  remainingStock?: number;
  image?: string;
}

const RARITY_CONFIG = {
  common: {
    gradient: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-500/20',
    textColor: 'text-gray-300',
    label: 'Common'
  },
  rare: {
    gradient: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-500/40',
    textColor: 'text-blue-300',
    label: 'Rare'
  },
  epic: {
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-500/50',
    textColor: 'text-purple-300',
    label: 'Epic'
  },
  legendary: {
    gradient: 'from-yellow-400 to-orange-500',
    glow: 'shadow-orange-500/60',
    textColor: 'text-yellow-300',
    label: 'Legendary'
  }
};

const CATEGORY_ICONS = {
  cosmetic: Palette,
  utility: Zap,
  exclusive: Crown,
  experience: Trophy
};

export const NextGenRewardsMarketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [userXP, setUserXP] = useState(2847);
  const [showClaimModal, setShowClaimModal] = useState<RewardItem | null>(null);
  const [claimedItems, setClaimedItems] = useState<Set<string>>(new Set(['3']));

  const rewards: RewardItem[] = [
    {
      id: '1',
      name: 'Premium Dark Theme',
      description: 'Exclusive dark theme with purple accents and smooth animations',
      cost: 500,
      rarity: 'rare',
      category: 'cosmetic',
      unlocked: true,
      claimed: false,
      image: '🎨'
    },
    {
      id: '2',
      name: 'VIP Support Access',
      description: '30 days of priority customer support with dedicated agents',
      cost: 1200,
      rarity: 'epic',
      category: 'utility',
      unlocked: true,
      claimed: false,
      discount: 20,
      image: '💎'
    },
    {
      id: '3',
      name: 'Golden Crown Avatar',
      description: 'Legendary avatar frame that shows your elite status',
      cost: 2500,
      rarity: 'legendary',
      category: 'cosmetic',
      unlocked: false,
      claimed: true,
      image: '👑'
    },
    {
      id: '4',
      name: 'Coffee Shop Voucher',
      description: '$25 voucher for your favorite coffee shop',
      cost: 300,
      rarity: 'common',
      category: 'experience',
      unlocked: true,
      claimed: false,
      limited: true,
      remainingStock: 15,
      image: '☕'
    },
    {
      id: '5',
      name: 'Productivity Master Pack',
      description: 'Advanced analytics, custom dashboards, and automation tools',
      cost: 1800,
      rarity: 'epic',
      category: 'utility',
      unlocked: true,
      claimed: false,
      image: '⚡'
    },
    {
      id: '6',
      name: 'Hall of Fame Induction',
      description: 'Permanent recognition in the company hall of fame',
      cost: 5000,
      rarity: 'legendary',
      category: 'exclusive',
      unlocked: false,
      claimed: false,
      limited: true,
      remainingStock: 3,
      image: '🏆'
    },
    {
      id: '7',
      name: 'Custom Badge Creator',
      description: 'Design and create your own personal achievement badge',
      cost: 800,
      rarity: 'rare',
      category: 'cosmetic',
      unlocked: true,
      claimed: false,
      image: '🎭'
    },
    {
      id: '8',
      name: 'Team Lunch Sponsorship',
      description: 'Sponsor a team lunch for up to 10 colleagues',
      cost: 1500,
      rarity: 'epic',
      category: 'experience',
      unlocked: true,
      claimed: false,
      discount: 15,
      image: '🍽️'
    }
  ];

  const categories = ['all', 'cosmetic', 'utility', 'exclusive', 'experience'];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || reward.rarity === selectedRarity;
    const matchesSearch = reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRarity && matchesSearch;
  });

  const handleClaim = (reward: RewardItem) => {
    if (userXP >= reward.cost && reward.unlocked && !reward.claimed) {
      setUserXP(prev => prev - reward.cost);
      setClaimedItems(prev => new Set([...prev, reward.id]));
      setShowClaimModal(reward);
    }
  };

  const canAfford = (cost: number) => userXP >= cost;

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
              Rewards <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Marketplace</span>
            </h1>
            <p className="text-gray-300">Exchange your XP for exclusive rewards and experiences</p>
          </div>

          {/* XP Balance */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-4 lg:mt-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{userXP.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Available XP</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rewards..."
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
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
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

      {/* Rewards Grid */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}
      >
        {filteredRewards.map((reward, index) => {
          const rarityConfig = RARITY_CONFIG[reward.rarity];
          const CategoryIcon = CATEGORY_ICONS[reward.category];
          const isClaimed = claimedItems.has(reward.id);
          const affordable = canAfford(reward.cost);
          const discountedPrice = reward.discount ? Math.floor(reward.cost * (1 - reward.discount / 100)) : reward.cost;
          
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${rarityConfig.gradient} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity ${rarityConfig.glow}`}></div>
              
              <div className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 transform group-hover:scale-105 ${
                !reward.unlocked ? 'opacity-60' : ''
              }`}>
                {/* Limited Stock Banner */}
                {reward.limited && reward.remainingStock && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {reward.remainingStock} left
                  </div>
                )}

                {/* Discount Banner */}
                {reward.discount && (
                  <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    -{reward.discount}%
                  </div>
                )}

                <div className={viewMode === 'list' ? 'flex items-center space-x-4 w-full' : ''}>
                  {/* Reward Image/Icon */}
                  <div className={`relative ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                    <motion.div
                      animate={reward.unlocked && !isClaimed ? { 
                        boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0.4)', '0 0 0 10px rgba(168, 85, 247, 0)', '0 0 0 0 rgba(168, 85, 247, 0)']
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-16 h-16 ${viewMode === 'list' ? '' : 'mx-auto'} bg-gradient-to-r ${rarityConfig.gradient} rounded-full flex items-center justify-center text-2xl relative`}
                    >
                      {reward.image || <Gift className="w-8 h-8 text-white" />}
                      
                      {!reward.unlocked && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <Lock className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      
                      {isClaimed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    {/* Reward Info */}
                    <div className={`${viewMode === 'list' ? '' : 'text-center'} mb-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{reward.name}</h3>
                        <CategoryIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{reward.description}</p>
                      
                      {/* Rarity Badge */}
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${rarityConfig.gradient} text-white mb-3`}>
                        {rarityConfig.label}
                      </span>
                    </div>

                    {/* Price and Action */}
                    <div className={`flex items-center ${viewMode === 'list' ? 'justify-start' : 'justify-center'} space-x-4`}>
                      <div className="flex items-center space-x-2">
                        <Gem className="w-4 h-4 text-purple-400" />
                        {reward.discount ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 line-through text-sm">{reward.cost}</span>
                            <span className={`font-bold ${affordable ? 'text-white' : 'text-red-400'}`}>
                              {discountedPrice}
                            </span>
                          </div>
                        ) : (
                          <span className={`font-bold ${affordable ? 'text-white' : 'text-red-400'}`}>
                            {reward.cost}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      {isClaimed ? (
                        <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm flex items-center space-x-1">
                          <Check className="w-4 h-4" />
                          <span>Owned</span>
                        </div>
                      ) : !reward.unlocked ? (
                        <div className="px-4 py-2 bg-gray-600/20 border border-gray-600/30 rounded-lg text-gray-400 text-sm flex items-center space-x-1">
                          <Lock className="w-4 h-4" />
                          <span>Locked</span>
                        </div>
                      ) : !affordable ? (
                        <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                          Need {(reward.discount ? discountedPrice : reward.cost) - userXP} XP
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleClaim(reward)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Claim</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Claim Success Modal */}
      <AnimatePresence>
        {showClaimModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowClaimModal(null)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 relative border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Celebration particles */}
              {Array.from({ length: 15 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150
                  }}
                  transition={{ 
                    duration: 2,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                />
              ))}
              
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl"
                >
                  {showClaimModal.image || <Gift className="w-10 h-10 text-white" />}
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Reward Claimed!</h2>
                <p className="text-lg text-white/90 mb-4">You've successfully claimed</p>
                <p className="text-xl font-semibold text-purple-300 mb-6">{showClaimModal.name}</p>
                
                <div className="text-sm text-gray-400 mb-6">
                  Remaining XP: {userXP.toLocaleString()}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowClaimModal(null)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200"
                >
                  Awesome!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NextGenRewardsMarketplace;