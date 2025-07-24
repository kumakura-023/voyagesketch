import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GooglePlace } from '@/types/api';

interface MapState {
  map: google.maps.Map | null;
  isLoaded: boolean;
  center: { lat: number; lng: number };
  zoom: number;
  searchResults: GooglePlace[];
  selectedPlace: GooglePlace | null;
  isSearching: boolean;
  searchError: string | null;
}

interface MapActions {
  setMap: (map: google.maps.Map) => void;
  setLoaded: (loaded: boolean) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setSearchResults: (results: GooglePlace[]) => void;
  setSelectedPlace: (place: GooglePlace | null) => void;
  setSearching: (searching: boolean) => void;
  setSearchError: (error: string | null) => void;
  clearSearch: () => void;
}

export const useMapStore = create<MapState & MapActions>()(
  immer((set) => ({
    // State
    map: null,
    isLoaded: false,
    center: { lat: 35.6762, lng: 139.6503 }, // 東京駅
    zoom: 13,
    searchResults: [],
    selectedPlace: null,
    isSearching: false,
    searchError: null,

    // Actions
    setMap: (map) => set((state) => {
      state.map = map;
    }),

    setLoaded: (loaded) => set((state) => {
      state.isLoaded = loaded;
    }),

    setCenter: (center) => set((state) => {
      state.center = center;
    }),

    setZoom: (zoom) => set((state) => {
      state.zoom = zoom;
    }),

    setSearchResults: (results) => set((state) => {
      state.searchResults = results;
    }),

    setSelectedPlace: (place) => set((state) => {
      state.selectedPlace = place;
    }),

    setSearching: (searching) => set((state) => {
      state.isSearching = searching;
    }),

    setSearchError: (error) => set((state) => {
      state.searchError = error;
    }),

    clearSearch: () => set((state) => {
      state.searchResults = [];
      state.selectedPlace = null;
      state.searchError = null;
    }),
  }))
);