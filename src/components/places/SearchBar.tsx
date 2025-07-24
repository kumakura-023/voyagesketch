import React, { useState, useCallback, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useMapStore } from '@/stores/mapStore';
import { mapService } from '@/services/api/mapService';
import { SearchResults } from './SearchResults';
import { useDebounce } from '@/hooks/shared/useDebounce';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const {
    center,
    searchResults,
    isSearching,
    searchError,
    setSearchResults,
    setSearching,
    setSearchError,
    clearSearch,
  } = useMapStore();

  // デバウンス検索
  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      clearSearch();
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const results = await mapService.searchPlaces(
        searchQuery,
        new google.maps.LatLng(center.lat, center.lng)
      );
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : '検索エラーが発生しました');
    } finally {
      setSearching(false);
    }
  }, [center, setSearching, setSearchError, setSearchResults, clearSearch]);

  // デバウンス検索の実行
  React.useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
    setShowResults(false);
  };

  const handleSelectPlace = (place: any) => {
    setQuery(place.name);
    setShowResults(false);
  };

  // 外部クリックでの結果非表示
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="場所を検索..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                   bg-white shadow-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500
                   text-sm placeholder-gray-500"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 検索結果 */}
      {showResults && (
        <SearchResults
          results={searchResults}
          isLoading={isSearching}
          error={searchError}
          onSelectPlace={handleSelectPlace}
        />
      )}
    </div>
  );
};