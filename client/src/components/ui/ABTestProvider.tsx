import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';

interface ABTestConfig {
  testId: string;
  userId: string;
  variant: 'A' | 'B';
  config: Record<string, any>;
}

interface ABTestContextType {
  getVariant: (testId: string) => 'A' | 'B';
  getConfig: (testId: string) => Record<string, any>;
  trackConversion: (testId: string, event: string, metadata?: any) => void;
  isLoading: boolean;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
};

interface ABTestProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const ABTestProvider: React.FC<ABTestProviderProps> = ({ 
  children, 
  userId = 'anonymous' 
}) => {
  const [tests, setTests] = useState<Map<string, ABTestConfig>>(new Map());

  const getVariant = (testId: string): 'A' | 'B' => {
    return tests.get(testId)?.variant || 'A';
  };

  const getConfig = (testId: string): Record<string, any> => {
    return tests.get(testId)?.config || {};
  };

  const trackConversion = async (testId: string, event: string, metadata: any = {}) => {
    const variant = getVariant(testId);
    
    try {
      await apiRequest(`/api/ab-test/${testId}/convert`, {
        method: 'POST',
        body: JSON.stringify({
          userId,
          variant,
          event,
          metadata
        })
      });
      
      console.log(`🎯 A/B Test Conversion: ${testId} - ${variant} - ${event}`);
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  };

  const loadTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/ab-test/${testId}?userId=${userId}`);
      const testConfig = await response.json();
      
      setTests(prev => new Map(prev).set(testId, testConfig));
      
      return testConfig;
    } catch (error) {
      console.error(`Failed to load A/B test ${testId}:`, error);
      // Return default variant on error
      return { testId, userId, variant: 'A', config: {} };
    }
  };

  // Preload common tests
  useEffect(() => {
    const commonTests = ['theme-test', 'onboarding-test', 'sync-button-test'];
    
    Promise.all(commonTests.map(testId => loadTest(testId)))
      .then(() => console.log('📊 A/B Tests loaded successfully'))
      .catch(error => console.error('Failed to load A/B tests:', error));
  }, [userId]);

  const value: ABTestContextType = {
    getVariant,
    getConfig,
    trackConversion,
    isLoading: false
  };

  return (
    <ABTestContext.Provider value={value}>
      {children}
    </ABTestContext.Provider>
  );
};

// Hook for specific test with automatic loading
export const useABTestVariant = (testId: string) => {
  const { getVariant, getConfig, trackConversion } = useABTest();
  const [isLoaded, setIsLoaded] = useState(false);

  const variant = getVariant(testId);
  const config = getConfig(testId);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [testId, isLoaded]);

  return {
    variant,
    config,
    trackConversion: (event: string, metadata?: any) => trackConversion(testId, event, metadata),
    isVariantB: variant === 'B'
  };
};