import React, { useEffect, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useMapStore } from '@/stores/mapStore';
import { usePlanStore } from '@/stores/planStore';
import type { Place } from '@/types/core';

export const PlaceMarkers: React.FC = () => {
  const { map } = useMapStore();
  const { currentPlan } = usePlanStore();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  // カテゴリ別のマーカーアイコン
  const getMarkerIcon = (category: Place['category']): string => {
    const icons = {
      restaurant: '🍽️',
      hotel: '🏨',
      attraction: '🎯',
      shopping: '🛍️',
      transport: '🚌',
      other: '📍',
    };
    return icons[category];
  };

  // マーカーの作成
  useEffect(() => {
    if (!map || !currentPlan?.places) return;

    // 既存のマーカーをクリア
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    // 新しいマーカーを作成
    const markers = currentPlan.places.map(place => {
      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        title: place.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#FF6B6B" stroke="#ffffff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">
                ${getMarkerIcon(place.category)}
              </text>
            </svg>`
          )}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      });

      // クリックイベント
      marker.addListener('click', () => {
        // 場所詳細パネルを開く処理をここに追加
        console.log('Place clicked:', place);
      });

      return marker;
    });

    markersRef.current = markers;

    // マーカークラスタリング
    if (markers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map,
        markers,
      });
    }

    // クリーンアップ
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
    };
  }, [map, currentPlan?.places]);

  return null; // このコンポーネントは直接的なレンダリングを行わない
};