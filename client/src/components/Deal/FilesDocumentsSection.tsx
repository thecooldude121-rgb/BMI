import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import SignatureCanvas from 'react-signature-canvas';
import Modal from 'react-modal';
import { 
  Upload, Download, Eye, Share, Edit3, Trash2, Tag, Filter, Search, 
  FileText, Image, File, Video, Archive, Clock, Shield, Users, 
  MessageSquare, PenTool, Star, CheckCircle, XCircle, MoreVertical,
  Calendar, User, AlertCircle, ChevronDown, ChevronRight, Settings,
  Plus, X, Move, RotateCcw, Copy, ExternalLink, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
// Toast functionality replaced with simple alerts
// Schema imports will be available when backend is ready
// import { DealDocument, DocumentComment, DocumentVersion } from '@shared/schema';

// Temporary interfaces until schema is integrated
interface DealDocument {
  id: string;
  name: string;
  mimeType: string;
  fileSize: number;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  signatureStatus?: 'pending' | 'signed' | 'rejected';
  tags?: string[];
  category?: string;
}

interface DocumentComment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
}

interface DocumentVersion {
  id: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  changeDescription?: string;
}

// Interface definitions
interface FileUploadProps {
  dealId: string;
  onUploadComplete?: (document: DealDocument) => void;
}

