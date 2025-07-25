import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Clock, Users, Trophy, Star, Zap, Calendar, CheckCircle,
  Play, Pause, Award, Gift, Flame, TrendingUp, ChevronRight, Plus
} from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  description: string;
  challengeType: 'individual' | 'team';
  status: 'active' | 'upcoming' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  goal: {
    type: string;
    target: number;
    current: number;
  };
  rewards: {
    xp: number;
    badges?: string[];
    items?: string[];
  };
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  timeRemaining?: string;
  category: string;
}

const DIFFICULTY_CONFIG = {
  easy: {
    color: 'from-green-400 to-emerald-500',
    textColor: 'text-green-300',
    label: 'Easy',
    icon: '⭐'
  },
  medium: {
    color: 'from-yellow-400 to-orange-500',
    textColor: 'text-yellow-300',
    label: 'Medium',
    icon: '⭐⭐'
  },
  hard: {
    color: 'from-red-400 to-pink-500',
    textColor: 'text-red-300',
    label: 'Hard',
    icon: '⭐⭐⭐'
  },
  expert: {
    color: 'from-purple-400 to-indigo-500',
    textColor: 'text-purple-300',
    label: 'Expert',
    icon: '⭐⭐⭐⭐'
  }
};

export const NextGenChallenges: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'completed'>('active');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set(['1', '3']));

  const challenges: Challenge[] = [
    {
      id: '1',
      name: 'Deal Velocity Sprint',
      description: 'Close 5 deals in the next 7 days and boost your closing speed',
      challengeType: 'individual',
      status: 'active',
      difficulty: 'medium',
      goal: {
        type: 'deals_closed',
        target: 5,
        current: 3
      },
      rewards: {
        xp: 500,
        badges: ['Speed Demon'],
        items: ['Premium Theme Pack']
      },
      startDate: '2025-01-20',
      endDate: '2025-01-27',
      participants: 24,
      maxParticipants: 50,
      timeRemaining: '3 days, 14 hours',
      category: 'Sales Performance'
    },
    {
      id: '2',
      name: 'Team Collaboration Master',
      description: 'Work together to complete 100 team activities this month',
      challengeType: 'team',
      status: 'active',
      difficulty: 'hard',
      goal: {
        type: 'team_activities',
        target: 100,
        current: 67
      },
      rewards: {
        xp: 1000,
        badges: ['Team Spirit', 'Collaboration King'],
        items: ['VIP Support Access']
      },
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      participants: 8,
      maxParticipants: 10,
      timeRemaining: '6 days, 8 hours',
      category: 'Teamwork'
    },
    {
      id: '3',
      name: 'Morning Warrior',
      description: 'Complete at least 3 activities before 10 AM for 10 consecutive days',
      challengeType: 'individual',
      status: 'active',
      difficulty: 'easy',
      goal: {
        type: 'morning_activities',
        target: 10,
        current: 7
      },
      rewards: {
        xp: 300,
        badges: ['Early Bird'],
        items: ['Coffee Shop Voucher']
      },
      startDate: '2025-01-15',
      endDate: '2025-01-29',
      participants: 42,
      timeRemaining: '4 days, 2 hours',
      category: 'Productivity'
    },
    {
      id: '4',
      name: 'Legend Maker',
      description: 'Achieve impossible: 50 deals, 500 activities, and 10,000 XP in one month',
      challengeType: 'individual',
      status: 'upcoming',
      difficulty: 'expert',
      goal: {
        type: 'legendary_achievement',
        target: 3,
        current: 0
      },
      rewards: {
        xp: 5000,
        badges: ['Legend Incarnate', 'Ultimate Achiever'],
        items: ['Golden Crown Avatar', 'Lifetime VIP Access']
      },
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      participants: 0,
      maxParticipants: 20,
      category: 'Legendary'
    },
    {
      id: '5',
      name: 'Customer Delight Marathon',
      description: 'Achieved perfect customer satisfaction in 20 interactions',
      challengeType: 'individual',
      status: 'completed',
      difficulty: 'medium',
      goal: {
        type: 'satisfaction_score',
        target: 20,
        current: 20
      },
      rewards: {
        xp: 400,
        badges: ['Customer Champion'],
        items: ['Feedback Master Badge']
      },
      startDate: '2025-01-01',
      endDate: '2025-01-15',
      participants: 18,
      category: 'Customer Success'
    }
  ];

  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.goal.current / challenge.goal.target) * 100, 100);
  };

  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => new Set([...prev, challengeId]));
  };

  const handleLeaveChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => {
      const updated = new Set(prev);
      updated.delete(challengeId);
      return updated;
    });
  };

  const filteredChallenges = challenges.filter(challenge => challenge.status === selectedTab);

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
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Challenges</span>
            </h1>
            <p className="text-gray-300">Push your limits and compete for epic rewards</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Challenge
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-1">
          {[
            { key: 'active', label: 'Active', icon: Play },
            { key: 'upcoming', label: 'Upcoming', icon: Calendar },
            { key: 'completed', label: 'Completed', icon: CheckCircle }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                selectedTab === tab.key
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Challenge Grid */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredChallenges.map((challenge, index) => {
          const difficultyConfig = DIFFICULTY_CONFIG[challenge.difficulty];
          const progressPercentage = getProgressPercentage(challenge);
          const isJoined = joinedChallenges.has(challenge.id);
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedChallenge(challenge)}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${difficultyConfig.color} rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
              
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 transform group-hover:scale-105">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${challenge.status === 'active' ? 'bg-green-400' : challenge.status === 'upcoming' ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                    <span className={`text-xs font-medium ${challenge.challengeType === 'team' ? 'text-blue-300' : 'text-purple-300'}`}>
                      {challenge.challengeType.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${difficultyConfig.textColor}`}>
                      {difficultyConfig.icon}
                    </span>
                    {isJoined && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Challenge Info */}
                <h3 className="text-lg font-semibold text-white mb-2">{challenge.name}</h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{challenge.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {challenge.goal.current}/{challenge.goal.target}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${difficultyConfig.color} relative`}
                    >
                      {progressPercentage > 80 && (
                        <motion.div
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/30 w-1/4"
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  {progressPercentage >= 100 && challenge.status === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  )}
                </div>

                {/* Rewards Preview */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300">{challenge.rewards.xp} XP</span>
                    {challenge.rewards.badges && (
                      <>
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-300">{challenge.rewards.badges.length} Badge{challenge.rewards.badges.length > 1 ? 's' : ''}</span>
                      </>
                    )}
                    {challenge.rewards.items && (
                      <>
                        <Gift className="w-4 h-4 text-green-400" />
                        <span className="text-green-300">{challenge.rewards.items.length} Item{challenge.rewards.items.length > 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Time and Participants */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  {challenge.timeRemaining && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{challenge.timeRemaining}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>
                      {challenge.participants}
                      {challenge.maxParticipants && `/${challenge.maxParticipants}`}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex space-x-2">
                  {challenge.status === 'active' && (
                    <>
                      {isJoined ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeaveChallenge(challenge.id);
                          }}
                          className="flex-1 py-2 px-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium hover:bg-red-500/30 transition-colors"
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinChallenge(challenge.id);
                          }}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white text-sm font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Join Challenge
                        </button>
                      )}
                    </>
                  )}
                  
                  {challenge.status === 'upcoming' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle set reminder
                      }}
                      className="flex-1 py-2 px-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm font-medium hover:bg-yellow-500/30 transition-colors"
                    >
                      Set Reminder
                    </button>
                  )}
                  
                  {challenge.status === 'completed' && (
                    <div className="flex-1 py-2 px-4 bg-gray-500/20 border border-gray-500/30 rounded-lg text-gray-300 text-sm font-medium text-center">
                      Completed
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChallenge(challenge);
                    }}
                    className="py-2 px-4 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full relative border border-white/20 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedChallenge(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>

              {/* Challenge Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${selectedChallenge.status === 'active' ? 'bg-green-400' : selectedChallenge.status === 'upcoming' ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                  <span className={`text-sm font-medium ${selectedChallenge.challengeType === 'team' ? 'text-blue-300' : 'text-purple-300'}`}>
                    {selectedChallenge.challengeType.toUpperCase()} CHALLENGE
                  </span>
                  <span className={`text-sm ${DIFFICULTY_CONFIG[selectedChallenge.difficulty].textColor}`}>
                    {DIFFICULTY_CONFIG[selectedChallenge.difficulty].label.toUpperCase()}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3">{selectedChallenge.name}</h2>
                <p className="text-gray-300 text-lg">{selectedChallenge.description}</p>
              </div>

              {/* Progress Section */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">Progress</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Current Progress</span>
                  <span className="text-white font-medium">
                    {selectedChallenge.goal.current}/{selectedChallenge.goal.target}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(selectedChallenge)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${DIFFICULTY_CONFIG[selectedChallenge.difficulty].color} rounded-full`}
                  />
                </div>
                
                <div className="text-center text-sm text-gray-400">
                  {Math.round(getProgressPercentage(selectedChallenge))}% Complete
                </div>
              </div>

              {/* Rewards Section */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{selectedChallenge.rewards.xp}</div>
                    <div className="text-sm text-gray-400">XP Points</div>
                  </div>
                  
                  {selectedChallenge.rewards.badges && (
                    <div className="text-center">
                      <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{selectedChallenge.rewards.badges.length}</div>
                      <div className="text-sm text-gray-400">Badge{selectedChallenge.rewards.badges.length > 1 ? 's' : ''}</div>
                    </div>
                  )}
                  
                  {selectedChallenge.rewards.items && (
                    <div className="text-center">
                      <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{selectedChallenge.rewards.items.length}</div>
                      <div className="text-sm text-gray-400">Special Item{selectedChallenge.rewards.items.length > 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>
                
                {/* Detailed Rewards */}
                {selectedChallenge.rewards.badges && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Badges to Unlock:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChallenge.rewards.badges.map((badge, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-300 text-xs">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedChallenge.rewards.items && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Items to Receive:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChallenge.rewards.items.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-300 text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Challenge Details */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-medium text-white mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Start Date:</span>
                      <span className="text-white">{new Date(selectedChallenge.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">End Date:</span>
                      <span className="text-white">{new Date(selectedChallenge.endDate).toLocaleDateString()}</span>
                    </div>
                    {selectedChallenge.timeRemaining && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time Left:</span>
                        <span className="text-orange-300">{selectedChallenge.timeRemaining}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-medium text-white mb-2">Participants</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current:</span>
                      <span className="text-white">{selectedChallenge.participants}</span>
                    </div>
                    {selectedChallenge.maxParticipants && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Maximum:</span>
                        <span className="text-white">{selectedChallenge.maxParticipants}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white capitalize">{selectedChallenge.challengeType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {selectedChallenge.status === 'active' && (
                  <>
                    {joinedChallenges.has(selectedChallenge.id) ? (
                      <button
                        onClick={() => {
                          handleLeaveChallenge(selectedChallenge.id);
                          setSelectedChallenge(null);
                        }}
                        className="flex-1 py-3 px-6 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 font-medium hover:bg-red-500/30 transition-colors"
                      >
                        Leave Challenge
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleJoinChallenge(selectedChallenge.id);
                          setSelectedChallenge(null);
                        }}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Join Challenge
                      </button>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="py-3 px-6 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NextGenChallenges;