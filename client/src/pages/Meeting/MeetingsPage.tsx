import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeetingUploadModal } from '../../components/Meeting/MeetingUploadModal';
import { MeetingCard } from '../../components/Meeting/MeetingCard';
import { MeetingDetailModal } from '../../components/Meeting/MeetingDetailModal';
import { Plus, Search, FileAudio, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Meeting {
  id: number;
  title: string;
  filename: string;
  participants?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  duration?: number;
  transcript?: string;
  summary?: string;
  insights?: {
    outcomes: string[];
    actionItems: string[];
    painPoints: string[];
    objections: string[];
  };
}

export default function MeetingsPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['/api/meetings'],
    queryFn: async () => {
      const response = await fetch('/api/meetings');
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      return response.json();
    },
  });

  const filteredMeetings = meetings.filter((meeting: Meeting) =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (meeting.participants && meeting.participants.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: meetings.length,
    processing: meetings.filter((m: Meeting) => m.status === 'processing').length,
    completed: meetings.filter((m: Meeting) => m.status === 'completed').length,
    failed: meetings.filter((m: Meeting) => m.status === 'failed').length,
  };

  const handleDownload = (meeting: Meeting) => {
    if (meeting.transcript) {
      const blob = new Blob([meeting.transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meeting.title}-transcript.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Intelligence</h1>
          <p className="text-gray-600">AI-powered meeting transcription and analysis</p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Meeting
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <FileAudio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search meetings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Meetings Grid */}
      {filteredMeetings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileAudio className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {meetings.length === 0 ? 'No meetings yet' : 'No meetings found'}
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {meetings.length === 0 
                ? 'Upload your first meeting recording to get started with AI-powered transcription and analysis.'
                : 'Try adjusting your search terms to find specific meetings.'
              }
            </p>
            {meetings.length === 0 && (
              <Button onClick={() => setUploadModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload First Meeting
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting: Meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onViewDetails={setSelectedMeeting}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <MeetingUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
      
      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          isOpen={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
}