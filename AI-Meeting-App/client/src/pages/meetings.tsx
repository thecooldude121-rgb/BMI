import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Import,
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  Loader2,
  AlertTriangle
} from "lucide-react";
import type { Meeting } from "@shared/schema";
import UploadModal from "@/components/upload-modal";
import MeetingDetailModal from "@/components/meeting-detail-modal";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: string[];
  meetingUrl?: string;
  description?: string;
}

export default function Meetings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const { data: meetings = [], isLoading, refetch } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const { data: upcomingEvents = [], isLoading: calendarLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar/upcoming"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const { data: todaysEvents = [] } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar/today"],
    refetchInterval: 5 * 60 * 1000,
  });

  // Filter meetings based on search and status
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (meeting.participants || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || meeting.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
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
        return <AlertTriangle className="w-3 h-3" />;
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
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
                  <p className="text-sm text-gray-600">Manage your meetings and view insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Import className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Meeting
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search meetings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Meetings</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="your-meetings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="your-meetings">Your Meetings</TabsTrigger>
                <TabsTrigger value="team-meetings">Team Meetings</TabsTrigger>
              </TabsList>

              <TabsContent value="your-meetings" className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredMeetings.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery || filterStatus !== "all" 
                          ? "Try adjusting your search or filters"
                          : "Upload your first meeting recording to get started"
                        }
                      </p>
                      <Button onClick={() => setShowUploadModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Meeting
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredMeetings.map((meeting) => (
                      <Card key={meeting.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 mr-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h3 
                                      className="text-base font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                      onClick={() => setSelectedMeeting(meeting)}
                                    >
                                      {meeting.title}
                                    </h3>
                                    <Badge className={getStatusColor(meeting.status)}>
                                      {getStatusIcon(meeting.status)}
                                      <span className="ml-1 capitalize">{meeting.status}</span>
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      {formatDate(meeting.createdAt)}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {formatTime(meeting.createdAt)}
                                    </span>
                                    {meeting.participants && (
                                      <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {meeting.participants.split(',').map(p => p.trim()).join(', ')}
                                      </span>
                                    )}
                                  </div>

                                  {meeting.summary && meeting.status === "completed" && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                      {meeting.summary}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {meeting.status === "completed" && (
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">Insights</div>
                                  <div className="text-sm font-medium">
                                    {(meeting.keyOutcomes?.length || 0) + 
                                     (meeting.painPoints?.length || 0) + 
                                     (meeting.objections?.length || 0)}
                                  </div>
                                </div>
                              )}
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="team-meetings">
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Team Meetings</h3>
                    <p className="text-gray-500">Team collaboration features coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Upcoming Meetings */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {calendarLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Today</h4>
                      <div className="space-y-3">
                        {todaysEvents.length === 0 ? (
                          <p className="text-sm text-gray-500">No meetings today</p>
                        ) : (
                          todaysEvents.map((event) => (
                            <Card key={event.id} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 text-sm mb-1">
                                      {event.title}
                                    </h5>
                                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                                      <Clock className="w-3 h-3" />
                                      <span>{new Date(event.start).toLocaleTimeString('en-US', { 
                                        hour: 'numeric', 
                                        minute: '2-digit',
                                        hour12: true 
                                      })}</span>
                                    </div>
                                    {event.attendees.length > 0 && (
                                      <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Users className="w-3 h-3 mr-1" />
                                        <span>{event.attendees.length} attendees</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="text-xs">
                                    Meeting
                                  </Badge>
                                  {event.meetingUrl ? (
                                    <Button 
                                      size="sm" 
                                      className="h-7 text-xs"
                                      onClick={() => window.open(event.meetingUrl, '_blank')}
                                    >
                                      <Video className="w-3 h-3 mr-1" />
                                      Join
                                    </Button>
                                  ) : (
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Upcoming</h4>
                      <div className="space-y-3">
                        {upcomingEvents.filter(event => {
                          const eventDate = new Date(event.start);
                          const today = new Date();
                          return eventDate.toDateString() !== today.toDateString();
                        }).slice(0, 5).map((event) => (
                          <Card key={event.id} className="border-l-4 border-l-orange-500">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm mb-1">
                                    {event.title}
                                  </h5>
                                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(event.start).toLocaleDateString()}</span>
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(event.start).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}</span>
                                  </div>
                                  {event.attendees.length > 0 && (
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <Users className="w-3 h-3 mr-1" />
                                      <span>{event.attendees.length} attendees</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  Meeting
                                </Badge>
                                {event.meetingUrl ? (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    onClick={() => window.open(event.meetingUrl, '_blank')}
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Join
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm" className="h-7 text-xs">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {upcomingEvents.length === 0 && (
                          <p className="text-sm text-gray-500">No upcoming meetings</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  See Next 7 days
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <UploadModal 
        open={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          refetch();
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