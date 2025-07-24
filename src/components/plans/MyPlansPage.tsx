import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePlanStore } from '@/stores/planStore';
import { CreatePlanModal } from './CreatePlanModal';
import { EditPlanModal } from './EditPlanModal';
import { PlanList } from './PlanList';
import type { Plan } from '@/types/core';

export const MyPlansPage: React.FC = () => {
  const { plans, deletePlan } = usePlanStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');

  // フィルタリング
  const filteredPlans = plans.filter(plan => {
    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!plan.title.toLowerCase().includes(query) && 
          !plan.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    // タイプフィルター
    if (filterType === 'public' && !plan.isPublic) return false;
    if (filterType === 'private' && plan.isPublic) return false;

    return true;
  });

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
  };

  return (
    <div className="min-h-screen bg-system-secondary-background">
      {/* ヘッダー */}
      <div className="bg-white px-5 py-6 border-b border-system-separator">
        <h1 className="title-2 text-system-label mb-2">マイプラン</h1>
        <p className="body text-system-secondary-label">
          あなたの旅行プランを管理
        </p>
      </div>

      {/* フィルター＆検索 */}
      <div className="bg-white px-5 py-4 space-y-3 border-b border-system-separator">
        {/* 検索バー */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="プランを検索..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                     bg-white shadow-sm focus:ring-2 focus:ring-coral-500 focus:border-coral-500
                     text-sm placeholder-gray-500"
          />
        </div>

        {/* フィルタータブ */}
        <div className="flex space-x-1 bg-system-secondary-background p-1 rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              filterType === 'all'
                ? 'bg-white text-coral-500 shadow-sm'
                : 'text-system-secondary-label'
            }`}
          >
            すべて ({plans.length})
          </button>
          <button
            onClick={() => setFilterType('public')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              filterType === 'public'
                ? 'bg-white text-coral-500 shadow-sm'
                : 'text-system-secondary-label'
            }`}
          >
            公開 ({plans.filter(p => p.isPublic).length})
          </button>
          <button
            onClick={() => setFilterType('private')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              filterType === 'private'
                ? 'bg-white text-coral-500 shadow-sm'
                : 'text-system-secondary-label'
            }`}
          >
            非公開 ({plans.filter(p => !p.isPublic).length})
          </button>
        </div>
      </div>

      {/* プランリスト */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="headline text-system-label">
            {searchQuery ? `"${searchQuery}" の検索結果` : 'プラン一覧'}
          </h2>
          <span className="text-sm text-system-secondary-label">
            {filteredPlans.length} 件
          </span>
        </div>

        <PlanList 
          plans={filteredPlans}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
          showActions={true}
        />
      </div>

      {/* フローティングアクションボタン */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-coral-500 text-white rounded-full shadow-elevation-4 flex items-center justify-center hover:bg-coral-600 transition-colors"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* モーダル */}
      <CreatePlanModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
        />
      )}
    </div>
  );
};