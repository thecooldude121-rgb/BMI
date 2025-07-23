import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload, X, Loader2 } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadModal({ open, onClose, onSuccess }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, title, participants }: { file: File; title: string; participants: string }) => {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('title', title);
      formData.append('participants', participants);

      const response = await fetch('/api/meetings/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Meeting uploaded successfully",
        description: "Your meeting is being processed. You'll see updates on the dashboard.",
      });
      resetForm();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setParticipants("");
    setSelectedFile(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidAudioFile(file)) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (MP3, WAV, M4A, MP4)",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidAudioFile(file)) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (MP3, WAV, M4A, MP4)",
          variant: "destructive",
        });
      }
    }
  };

  const isValidAudioFile = (file: File) => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a'];
    const validExtensions = ['.mp3', '.wav', '.mp4', '.m4a'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    return validTypes.includes(file.type) || validExtensions.includes(extension);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a meeting title",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      title: title.trim(),
      participants: participants.trim(),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Meeting</DialogTitle>
          <DialogDescription>
            Upload your meeting audio file to automatically generate transcripts and AI insights.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : selectedFile
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-primary"
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".mp3,.wav,.m4a,.mp4,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CloudUpload className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <CloudUpload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-lg font-medium text-gray-900">Drop your meeting file here</p>
                <p className="text-sm text-gray-500">or click to browse files</p>
                <p className="text-xs text-gray-400">Supports MP3, WAV files up to 100MB</p>
              </div>
            )}
          </div>

          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Discovery Call - Acme Corp"
              required
            />
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <Label htmlFor="participants">Participants (optional)</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="John Doe, Jane Smith"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={uploadMutation.isPending || !selectedFile || !title.trim()}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload & Process"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
