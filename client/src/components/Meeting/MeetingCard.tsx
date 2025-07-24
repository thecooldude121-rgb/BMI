import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, FileAudio, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface Meeting {
  id: number;
  title: string;
  filename: string;
  participants?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  duration?: number;
}

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

export function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const getStatusIcon = () => {
    switch (meeting.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Loader className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (meeting.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {meeting.title}
          </CardTitle>
          <Badge className={`ml-2 ${getStatusColor()}`}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              {meeting.status}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FileAudio className="h-4 w-4 mr-2" />
            {meeting.filename}
          </div>
          
          {meeting.participants && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {meeting.participants}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(meeting.createdAt).toLocaleDateString()}</span>
            {meeting.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDuration(meeting.duration)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}