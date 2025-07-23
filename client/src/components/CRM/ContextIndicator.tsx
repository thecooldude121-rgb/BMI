import React from 'react';
import { Clock, Filter, Eye } from 'lucide-react';

interface ContextIndicatorProps {
  hasContext: boolean;
  contextAge?: number;
  filtersApplied: number;
  viewMode: 'card' | 'list';
}

const ContextIndicator: React.FC<ContextIndicatorProps> = ({ 
  hasContext, 
  contextAge, 
  filtersApplied, 
  viewMode 
}) => {
  if (!hasContext) return null;

  const formatAge = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
      <Clock className="h-3 w-3" />
      <span>Context restored</span>
      {contextAge && (
        <span className="text-blue-500">({formatAge(contextAge)})</span>
      )}
      {filtersApplied > 0 && (
        <div className="flex items-center space-x-1 ml-2">
          <Filter className="h-3 w-3" />
          <span>{filtersApplied} filter{filtersApplied !== 1 ? 's' : ''}</span>
        </div>
      )}
      <div className="flex items-center space-x-1 ml-2">
        <Eye className="h-3 w-3" />
        <span>{viewMode} view</span>
      </div>
    </div>
  );
};

export default ContextIndicator;