interface DocumentPreviewProps {
  document: DealDocument;
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentPermission {
  userId: string;
  userName: string;
  permission: 'read' | 'edit' | 'download';
}

interface FileFilter {
  category?: string;
  type?: string;
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  uploader?: string;
  signatureStatus?: string;
}

// File type detection utility
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="h-5 w-5" />;
  if (mimeType.startsWith('video/')) return <Video className="h-5 w-5" />;
  if (mimeType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  if (mimeType.includes('document') || mimeType.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileText className="h-5 w-5 text-green-500" />;
  return <File className="h-5 w-5" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Drag and Drop Upload Component
const FileUploadArea: React.FC<FileUploadProps> = ({ dealId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Toast replaced with alerts for now

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dealId', dealId);
        formData.append('name', file.name);
        formData.append('type', file.type.split('/')[1]);
        formData.append('category', 'general');
        
        return apiRequest('/api/deal-documents/upload', {
          method: 'POST',
          body: formData,
        });
      });
      
      return Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      results.forEach((document) => {
        onUploadComplete?.(document);
      });
      alert(`Files uploaded successfully: ${results.length} file(s) uploaded`);
      setUploading(false);
      setUploadProgress(0);
    },
    onError: (error) => {
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
      setUploadProgress(0);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploading(true);
      uploadMutation.mutate(acceptedFiles);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'text/*': ['.txt', '.csv'],
    },
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label="File upload area"
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">Uploading files...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500">
              or <span className="text-blue-600 font-medium">browse files</span>
            </p>
            <p className="text-xs text-gray-400">
              Supports PDF, Word, Excel, PowerPoint, Images, Videos (max 50MB each)
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
};

// Document Preview Component
const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, isOpen, onClose }) => {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [signatureCanvas, setSignatureCanvas] = useState<SignatureCanvas | null>(null);

  const { data: documentComments } = useQuery({
    queryKey: [`/api/document-comments/${document.id}`],
    enabled: isOpen,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      return apiRequest('/api/document-comments', {
        method: 'POST',
        body: JSON.stringify({
          documentId: document.id,
          comment,
        }),
      });
    },
    onSuccess: () => {
      setNewComment('');
      // Refetch comments
    },
  });

  const renderPreview = () => {
    if (document.mimeType.startsWith('image/')) {
      return (
        <img
          src={document.fileUrl}
          alt={document.name}
          className="max-w-full max-h-full object-contain"
        />
      );
    }
    
    if (document.mimeType.includes('pdf')) {
      return (
        <iframe
          src={document.fileUrl}
          className="w-full h-full border-0"
          title={document.name}
        />
      );
    }
    
    // For other file types, show file info
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        {getFileIcon(document.mimeType)}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">{document.name}</h3>
          <p className="text-sm text-gray-500">
            {formatFileSize(document.fileSize)} • {document.mimeType}
          </p>
          <button
            onClick={() => window.open(document.fileUrl, '_blank')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in new tab
          </button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      closeTimeoutMS={200}
      ariaHideApp={false}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getFileIcon(document.mimeType)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.name}</h2>
              <p className="text-sm text-gray-500">
                Version {document.version} • {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => saveAs(document.fileUrl, document.name)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSignature(!showSignature)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign Document"
            >
              <PenTool className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 p-4">
            {renderPreview()}
          </div>

          {/* Sidebar for Comments */}
          <div className="w-80 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {documentComments?.map((comment: DocumentComment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.userId}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), 'MMM dd, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={() => addCommentMutation.mutate(newComment)}
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Modal */}
        {showSignature && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Digital Signature</h3>
              <div className="border border-gray-300 rounded-lg">
                <SignatureCanvas
                  ref={(ref) => setSignatureCanvas(ref)}
                  canvasProps={{
                    width: 400,
                    height: 200,
                    className: 'signature-canvas'
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => signatureCanvas?.clear()}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowSignature(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save signature logic here
                      setShowSignature(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Modal>
  );
};

// Document Card Component
interface DocumentCardProps {
  document: DealDocument;
  onPreview: (document: DealDocument) => void;
  onDelete: (document: DealDocument) => void;
  onShare: (document: DealDocument) => void;
  onRename: (document: DealDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPreview,
  onDelete,
  onShare,
  onRename,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'signed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 group"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getFileIcon(document.mimeType)}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {document.name}
              </h3>
              <p className="text-xs text-gray-500">
                {formatFileSize(document.fileSize)} • Version {document.version}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]"
                >
                  <button
                    onClick={() => {
                      onPreview(document);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      saveAs(document.fileUrl, document.name);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      onShare(document);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      onRename(document);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Rename
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onDelete(document);
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tags */}
        {document.tags && Array.isArray(document.tags) && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {document.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Status */}
        {document.signatureStatus && (
          <div className="mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.signatureStatus)}`}>
              {document.signatureStatus === 'signed' && <CheckCircle className="h-3 w-3 mr-1" />}
              {document.signatureStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
              {document.signatureStatus === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
              {document.signatureStatus.charAt(0).toUpperCase() + document.signatureStatus.slice(1)}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{document.uploadedBy}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(document.createdAt), 'MMM dd')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Files & Documents Section Component
interface FilesDocumentsSectionProps {
  dealId: string;
}

const FilesDocumentsSection: React.FC<FilesDocumentsSectionProps> = ({ dealId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<DealDocument | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToAction, setDocumentToAction] = useState<DealDocument | null>(null);

  const queryClient = useQueryClient();
  // Toast replaced with alerts for now

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: [`/api/deal-documents/${dealId}`],
    select: (data) => data || [],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return apiRequest(`/api/deal-documents/${documentId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/deal-documents/${dealId}`] });
      alert("Document deleted: The document has been successfully deleted.");
      setShowDeleteModal(false);
      setDocumentToAction(null);
    },
    onError: (error) => {
      alert(`Delete failed: ${error.message}`);
    },
  });

  // Filter documents
  const filteredDocuments = documents.filter((doc: DealDocument) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Categories and types for filters
  const categories = ['all', 'legal', 'financial', 'technical', 'marketing', 'sales'];
  const types = ['all', 'contract', 'proposal', 'invoice', 'presentation', 'quote', 'nda'];

  const handleUploadComplete = (document: DealDocument) => {
    queryClient.invalidateQueries({ queryKey: [`/api/deal-documents/${dealId}`] });
  };

  const handlePreview = (document: DealDocument) => {
    setSelectedDocument(document);
  };

  const handleShare = (document: DealDocument) => {
    setDocumentToAction(document);
    setShowShareModal(true);
  };

  const handleRename = (document: DealDocument) => {
    setDocumentToAction(document);
    setShowRenameModal(true);
  };

  const handleDelete = (document: DealDocument) => {
    setDocumentToAction(document);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Files & Documents</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage deal documents, contracts, and files with advanced features
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <FileUploadArea dealId={dealId} onUploadComplete={handleUploadComplete} />

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-4 w-4 mr-2 inline" />
              Filters
            </button>

            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <div className="grid grid-cols-2 gap-1 h-3 w-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-current rounded-sm"></div>
                  ))}
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <div className="space-y-1 h-3 w-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-current h-0.5 w-full rounded-sm"></div>
                  ))}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedType('all');
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Documents Display */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documents.length === 0 ? 'No documents yet' : 'No documents match your filters'}
            </h3>
            <p className="text-gray-500 mb-4">
              {documents.length === 0 
                ? 'Upload your first document to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {documents.length === 0 && (
              <button
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          }>
            <AnimatePresence>
              {filteredDocuments.map((document: DealDocument) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onPreview={handlePreview}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onRename={handleRename}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && documentToAction && (
        <Modal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          ariaHideApp={false}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Document
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete "{documentToAction.name}"? 
              This will permanently remove the document and all its versions.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(documentToAction.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </Modal>
      )}
    </div>
  );
};

export default FilesDocumentsSection;