import React from 'react';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import type { GooglePlace } from '@/types/api';

interface SearchResultsProps {
  results: GooglePlace[];
  isLoading: boolean;
  error: string | null;
  onSelectPlace: (place: GooglePlace) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onSelectPlace,
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <p className="text-gray-500 text-sm">検索結果がありません</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
      <div className="py-2">
        {results.map((place) => (
          <button
            key={place.place_id}
            onClick={() => onSelectPlace(place)}
            className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-5 h-5 text-coral-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {place.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {place.formatted_address}
                </p>
                
                {place.rating && (
                  <div className="flex items-center mt-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">
                      {place.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};