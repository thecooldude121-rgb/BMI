import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SparklineProps {
  dealId: string;
  probability: number;
  dealHealth: string;
  className?: string;
  animated?: boolean;
}

export const DealProgressSparkline: React.FC<SparklineProps> = ({ 
  dealId, 
  probability, 
  dealHealth, 
  className = "",
  animated = true 
}) => {
  const [sparklineData, setSparklineData] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Generate realistic sparkline data based on deal probability and health
  useEffect(() => {
    const generateSparklineData = () => {
      const points = 12; // 12 data points for the sparkline
      const data: number[] = [];
      
      // Base trend based on deal health
      let trendMultiplier = 1;
      if (dealHealth === 'healthy') {
        trendMultiplier = 1.2;
      } else if (dealHealth === 'at_risk') {
        trendMultiplier = 0.8;
      } else if (dealHealth === 'critical') {
        trendMultiplier = 0.6;
      }

      // Generate progressive data points leading to current probability
      const startValue = Math.max(5, probability - 30);
      const endValue = probability;
      
      for (let i = 0; i < points; i++) {
        const progress = i / (points - 1);
        const baseValue = startValue + (endValue - startValue) * progress;
        
        // Add some realistic variance
        const variance = (Math.random() - 0.5) * 10 * trendMultiplier;
        const value = Math.max(0, Math.min(100, baseValue + variance));
        
        data.push(value);
      }
      
      // Ensure the last value matches current probability
      data[data.length - 1] = probability;
      
      return data;
    };

    setSparklineData(generateSparklineData());
    
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [dealId, probability, dealHealth]);

  // Generate SVG path for sparkline
  const generatePath = (data: number[], animated: boolean = false) => {
    if (data.length === 0) return '';
    
    const width = 60;
    const height = 20;
    const padding = 2;
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Color based on deal health and trend
  const getSparklineColor = () => {
    const trend = sparklineData.length > 1 ? 
      sparklineData[sparklineData.length - 1] - sparklineData[sparklineData.length - 2] : 0;
    
    if (dealHealth === 'healthy') {
      return trend >= 0 ? '#10b981' : '#f59e0b'; // green or amber
    } else if (dealHealth === 'at_risk') {
      return trend >= 0 ? '#f59e0b' : '#ef4444'; // amber or red
    } else if (dealHealth === 'critical') {
      return '#ef4444'; // red
    }
    
    return trend >= 0 ? '#3b82f6' : '#6b7280'; // blue or gray
  };

  const sparklineColor = getSparklineColor();
  const path = generatePath(sparklineData);

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <svg 
          width="60" 
          height="20" 
          className="overflow-visible"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
        >
          {/* Background grid lines */}
          <defs>
            <pattern id={`grid-${dealId}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="60" height="20" fill={`url(#grid-${dealId})`} opacity="0.3" />
          
          {/* Sparkline path */}
          {animated ? (
            <motion.path
              d={path}
              fill="none"
              stroke={sparklineColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: isVisible ? 1 : 0, 
                opacity: isVisible ? 1 : 0 
              }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          ) : (
            <path
              d={path}
              fill="none"
              stroke={sparklineColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Data points */}
          {sparklineData.map((value, index) => {
            const width = 60;
            const height = 20;
            const padding = 2;
            const maxValue = Math.max(...sparklineData);
            const minValue = Math.min(...sparklineData);
            const range = maxValue - minValue || 1;
            
            const x = padding + (index / (sparklineData.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
            
            return animated ? (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill={sparklineColor}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isVisible ? 1 : 0, 
                  opacity: isVisible ? 0.8 : 0 
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.8 + index * 0.1,
                  ease: "easeOut" 
                }}
              />
            ) : (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill={sparklineColor}
                opacity="0.8"
              />
            );
          })}
          
          {/* Highlight last point */}
          {sparklineData.length > 0 && (
            (() => {
              const lastValue = sparklineData[sparklineData.length - 1];
              const width = 60;
              const height = 20;
              const padding = 2;
              const maxValue = Math.max(...sparklineData);
              const minValue = Math.min(...sparklineData);
              const range = maxValue - minValue || 1;
              
              const x = width - padding;
              const y = height - padding - ((lastValue - minValue) / range) * (height - 2 * padding);
              
              return animated ? (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill={sparklineColor}
                  stroke="white"
                  strokeWidth="1"
                  initial={{ scale: 0 }}
                  animate={{ scale: isVisible ? 1 : 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 1.5,
                    ease: "easeOut" 
                  }}
                />
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill={sparklineColor}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })()
          )}
        </svg>
      </div>
      
      {/* Trend indicator */}
      {sparklineData.length > 1 && (
        <div className="flex items-center space-x-1">
          {(() => {
            const trend = sparklineData[sparklineData.length - 1] - sparklineData[sparklineData.length - 2];
            const isPositive = trend >= 0;
            
            return (
              <motion.div
                className={`flex items-center space-x-1 text-xs ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 5 }}
                transition={{ duration: 0.3, delay: 2 }}
              >
                <span className={`text-xs ${isPositive ? '↗' : '↘'}`}>
                  {isPositive ? '↗' : '↘'}
                </span>
                <span className="font-medium">
                  {Math.abs(trend).toFixed(0)}%
                </span>
              </motion.div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default DealProgressSparkline;