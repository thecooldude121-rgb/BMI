import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Clock, Users, FileAudio, CheckCircle, AlertCircle, Loader } from 'lucide-react';

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

interface MeetingDetailModalProps {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
}

export function MeetingDetailModal({ meeting, open, onClose }: MeetingDetailModalProps) {
  if (!meeting) return null;

  const getStatusIcon = () => {
    switch (meeting.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
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

  const downloadTranscript = () => {
    if (!meeting.transcript) return;
    
    const element = document.createElement('a');
    const file = new Blob([meeting.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${meeting.title}-transcript.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 pr-4">
              {meeting.title}
            </DialogTitle>
            <Badge className={`${getStatusColor()}`}>
              <div className="flex items-center gap-1">
                {getStatusIcon()}
                {meeting.status}
              </div>
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meeting Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <FileAudio className="h-4 w-4 mr-2" />
              {meeting.filename}
            </div>
            {meeting.participants && (
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {meeting.participants}
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {formatDuration(meeting.duration)}
            </div>
            <div className="text-gray-600">
              {new Date(meeting.createdAt).toLocaleDateString()}
            </div>
          </div>

          {meeting.status === 'processing' && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-gray-600">Processing meeting audio...</p>
                  <p className="text-sm text-gray-500">This may take a few minutes</p>
                </div>
              </CardContent>
            </Card>
          )}

          {meeting.status === 'failed' && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <p className="text-red-600">Processing failed</p>
                  <p className="text-sm text-gray-500">Please try uploading again</p>
                </div>
              </CardContent>
            </Card>
          )}

          {meeting.status === 'completed' && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {meeting.summary || 'No summary available'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-700">Key Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {meeting.insights?.outcomes?.map((outcome, index) => (
                          <li key={index} className="text-gray-700">{outcome}</li>
                        )) || <li className="text-gray-500">No outcomes identified</li>}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">Action Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {meeting.insights?.actionItems?.map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        )) || <li className="text-gray-500">No action items identified</li>}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-orange-700">Pain Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {meeting.insights?.painPoints?.map((pain, index) => (
                          <li key={index} className="text-gray-700">{pain}</li>
                        )) || <li className="text-gray-500">No pain points identified</li>}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-700">Objections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1">
                        {meeting.insights?.objections?.map((objection, index) => (
                          <li key={index} className="text-gray-700">{objection}</li>
                        )) || <li className="text-gray-500">No objections identified</li>}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="transcript">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Full Transcript</CardTitle>
                    {meeting.transcript && (
                      <Button onClick={downloadTranscript} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {meeting.transcript || 'No transcript available'}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}