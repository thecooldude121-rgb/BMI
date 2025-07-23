import { useState, useEffect } from 'react';

type ViewMode = 'kanban' | 'tile' | 'list';

export const useViewMode = (storageKey: string, defaultMode: ViewMode = 'tile') => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadViewMode = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        console.log(`🔍 [${storageKey}] Loading view mode from localStorage:`, stored);
        
        if (stored && (stored === 'kanban' || stored === 'tile' || stored === 'list')) {
          console.log(`🔄 [${storageKey}] Setting view mode from localStorage:`, stored);
          setViewMode(stored);
          console.log(`✅ [${storageKey}] Successfully loaded view mode:`, stored);
        } else {
          console.log(`📝 [${storageKey}] No valid stored view mode, using default:`, defaultMode);
          setViewMode(defaultMode);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error(`❌ [${storageKey}] Failed to load view mode:`, error);
        setViewMode(defaultMode);
        setIsLoaded(true);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(loadViewMode);
  }, [storageKey, defaultMode]);

  // Save to localStorage whenever viewMode changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load
    
    try {
      localStorage.setItem(storageKey, viewMode);
      console.log(`💾 [${storageKey}] Saved view mode:`, viewMode);
    } catch (error) {
      console.error(`❌ [${storageKey}] Failed to save view mode:`, error);
    }
  }, [viewMode, storageKey, isLoaded]);

  const toggleViewMode = () => {
    const modes: ViewMode[] = ['kanban', 'tile', 'list'];
    const currentIndex = modes.indexOf(viewMode);
    const newMode = modes[(currentIndex + 1) % modes.length];
    console.log(`🔄 [${storageKey}] Toggling view mode:`, viewMode, '->', newMode);
    setViewMode(newMode);
  };

  const setViewModeWithLogging = (mode: ViewMode) => {
    console.log(`🔄 [${storageKey}] User setting view mode to:`, mode);
    setViewMode(mode);
  };

  return {
    viewMode,
    setViewMode: setViewModeWithLogging,
    toggleViewMode,
    isLoaded
  };
};