// Clean layout wrapper for consistent spacing and styling
import React from 'react';

interface CleanLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const CleanLayout = ({ children, className = '' }: CleanLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
      <div className="max-w-full mx-auto">
        <div className="px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CleanLayout;