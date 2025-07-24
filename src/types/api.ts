import { PlaceCategory, PlanMember } from './core';
import type { Timestamp } from 'firebase/firestore';

// Google Maps API関連
export interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  photos?: google.maps.places.PlacePhoto[];
}

// Firebase関連
export interface FirestorePlan {
  id: string;
  title: string;
  description: string;
  places: FirestorePlace[];
  startDate?: Timestamp;
  endDate?: Timestamp;
  isPublic: boolean;
  members: PlanMember[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  lastOperationId?: string;
  lastOperatorId?: string;
}

export interface FirestorePlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  category: PlaceCategory;
  memo: string;
  cost?: number;
  rating?: number;
  photos?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}