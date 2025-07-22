import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalPoints: number;
}

interface LeaderboardWidgetProps {
  type?: 'all-time' | 'monthly';
  showTitle?: boolean;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ 
  type = 'all-time',
  showTitle = true 
}) => {
  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard', { type }],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-300" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Leaderboard</h3>
        )}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center p-3 rounded-lg bg-gray-100">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🏆 Leaderboard</h3>
          <span className="text-sm text-gray-500 capitalize">{type}</span>
        </div>
      )}
      
      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No leaderboard data yet</p>
            <p className="text-sm">Complete activities to earn points!</p>
          </div>
        ) : (
          leaderboard.map((entry: LeaderboardEntry, index: number) => (
            <div
              key={entry.userId}
              className={`flex items-center p-3 rounded-lg border ${getRankColor(index + 1)}`}
            >
              <div className="flex items-center mr-3">
                <span className="text-sm font-bold text-gray-600 w-6">#{index + 1}</span>
                {getRankIcon(index + 1)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {entry.userName || `User ${entry.userId.slice(0, 8)}`}
                </div>
                <div className="text-xs text-gray-500">
                  {entry.totalPoints} points
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {entry.totalPoints}
                </div>
                <div className="text-xs text-gray-500">pts</div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {leaderboard.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Points earned from deals closed, leads converted, and activities completed
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardWidget;