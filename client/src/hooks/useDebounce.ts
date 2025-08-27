// Debounce hook for performance optimization
import { useState, useEffect, useMemo } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Enhanced debounce hook with cancel functionality
export function useAdvancedDebounce<T>(
  value: T, 
  delay: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
) {
  const { leading = false, trailing = true, maxWait } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [lastCallTime, setLastCallTime] = useState<number>(0);

  const cancel = useMemo(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let maxTimeoutId: NodeJS.Timeout | null = null;

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (maxTimeoutId) clearTimeout(maxTimeoutId);
    };
  }, []);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    const updateValue = () => {
      setDebouncedValue(value);
      setLastCallTime(now);
    };

    // Leading edge execution
    if (leading && timeSinceLastCall >= delay) {
      updateValue();
      return;
    }

    // Setup trailing execution
    const timeoutId = setTimeout(() => {
      if (trailing) {
        updateValue();
      }
    }, delay);

    // Setup max wait timeout
    let maxTimeoutId: NodeJS.Timeout | null = null;
    if (maxWait && timeSinceLastCall + delay > maxWait) {
      maxTimeoutId = setTimeout(updateValue, maxWait - timeSinceLastCall);
    }

    return () => {
      clearTimeout(timeoutId);
      if (maxTimeoutId) clearTimeout(maxTimeoutId);
    };
  }, [value, delay, leading, trailing, maxWait, lastCallTime]);

  return { debouncedValue, cancel };
}

export default useDebounce;