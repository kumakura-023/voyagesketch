import React from 'react';
import { PlusIcon, MinusIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useMapStore } from '@/stores/mapStore';
import { getCurrentPosition } from '@/utils/geoUtils';

export const MapControls: React.FC = () => {
  const { map, setCenter, setZoom } = useMapStore();

  const handleZoomIn = () => {
    if (!map) return;
    const currentZoom = map.getZoom() || 13;
    map.setZoom(currentZoom + 1);
  };

  const handleZoomOut = () => {
    if (!map) return;
    const currentZoom = map.getZoom() || 13;
    map.setZoom(currentZoom - 1);
  };

  const handleCurrentLocation = async () => {
    if (!map) return;
    
    try {
      const position = await getCurrentPosition();
      map.setCenter(position);
      map.setZoom(15);
      setCenter(position);
      setZoom(15);
    } catch (error) {
      console.error('現在位置の取得に失敗:', error);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2">
      <button
        onClick={handleZoomIn}
        className="bg-white rounded-lg shadow-elevation-2 p-2 hover:shadow-elevation-3 transition-shadow"
        aria-label="ズームイン"
      >
        <PlusIcon className="w-5 h-5 text-gray-700" />
      </button>
      
      <button
        onClick={handleZoomOut}
        className="bg-white rounded-lg shadow-elevation-2 p-2 hover:shadow-elevation-3 transition-shadow"
        aria-label="ズームアウト"
      >
        <MinusIcon className="w-5 h-5 text-gray-700" />
      </button>
      
      <button
        onClick={handleCurrentLocation}
        className="bg-white rounded-lg shadow-elevation-2 p-2 hover:shadow-elevation-3 transition-shadow"
        aria-label="現在位置を表示"
      >
        <MapPinIcon className="w-5 h-5 text-coral-500" />
      </button>
    </div>
  );
};