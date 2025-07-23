import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react";
import type { Meeting } from "@shared/schema";

export default function Analytics() {
  const { data: meetings = [], isLoading } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const completedMeetings = meetings.filter(m => m.status === "completed");
  
  // Calculate analytics
  const totalDuration = completedMeetings.reduce((acc, m) => acc + (m.duration || 0), 0);
  const avgDuration = completedMeetings.length > 0 ? Math.round(totalDuration / completedMeetings.length) : 0;
  
  const totalInsights = completedMeetings.reduce((acc, m) => {
    return acc + (m.keyOutcomes?.length || 0) + (m.painPoints?.length || 0) + (m.objections?.length || 0);
  }, 0);
  
  const avgInsights = completedMeetings.length > 0 ? Math.round(totalInsights / completedMeetings.length) : 0;

  // Recent trends (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentMeetings = meetings.filter(m => new Date(m.createdAt) >= sevenDaysAgo);
  const recentCompleted = recentMeetings.filter(m => m.status === "completed");

  // Most common pain points
  const painPointCounts: { [key: string]: number } = {};
  completedMeetings.forEach(m => {
    m.painPoints?.forEach(point => {
      painPointCounts[point] = (painPointCounts[point] || 0) + 1;
    });
  });
  
  const topPainPoints = Object.entries(painPointCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Most common objections
  const objectionCounts: { [key: string]: number } = {};
  completedMeetings.forEach(m => {
    m.objections?.forEach(objection => {
      objectionCounts[objection] = (objectionCounts[objection] || 0) + 1;
    });
  });
  
  const topObjections = Object.entries(objectionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                <p className="text-sm text-gray-600">Insights and trends from your meetings</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{formatDuration(avgDuration)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Insights</p>
                    <p className="text-2xl font-bold text-gray-900">{avgInsights}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{recentMeetings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pain Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Most Common Pain Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPainPoints.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pain points data available</p>
                ) : (
                  <div className="space-y-3">
                    {topPainPoints.map(([point, count], index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm text-gray-700 flex-1 mr-3">{point}</p>
                        <Badge variant="secondary" className="text-xs">
                          {count} {count === 1 ? 'time' : 'times'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Objections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  Most Common Objections
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topObjections.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No objections data available</p>
                ) : (
                  <div className="space-y-3">
                    {topObjections.map(([objection, count], index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm text-gray-700 flex-1 mr-3">{objection}</p>
                        <Badge variant="secondary" className="text-xs">
                          {count} {count === 1 ? 'time' : 'times'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                Recent Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMeetings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-blue-600">{recentMeetings.length}</p>
                      <p className="text-sm text-gray-600">Meetings Uploaded</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-green-600">{recentCompleted.length}</p>
                      <p className="text-sm text-gray-600">Meetings Processed</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-purple-600">
                        {recentCompleted.reduce((acc, m) => {
                          return acc + (m.keyOutcomes?.length || 0) + (m.painPoints?.length || 0) + (m.objections?.length || 0);
                        }, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Insights</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}