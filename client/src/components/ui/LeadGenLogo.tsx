import React from 'react';

interface LeadGenLogoProps {
  size?: number;
  className?: string;
}

const LeadGenLogo: React.FC<LeadGenLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transform hover:scale-110 transition-transform duration-200"
      >
        {/* Modern gradient background */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#f093fb" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffecd2" />
            <stop offset="100%" stopColor="#fcb69f" />
          </linearGradient>
        </defs>
        
        {/* Main circle background */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" className="drop-shadow-lg"/>
        
        {/* Target/Lead generation symbol */}
        <circle cx="20" cy="20" r="12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="20" cy="20" r="4" fill="white" opacity="0.9"/>
        
        {/* Arrow pointing to target */}
        <path 
          d="M8 12L15 19L8 26" 
          stroke="url(#accentGradient)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
          className="drop-shadow-sm"
        />
        
        {/* Connecting lines representing leads */}
        <line x1="28" y1="12" x2="32" y2="8" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="28" y1="20" x2="35" y2="20" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="28" y1="28" x2="32" y2="32" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      </svg>
      
      <div className="flex flex-col">
        <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          LeadGen
        </span>
        <span className="text-xs text-slate-500 -mt-1 font-medium">
          BMI-1
        </span>
      </div>
    </div>
  );
};

export default LeadGenLogo;