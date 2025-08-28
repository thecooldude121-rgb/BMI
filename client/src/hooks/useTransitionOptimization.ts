import { useEffect } from 'react';

// Hook to optimize page transitions with CSS optimizations
export const useTransitionOptimization = () => {
  useEffect(() => {
    // Add CSS optimizations for smoother transitions
    const style = document.createElement('style');
    style.textContent = `
      /* GPU acceleration for smoother transitions */
      * {
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
        -webkit-transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000;
        transform: translate3d(0, 0, 0);
      }

      /* Optimize lazy loading transitions */
      .suspense-fallback {
        will-change: opacity, transform;
        transform: translateZ(0);
      }

      /* Smooth route transitions */
      [data-route-container] {
        will-change: contents;
        contain: layout style paint;
      }

      /* Optimize scroll performance */
      .overflow-auto,
      .overflow-y-auto,
      .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }

      /* Reduce layout thrashing */
      .grid,
      .flex {
        will-change: auto;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

export default useTransitionOptimization;