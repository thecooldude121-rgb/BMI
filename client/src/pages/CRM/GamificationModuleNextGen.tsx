import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Award, Target, Gift, TrendingUp
} from 'lucide-react';

// Import Next-Gen Components
import NextGenGamificationDashboard from '../../components/gamification/NextGenGamificationDashboard';
import NextGenBadgeVault from '../../components/gamification/NextGenBadgeVault';
import NextGenLeaderboard from '../../components/gamification/NextGenLeaderboard';
import NextGenChallenges from '../../components/gamification/NextGenChallenges';
import NextGenRewardsMarketplace from '../../components/gamification/NextGenRewardsMarketplace';

export function GamificationModule() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Render the appropriate next-gen component based on active tab
  const renderNextGenContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <NextGenGamificationDashboard />;
      case 'badges':
        return <NextGenBadgeVault />;
      case 'leaderboard':
        return <NextGenLeaderboard />;
      case 'challenges':
        return <NextGenChallenges />;
      case 'rewards':
        return <NextGenRewardsMarketplace />;
      default:
        return <NextGenGamificationDashboard />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Ultra-modern tab navigation overlay - Fixed and Frozen */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-black/30 backdrop-blur-xl border border-white/30 rounded-2xl p-3 shadow-2xl mt-[57px] mb-[57px] pl-[18px] pr-[18px] pt-[10px] pb-[10px] ml-[-18px] mr-[-18px]"
        style={{
          position: 'fixed',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="flex space-x-2">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { key: 'badges', label: 'Badges', icon: Award },
            { key: 'challenges', label: 'Challenges', icon: Target },
            { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { key: 'rewards', label: 'Rewards', icon: Gift }
          ].map(tab => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
      {/* Next-Gen Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-24"
        >
          {renderNextGenContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}