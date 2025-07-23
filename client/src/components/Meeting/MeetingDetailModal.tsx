import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Calendar, Users, Clock, FileText, Target, AlertTriangle, CheckSquare, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

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
  meeting: Meeting;
  isOpen: boolean;
  onClose: () => void;
}

export function MeetingDetailModal({ meeting, isOpen, onClose }: MeetingDetailModalProps) {
  const handleDownload = () => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl">{meeting.title}</DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(meeting.createdAt), 'MMM d, yyyy')}</span>
                </div>
                {meeting.participants && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{meeting.participants}</span>
                  </div>
                )}
                {meeting.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.round(meeting.duration / 60)} min</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(meeting.status)}>
                {meeting.status}
              </Badge>
              {meeting.status === 'completed' && meeting.transcript && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {meeting.status === 'processing' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold mb-2">Processing Meeting</h3>
                    <p className="text-gray-600">
                      AI is transcribing and analyzing your meeting. This may take a few minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {meeting.status === 'failed' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Processing Failed</h3>
                    <p className="text-gray-600">
                      There was an error processing this meeting. Please try uploading again.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {meeting.status === 'completed' && (
              <>
                {/* Summary */}
                {meeting.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Meeting Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{meeting.summary}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Insights */}
                {meeting.insights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meeting.insights.outcomes.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-base">
                            <Target className="h-4 w-4 text-green-600" />
                            <span>Key Outcomes</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {meeting.insights.outcomes.map((outcome, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {meeting.insights.actionItems.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-base">
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                            <span>Action Items</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {meeting.insights.actionItems.map((item, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {meeting.insights.painPoints.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-base">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span>Pain Points</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {meeting.insights.painPoints.map((point, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {meeting.insights.objections.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-base">
                            <MessageSquare className="h-4 w-4 text-red-600" />
                            <span>Objections</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {meeting.insights.objections.map((objection, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{objection}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Transcript */}
                {meeting.transcript && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Full Transcript</span>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                          {meeting.transcript}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}