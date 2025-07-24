import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X } from 'lucide-react';

interface MeetingUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export function MeetingUploadModal({ open, onClose, onUploadComplete }: MeetingUploadModalProps) {
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('title', title);
      formData.append('participants', participants);

      const response = await fetch('/api/meetings/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onUploadComplete();
        onClose();
        setTitle('');
        setParticipants('');
        setFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Meeting Recording</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="participants">Participants</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="John Doe, Jane Smith..."
            />
          </div>

          <div>
            <Label htmlFor="audio">Audio File *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="audio"
                type="file"
                accept=".mp3,.wav,.m4a,.mp4"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="audio" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {file ? file.name : 'Drop audio file here or click to browse'}
                </p>
                <p className="text-xs text-gray-500">
                  Supports MP3, WAV, M4A, MP4 (max 100MB)
                </p>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || !title || uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}