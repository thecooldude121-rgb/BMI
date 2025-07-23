import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileAudio, Calendar, Users, Download, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

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

interface MeetingCardProps {
  meeting: Meeting;
  onViewDetails: (meeting: Meeting) => void;
  onDownload?: (meeting: Meeting) => void;
}

export function MeetingCard({ meeting, onViewDetails, onDownload }: MeetingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-3 w-3 animate-spin" />;
      default: return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileAudio className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg line-clamp-1">{meeting.title}</h3>
          </div>
          <Badge className={`${getStatusColor(meeting.status)} flex items-center space-x-1`}>
            {getStatusIcon(meeting.status)}
            <span className="capitalize">{meeting.status}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(meeting.createdAt), 'MMM d, yyyy')}</span>
            <span className="text-gray-400">•</span>
            <span>{formatDistanceToNow(new Date(meeting.createdAt), { addSuffix: true })}</span>
          </div>
          
          {meeting.participants && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="line-clamp-1">{meeting.participants}</span>
            </div>
          )}
          
          {meeting.duration && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{Math.round(meeting.duration / 60)} minutes</span>
            </div>
          )}
        </div>

        {meeting.status === 'completed' && meeting.insights && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="text-sm">
              <div className="font-medium text-gray-700">Key Insights:</div>
              <div className="text-gray-600 mt-1">
                {meeting.insights.outcomes.length > 0 && (
                  <span>{meeting.insights.outcomes.length} outcomes, </span>
                )}
                {meeting.insights.actionItems.length > 0 && (
                  <span>{meeting.insights.actionItems.length} action items, </span>
                )}
                {meeting.insights.painPoints.length > 0 && (
                  <span>{meeting.insights.painPoints.length} pain points</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(meeting)}
            disabled={meeting.status === 'processing'}
          >
            <Eye className="h-4 w-4 mr-1" />
            {meeting.status === 'processing' ? 'Processing...' : 'View Details'}
          </Button>
          
          {meeting.status === 'completed' && onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(meeting)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}