import { Award, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points: number;
}

interface UserBadge {
  id: string;
  earnedAt: string;
  progress: number;
  badge: Badge;
}

interface BadgesWidgetProps {
  userId: string;
  showTitle?: boolean;
  maxDisplay?: number;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ 
  userId, 
  showTitle = true,
  maxDisplay = 6 
}) => {
  const { data: userBadges = [], isLoading: userBadgesLoading } = useQuery<UserBadge[]>({
    queryKey: ['/api/user', userId, 'badges'],
  });

  const { data: allBadges = [], isLoading: allBadgesLoading } = useQuery<Badge[]>({
    queryKey: ['/api/badges'],
  });

  const isLoading = userBadgesLoading || allBadgesLoading;

  const earnedBadgeIds = new Set(Array.isArray(userBadges) ? userBadges.map((ub: UserBadge) => ub.badge?.id) : []);
  const availableBadges = Array.isArray(allBadges) ? allBadges.filter((badge: Badge) => !earnedBadgeIds.has(badge.id)) : [];

  const getColorClasses = (color: string, earned: boolean = true) => {
    const opacity = earned ? '' : 'opacity-40';
    switch (color) {
      case 'gold':
        return `bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800 ${opacity}`;
      case 'blue':
        return `bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300 text-blue-800 ${opacity}`;
      case 'green':
        return `bg-gradient-to-br from-green-100 to-emerald-100 border-green-300 text-green-800 ${opacity}`;
      case 'purple':
        return `bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300 text-purple-800 ${opacity}`;
      case 'red':
        return `bg-gradient-to-br from-red-100 to-rose-100 border-red-300 text-red-800 ${opacity}`;
      case 'orange':
        return `bg-gradient-to-br from-orange-100 to-amber-100 border-orange-300 text-orange-800 ${opacity}`;
      case 'indigo':
        return `bg-gradient-to-br from-indigo-100 to-blue-100 border-indigo-300 text-indigo-800 ${opacity}`;
      default:
        return `bg-gradient-to-br from-gray-100 to-slate-100 border-gray-300 text-gray-800 ${opacity}`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏅 Badges</h3>
        )}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-20 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayedEarned = Array.isArray(userBadges) ? userBadges.slice(0, Math.floor(maxDisplay * 0.7)) : [];
  const displayedAvailable = availableBadges.slice(0, maxDisplay - displayedEarned.length);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🏅 Badges</h3>
          <span className="text-sm text-gray-500">{Array.isArray(userBadges) ? userBadges.length : 0} earned</span>
        </div>
      )}
      
      {(!Array.isArray(userBadges) || userBadges.length === 0) && (!Array.isArray(allBadges) || allBadges.length === 0) ? (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No badges available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {/* Earned Badges */}
          {displayedEarned.map((userBadge: UserBadge) => (
            <div
              key={userBadge.id}
              className={`relative p-3 rounded-lg border-2 ${getColorClasses(userBadge.badge.color, true)} transition-all hover:scale-105 cursor-pointer group`}
              title={`${userBadge.badge.name}: ${userBadge.badge.description} (+${userBadge.badge.points} pts)`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{userBadge.badge.icon}</div>
                <div className="text-xs font-medium truncate">{userBadge.badge.name}</div>
                <div className="text-xs opacity-75">+{userBadge.badge.points}pts</div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                <Award className="h-2 w-2 text-white m-0.5" />
              </div>
            </div>
          ))}
          
          {/* Available Badges (Locked) */}
          {displayedAvailable.map((badge: Badge) => (
            <div
              key={badge.id}
              className={`relative p-3 rounded-lg border-2 ${getColorClasses(badge.color, false)} transition-all hover:scale-105 cursor-pointer group`}
              title={`${badge.name}: ${badge.description} (+${badge.points} pts) - Not earned yet`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1 filter grayscale">{badge.icon}</div>
                <div className="text-xs font-medium truncate">{badge.name}</div>
                <div className="text-xs opacity-75">+{badge.points}pts</div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-white">
                <Lock className="h-2 w-2 text-white m-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {Array.isArray(userBadges) && userBadges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Total points from badges: {Array.isArray(userBadges) ? userBadges.reduce((sum: number, ub: UserBadge) => sum + (ub.badge?.points || 0), 0) : 0}
            </p>
            {(Array.isArray(userBadges) ? userBadges.length : 0) + availableBadges.length > maxDisplay && (
              <span className="text-xs text-gray-400">
                +{(Array.isArray(userBadges) ? userBadges.length : 0) + availableBadges.length - maxDisplay} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesWidget;