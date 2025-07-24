import React, { useEffect, useRef, useCallback } from 'react';
import { useMapStore } from '@/stores/mapStore';
import { usePlanStore } from '@/stores/planStore';
import { mapService } from '@/services/api/mapService';
import { PlaceMarkers } from './PlaceMarkers';
import { MapControls } from './MapControls';

interface MapProps {
  className?: string;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
}

export const Map: React.FC<MapProps> = ({ className, onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { 
    map, 
    isLoaded, 
    center, 
    zoom,
    setMap, 
    setLoaded,
    setCenter,
    setZoom
  } = useMapStore();
  const { currentPlan } = usePlanStore();

  // マップの初期化
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || map) return;

      try {
        const googleMap = await mapService.initializeMap(mapRef.current, {
          center,
          zoom,
        });

        setMap(googleMap);
        setLoaded(true);

        // イベントリスナーの設定
        googleMap.addListener('center_changed', () => {
          const newCenter = googleMap.getCenter();
          if (newCenter) {
            setCenter({
              lat: newCenter.lat(),
              lng: newCenter.lng(),
            });
          }
        });

        googleMap.addListener('zoom_changed', () => {
          setZoom(googleMap.getZoom() || 13);
        });

        if (onMapClick) {
          googleMap.addListener('click', onMapClick);
        }

      } catch (error) {
        console.error('マップの初期化に失敗:', error);
      }
    };

    initMap();
  }, [map, center, zoom, setMap, setLoaded, setCenter, setZoom, onMapClick]);

  // 現在の計画の場所に合わせてマップを調整
  useEffect(() => {
    if (!map || !currentPlan?.places.length) return;

    const bounds = new google.maps.LatLngBounds();
    currentPlan.places.forEach(place => {
      bounds.extend({ lat: place.lat, lng: place.lng });
    });

    map.fitBounds(bounds);
  }, [map, currentPlan?.places]);

  const handleResize = useCallback(() => {
    if (map) {
      google.maps.event.trigger(map, 'resize');
    }
  }, [map]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {isLoaded && (
        <>
          <MapControls />
          <PlaceMarkers />
        </>
      )}
    </div>
  );
};