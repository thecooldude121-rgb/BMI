import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle,
  Download,
  Clock,
  Users
} from "lucide-react";
import type { Meeting } from "@shared/schema";

interface MeetingDetailModalProps {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
}

export default function MeetingDetailModal({ meeting, open, onClose }: MeetingDetailModalProps) {
  if (!meeting) return null;

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown duration";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  const downloadTranscript = () => {
    if (!meeting.transcript) return;
    
    const blob = new Blob([meeting.transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title} - Transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">{meeting.title}</DialogTitle>
              <DialogDescription asChild>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(meeting.createdAt)}
                  </span>
                  <span>{formatDuration(meeting.duration)}</span>
                  {meeting.participants && (
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {meeting.participants.split(',').length} participants
                    </span>
                  )}
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - AI Insights */}
          <div className="w-1/2 border-r">
            <ScrollArea className="h-full p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">AI Insights</h4>
              
              {meeting.status !== "completed" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-gray-400" />
                  </div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    {meeting.status === "processing" ? "Processing Meeting..." : "Processing Failed"}
                  </h5>
                  <p className="text-sm text-gray-500">
                    {meeting.status === "processing" 
                      ? "AI analysis is in progress. This usually takes a few minutes." 
                      : "There was an error processing this meeting."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  {meeting.summary && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Lightbulb className="w-5 h-5 text-blue-500 mr-2" />
                        <h5 className="font-semibold text-gray-900">Summary</h5>
                      </div>
                      <p className="text-sm text-gray-700">{meeting.summary}</p>
                    </div>
                  )}

                  {/* Key Outcomes */}
                  {meeting.keyOutcomes && meeting.keyOutcomes.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <h5 className="font-semibold text-gray-900">Key Outcomes & Next Steps</h5>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {meeting.keyOutcomes.map((outcome, index) => (
                          <li key={index}>• {outcome}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pain Points */}
                  {meeting.painPoints && meeting.painPoints.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <h5 className="font-semibold text-gray-900">Pain Points</h5>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {meeting.painPoints.map((point, index) => (
                          <li key={index}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Objections */}
                  {meeting.objections && meeting.objections.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <HelpCircle className="w-5 h-5 text-yellow-500 mr-2" />
                        <h5 className="font-semibold text-gray-900">Objections & Questions</h5>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {meeting.objections.map((objection, index) => (
                          <li key={index}>• {objection}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Right Panel - Transcript */}
          <div className="w-1/2">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Transcript</h4>
                {meeting.transcript && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTranscript}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100%-80px)] p-6">
              {!meeting.transcript ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {meeting.status === "processing" 
                      ? "Transcript is being generated..." 
                      : "No transcript available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="font-mono text-sm whitespace-pre-wrap text-gray-700">
                    {meeting.transcript}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
