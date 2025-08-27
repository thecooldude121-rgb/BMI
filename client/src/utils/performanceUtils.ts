// Performance utility functions
import { startTransition } from 'react';

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function executedFunction(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// Debounce function for input events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

// Batch state updates for better performance
export function batchUpdates(fn: () => void) {
  if (typeof startTransition !== 'undefined') {
    startTransition(fn);
  } else {
    fn();
  }
}

// Virtual scrolling helper
export function calculateVisibleItems(
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  itemCount: number,
  overscan = 3
) {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, itemCount - 1);

  return {
    startIndex: Math.max(0, startIndex - overscan),
    endIndex: Math.min(itemCount - 1, endIndex + overscan),
    visibleCount
  };
}

// Image lazy loading with intersection observer
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Map<HTMLImageElement, string> = new Map();

  constructor(options: IntersectionObserverInit = {}) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: '50px',
          threshold: 0.1,
          ...options
        }
      );
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = this.images.get(img);
        
        if (src) {
          img.src = src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          this.observer?.unobserve(img);
          this.images.delete(img);
        }
      }
    });
  }

  observe(img: HTMLImageElement, src: string) {
    if (this.observer) {
      this.images.set(img, src);
      this.observer.observe(img);
    } else {
      // Fallback for browsers without Intersection Observer
      img.src = src;
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

// Memory usage tracker
export function trackMemoryUsage() {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }
  return null;
}

// Performance timing utilities
export class PerformanceTracker {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  mark(name: string) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.marks.set(name, now);
    return now;
  }

  measure(name: string, startMark: string, endMark?: string) {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : (typeof performance !== 'undefined' ? performance.now() : Date.now());
    
    if (startTime && endTime) {
      const duration = endTime - startTime;
      this.measures.set(name, duration);
      return duration;
    }
    return 0;
  }

  getMeasures() {
    return Object.fromEntries(this.measures);
  }

  clear() {
    this.marks.clear();
    this.measures.clear();
  }
}

export const performanceTracker = new PerformanceTracker();