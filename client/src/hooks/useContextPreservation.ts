import { useState, useEffect, useCallback } from 'react';

interface FilterState {
  searchTerm: string;
  filters: Record<string, string>;
  sortBy: string;
  viewMode: 'kanban' | 'tile' | 'list';
  selectedItems: string[];
  isSelectionMode: boolean;
}

interface ScrollState {
  scrollTop: number;
  scrollLeft: number;
}

interface RouteContext {
  filters: FilterState;
  scroll: ScrollState;
  timestamp: number;
}

const CONTEXT_STORAGE_PREFIX = 'crm_context_';
const CONTEXT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export const useContextPreservation = (routeKey: string) => {
  const storageKey = `${CONTEXT_STORAGE_PREFIX}${routeKey}`;
  
  const [context, setContext] = useState<RouteContext | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load context on mount
  useEffect(() => {
    const loadContext = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedContext: RouteContext = JSON.parse(stored);
          const now = Date.now();
          
          // Check if context has expired
          if (now - parsedContext.timestamp < CONTEXT_EXPIRY_MS) {
            console.log(`🔄 [Context] Restored context for ${routeKey}:`, parsedContext);
            setContext(parsedContext);
          } else {
            console.log(`⏰ [Context] Context expired for ${routeKey}, clearing`);
            localStorage.removeItem(storageKey);
          }
        }
      } catch (error) {
        console.error(`❌ [Context] Failed to load context for ${routeKey}:`, error);
        localStorage.removeItem(storageKey);
      }
      setIsLoaded(true);
    };

    requestAnimationFrame(loadContext);
  }, [routeKey, storageKey]);

  // Save context
  const saveContext = useCallback((newContext: Partial<RouteContext>) => {
    try {
      const contextToSave: RouteContext = {
        filters: newContext.filters || context?.filters || {
          searchTerm: '',
          filters: {},
          sortBy: 'created',
          viewMode: 'tile',
          selectedItems: [],
          isSelectionMode: false
        },
        scroll: newContext.scroll || context?.scroll || { scrollTop: 0, scrollLeft: 0 },
        timestamp: Date.now()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(contextToSave));
      setContext(contextToSave);
      console.log(`💾 [Context] Saved context for ${routeKey}:`, contextToSave);
    } catch (error) {
      console.error(`❌ [Context] Failed to save context for ${routeKey}:`, error);
    }
  }, [context, routeKey, storageKey]);

  // Save filters
  const saveFilters = useCallback((filters: Partial<FilterState>) => {
    if (!isLoaded) return;
    
    const currentFilters = context?.filters || {
      searchTerm: '',
      filters: {},
      sortBy: 'created',
      viewMode: 'tile',
      selectedItems: [],
      isSelectionMode: false
    };
    
    saveContext({
      filters: { ...currentFilters, ...filters }
    });
  }, [context, isLoaded, saveContext]);

  // Save scroll position
  const saveScrollPosition = useCallback((element: HTMLElement) => {
    if (!isLoaded) return;
    
    saveContext({
      scroll: {
        scrollTop: element.scrollTop,
        scrollLeft: element.scrollLeft
      }
    });
  }, [isLoaded, saveContext]);

  // Restore scroll position
  const restoreScrollPosition = useCallback((element: HTMLElement) => {
    if (context?.scroll) {
      element.scrollTop = context.scroll.scrollTop;
      element.scrollLeft = context.scroll.scrollLeft;
      console.log(`📍 [Context] Restored scroll position for ${routeKey}:`, context.scroll);
    }
  }, [context, routeKey]);

  // Clear context
  const clearContext = useCallback(() => {
    localStorage.removeItem(storageKey);
    setContext(null);
    console.log(`🗑️ [Context] Cleared context for ${routeKey}`);
  }, [routeKey, storageKey]);

  // Auto-save scroll position on scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    // TEMPORARILY DISABLED - Testing interaction conflicts
    return;
    
    const element = event.currentTarget;
    if (element) {
      // Debounce scroll saves
      clearTimeout((window as any)[`scroll_timeout_${routeKey}`]);
      (window as any)[`scroll_timeout_${routeKey}`] = setTimeout(() => {
        saveScrollPosition(element);
      }, 500);
    }
  }, [routeKey, saveScrollPosition]);

  return {
    context,
    isLoaded,
    saveFilters,
    saveScrollPosition,
    restoreScrollPosition,
    clearContext,
    handleScroll
  };
};