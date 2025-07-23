import React from 'react';
import { Clock, Filter, Eye } from 'lucide-react';

interface ContextIndicatorProps {
  hasContext: boolean;
  contextAge?: number;
  filtersApplied: number;
  viewMode: 'kanban' | 'tile' | 'list';
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

  return null;
};

export default ContextIndicator;