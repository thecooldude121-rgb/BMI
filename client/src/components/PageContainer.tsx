// Clean page container for consistent layout
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const PageContainer = ({ children, title, subtitle, className = '' }: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {(title || subtitle) && (
        <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {title && (
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;