import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapIcon, ListBulletIcon, PlusIcon, PencilIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Map } from '@/components/map/Map';
import { SearchBar } from '@/components/places/SearchBar';
import { CategoryFilter } from '@/components/places/CategoryFilter';
import { EditPlanModal } from '@/components/plans/EditPlanModal';
import { usePlanStore } from '@/stores/planStore';
import { useAuthStore } from '@/stores/authStore';
import { usePlaceActions } from '@/hooks/places/usePlaceActions';
import type { PlaceCategory } from '@/types/core';
import { v4 as uuidv4 } from 'uuid';

export const PlanPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { currentPlan, setCurrentPlan, plans } = usePlanStore();
  const { user } = useAuthStore();
  const { addPlaceFromGoogle } = usePlaceActions();

  // 初回マウント時にプランを設定
  useEffect(() => {
    if (!planId) return;
    
    // 実際の実装ではFirebaseから取得しますが、今はモックデータを使用
    const mockPlan = {
      id: planId,
      title: '京都旅行 2024',
      description: '古都の魅力を満喫する3泊4日の旅',
      startDate: new Date('2024-08-15'),
      endDate: new Date('2024-08-18'),
      isPublic: false,
      members: [{ userId: user?.id || '1', role: 'owner' as const, joinedAt: new Date() }],
      places: [
        {
          id: '1',
          name: '清水寺',
          address: '京都府京都市東山区清水1-294',
          category: 'attraction' as const,
          memo: '朝一番に行くのがおすすめ',
          lat: 34.9948,
          lng: 135.7851,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user?.id || '1',
        },
        {
          id: '2',
          name: '伏見稲荷大社',
          address: '京都府京都市伏見区深草薮之内町68',
          category: 'attraction' as const,
          memo: '千本鳥居は圧巻',
          lat: 34.9671,
          lng: 135.7727,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user?.id || '1',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.id || '1',
    };
    
    setCurrentPlan(mockPlan);
  }, [planId, setCurrentPlan, user]);

  // カテゴリフィルタリング
  const filteredPlaces = currentPlan?.places.filter(place => 
    selectedCategories.length === 0 || selectedCategories.includes(place.category)
  ) || [];

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    
    // 地図クリックで新しい場所を追加する機能（将来的に実装）
    console.log('Map clicked:', event.latLng.lat(), event.latLng.lng());
  };

  const handleAddPlace = () => {
    setShowSearchBar(true);
  };

  if (!currentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-system-background">
      {/* プラン情報ヘッダー */}
      <div className="bg-white px-5 py-4 border-b border-system-separator">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="title-3 text-system-label mb-1">{currentPlan.title}</h1>
            <p className="footnote text-system-secondary-label">
              {currentPlan.startDate?.toLocaleDateString('ja-JP') || '未定'} - {currentPlan.endDate?.toLocaleDateString('ja-JP') || '未定'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="プランを編集"
            >
              <PencilIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="プランを共有"
            >
              <ShareIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ビュー切り替えタブ */}
      <div className="bg-white px-5 py-2 border-b border-system-separator">
        <div className="flex space-x-1 bg-system-secondary-background p-1 rounded-lg">
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-all ${
              viewMode === 'map'
                ? 'bg-white text-coral-500 shadow-sm'
                : 'text-system-secondary-label'
            }`}
          >
            <MapIcon className="w-5 h-5 mr-2" />
            <span className="subheadline">地図</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-all ${
              viewMode === 'list'
                ? 'bg-white text-coral-500 shadow-sm'
                : 'text-system-secondary-label'
            }`}
          >
            <ListBulletIcon className="w-5 h-5 mr-2" />
            <span className="subheadline">リスト</span>
          </button>
        </div>
      </div>

      {/* 検索バー（表示時） */}
      {showSearchBar && (
        <div className="absolute top-20 left-5 right-5 z-10">
          <SearchBar />
        </div>
      )}

      {/* コンテンツエリア */}
      <div className="flex-1">
        {viewMode === 'map' ? (
          <div className="h-[calc(100vh-200px)]">
            <Map className="w-full h-full" onMapClick={handleMapClick} />
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4">
            {/* カテゴリフィルター */}
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
            />
            
            {/* 場所リスト */}
            <div className="space-y-3">
              {filteredPlaces.map((place) => (
                <div key={place.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="headline text-system-label mb-1">{place.name}</h3>
                      <p className="caption-1 text-system-secondary-label mb-2">
                        {place.address}
                      </p>
                      {place.memo && (
                        <p className="footnote text-system-label">{place.memo}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full caption-1 font-medium ${
                      place.category === 'attraction'
                        ? 'bg-teal-500/10 text-teal-700'
                        : place.category === 'restaurant'
                        ? 'bg-red-500/10 text-red-700'
                        : place.category === 'hotel'
                        ? 'bg-blue-500/10 text-blue-700'
                        : 'bg-coral-500/10 text-coral-700'
                    }`}>
                      {place.category === 'attraction' ? '観光' : 
                       place.category === 'restaurant' ? '飲食' :
                       place.category === 'hotel' ? '宿泊' : 'その他'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* フローティングアクションボタン */}
      <button 
        onClick={handleAddPlace}
        className="fixed bottom-24 right-5 w-14 h-14 bg-coral-500 text-white rounded-full shadow-elevation-4 flex items-center justify-center hover:bg-coral-600 transition-colors"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* 編集モーダル */}
      {showEditModal && currentPlan && (
        <EditPlanModal
          plan={currentPlan}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};