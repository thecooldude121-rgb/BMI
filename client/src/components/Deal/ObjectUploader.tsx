import { useState } from "react";
import { Upload, File, X } from "lucide-react";

interface ObjectUploaderProps {
  dealId: string;
  onUploadComplete?: (file: any) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  children?: React.ReactNode;
}

export function ObjectUploader({
  dealId,
  onUploadComplete,
  maxFileSize = 10,
  children
}: ObjectUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic file size validation
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      alert(`File must be smaller than ${maxFileSize}MB`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dealId', dealId);

      // Upload file
      const response = await fetch('/api/deal-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUploadComplete?.(result);
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${dealId}`}
        />
        <label
          htmlFor={`file-upload-${dealId}`}
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select File
        </label>
        
        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>
      
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <File className="w-4 h-4" />
            <span className="text-sm">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / (1024 * 1024)).toFixed(1)}MB)
            </span>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}