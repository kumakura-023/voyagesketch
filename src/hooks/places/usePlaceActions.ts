import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePlanStore } from '@/stores/planStore';
import { useAuthStore } from '@/stores/authStore';
import { mapService } from '@/services/api/mapService';
import type { Place, PlaceCategory } from '@/types/core';
import type { GooglePlace } from '@/types/api';

export const usePlaceActions = () => {
  const { currentPlan, addPlace, updatePlace, deletePlace } = usePlanStore();
  const { user } = useAuthStore();

  const addPlaceFromGoogle = useCallback(async (
    googlePlace: GooglePlace,
    category: PlaceCategory = 'other'
  ): Promise<Place | null> => {
    if (!currentPlan || !user) return null;

    try {
      // Google Places APIから詳細情報を取得
      const details = await mapService.getPlaceDetails(googlePlace.place_id);
      
      const newPlace: Place = {
        id: uuidv4(),
        name: googlePlace.name,
        address: googlePlace.formatted_address,
        lat: googlePlace.geometry.location.lat,
        lng: googlePlace.geometry.location.lng,
        placeId: googlePlace.place_id,
        category,
        memo: '',
        rating: googlePlace.rating,
        photos: details.photos?.slice(0, 3).map(photo => 
          photo.getUrl({ maxWidth: 400, maxHeight: 300 })
        ) || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id,
      };

      addPlace(currentPlan.id, newPlace);
      return newPlace;
    } catch (error) {
      console.error('場所の追加に失敗:', error);
      return null;
    }
  }, [currentPlan, user, addPlace]);

  const addPlaceManually = useCallback((
    name: string,
    address: string,
    lat: number,
    lng: number,
    category: PlaceCategory = 'other'
  ): Place | null => {
    if (!currentPlan || !user) return null;

    const newPlace: Place = {
      id: uuidv4(),
      name,
      address,
      lat,
      lng,
      category,
      memo: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
    };

    addPlace(currentPlan.id, newPlace);
    return newPlace;
  }, [currentPlan, user, addPlace]);

  const updatePlaceInfo = useCallback((
    placeId: string,
    updates: Partial<Place>
  ) => {
    if (!currentPlan) return;

    updatePlace(currentPlan.id, placeId, {
      ...updates,
      updatedAt: new Date(),
    });
  }, [currentPlan, updatePlace]);

  const removePlaceFromPlan = useCallback((placeId: string) => {
    if (!currentPlan) return;
    deletePlace(currentPlan.id, placeId);
  }, [currentPlan, deletePlace]);

  return {
    addPlaceFromGoogle,
    addPlaceManually,
    updatePlaceInfo,
    removePlaceFromPlan,
  };
};