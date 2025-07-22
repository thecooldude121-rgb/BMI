import { Target, TrendingUp, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SalesTarget {
  id: string;
  targetType: string;
  targetValue: string;
  currentValue: string;
  targetPeriod: string;
  isActive: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  value: string;
  achievedAt: string;
}

interface ProgressWidgetProps {
  userId: string;
  showTitle?: boolean;
}

const ProgressWidget: React.FC<ProgressWidgetProps> = ({ 
  userId, 
  showTitle = true 
}) => {
  const { data: targets = [], isLoading: targetsLoading } = useQuery<SalesTarget[]>({
    queryKey: ['/api/user', userId, 'targets'],
  });

  const { data: achievements = [], isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/user', userId, 'achievements'],
  });

  const { data: pointsData, isLoading: pointsLoading } = useQuery<{ points: any[], totalPoints: number }>({
    queryKey: ['/api/user', userId, 'points'],
  });

  const isLoading = targetsLoading || achievementsLoading || pointsLoading;

  const activeTarget = Array.isArray(targets) ? targets.find((t: SalesTarget) => t.isActive) : null;
  const recentAchievements = Array.isArray(achievements) ? achievements.slice(0, 3) : [];

  const getProgressPercentage = (current: string, target: string) => {
    const currentNum = parseFloat(current);
    const targetNum = parseFloat(target);
    return targetNum > 0 ? Math.min((currentNum / targetNum) * 100, 100) : 0;
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(parseFloat(value));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {showTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Progress</h3>
        )}
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-28 mb-2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalPoints = pointsData?.totalPoints || 0;
  const progressPercentage = activeTarget ? getProgressPercentage(activeTarget.currentValue, activeTarget.targetValue) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Progress</h3>
      )}
      
      <div className="space-y-6">
        {/* Sales Target Progress */}
        {activeTarget ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {activeTarget.targetType.charAt(0).toUpperCase() + activeTarget.targetType.slice(1)} Target
                </span>
              </div>
              <span className="text-xs text-gray-500">{activeTarget.targetPeriod}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {formatCurrency(activeTarget.currentValue)} / {formatCurrency(activeTarget.targetValue)}
              </span>
              <span className="font-medium text-gray-900">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No active sales targets</p>
          </div>
        )}

        {/* Points Summary */}
        <div>
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Total Points</span>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-800">{totalPoints}</div>
            <div className="text-sm text-green-600">Lifetime points earned</div>
          </div>
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <Calendar className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Recent Achievements</span>
            </div>
            <div className="space-y-2">
              {recentAchievements.map((achievement: Achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3"
                >
                  <div className="text-sm font-medium text-purple-900">
                    {achievement.title}
                  </div>
                  <div className="text-xs text-purple-700 mt-1">
                    {achievement.description}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {new Date(achievement.achievedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-900 mb-1">
            🚀 Keep it up!
          </div>
          <div className="text-xs text-blue-700">
            {progressPercentage > 75 
              ? "You're crushing your targets! Great work!"
              : progressPercentage > 50
              ? "More than halfway there! Push forward!"
              : progressPercentage > 25
              ? "Good progress! Keep building momentum!"
              : "Every deal counts! You've got this!"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressWidget;