// 基本的なエンティティ
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string; // Google Places API ID
  category: PlaceCategory;
  memo: string;
  cost?: number;
  rating?: number;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  places: Place[];
  startDate?: Date;
  endDate?: Date;
  isPublic: boolean;
  members: PlanMember[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  // 同期システム用メタデータ
  lastOperationId?: string;
  lastOperatorId?: string;
}

export interface PlanMember {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface Route {
  id: string;
  planId: string;
  fromPlaceId: string;
  toPlaceId: string;
  travelMode: 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING';
  duration?: number; // 秒
  distance?: number; // メートル
  polyline?: string;
  createdAt: Date;
}

export type PlaceCategory = 
  | 'restaurant' 
  | 'hotel' 
  | 'attraction' 
  | 'shopping' 
  | 'transport' 
  | 'other';