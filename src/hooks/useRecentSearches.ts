import { useState, useEffect, useCallback } from 'react';

export interface RecentSearch {
  originCode: string;
  originName: string;
  destinationCode: string;
  destinationName: string;
  timestamp: number;
}

const STORAGE_KEY = 'skyfinder_recent_searches';
const MAX_RECENT = 5;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  const addRecentSearch = useCallback((search: Omit<RecentSearch, 'timestamp'>) => {
    setRecentSearches((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter(
        (s) => !(s.originCode === search.originCode && s.destinationCode === search.destinationCode)
      );

      const newSearch: RecentSearch = {
        ...search,
        timestamp: Date.now(),
      };

      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }

      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
}
