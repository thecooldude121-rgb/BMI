import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import UploadModal from "@/components/upload-modal";
import MeetingDetailModal from "@/components/meeting-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Lightbulb, 
  Mic, 
  Plus,
  ChevronRight,
  Loader2
} from "lucide-react";
import type { Meeting } from "@shared/schema";

export default function Dashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const { data: meetings = [], isLoading: meetingsLoading, refetch: refetchMeetings } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const meetingDate = new Date(date);
    const diffInHours = (now.getTime() - meetingDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return meetingDate.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      case "processing":
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case "failed":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
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
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-600">Manage and analyze your sales meetings</p>
              </div>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Meeting
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "-" : stats?.totalMeetings || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Processed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "-" : stats?.processed || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Processing</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "-" : stats?.processing || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Insights</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "-" : stats?.insights || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Meetings */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Meetings</h3>
            </div>
            
            {meetingsLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading meetings...</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="p-8 text-center">
                <Mic className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h4>
                <p className="text-gray-500 mb-4">Upload your first meeting to get started</p>
                <Button onClick={() => setShowUploadModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Meeting
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Mic className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{meeting.title}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">
                                {formatTimeAgo(meeting.createdAt)}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDuration(meeting.duration)}
                              </span>
                              {meeting.participants && (
                                <span className="text-sm text-gray-500">
                                  {meeting.participants.split(',').length} participants
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {meeting.summary && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {meeting.summary}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="ml-6 flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(meeting.status)}>
                          {getStatusIcon(meeting.status)}
                          <span className="ml-1 capitalize">{meeting.status}</span>
                        </Badge>
                        {meeting.status === "completed" && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {(meeting.keyOutcomes?.length || 0) + 
                               (meeting.painPoints?.length || 0) + 
                               (meeting.objections?.length || 0)} insights
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        {meeting.status === "processing" && (
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full w-2/3"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      <UploadModal 
        open={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          refetchMeetings();
          setShowUploadModal(false);
        }}
      />

      <MeetingDetailModal
        meeting={selectedMeeting}
        open={!!selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </div>
  );
}
