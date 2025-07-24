import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { usePlanStore } from '@/stores/planStore';
import { useAuthStore } from '@/stores/authStore';
import { CreatePlanModal } from '@/components/plans/CreatePlanModal';
import { EditPlanModal } from '@/components/plans/EditPlanModal';
import { PlanList } from '@/components/plans/PlanList';
import type { Plan } from '@/types/core';

export const DashboardPage: React.FC = () => {
  const { plans, setPlans, deletePlan } = usePlanStore();
  const { user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // TODO: 実際の実装ではFirebaseから取得
  useEffect(() => {
    if (user && plans.length === 0) {
      // モックデータ
      const mockPlans: Plan[] = [
        {
          id: '1',
          title: '京都旅行 2024',
          description: '古都の魅力を満喫する3泊4日の旅',
          startDate: new Date('2024-08-15'),
          endDate: new Date('2024-08-18'),
          places: [],
          isPublic: false,
          members: [{ userId: user.id, role: 'owner', joinedAt: new Date() }],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user.id,
        },
        {
          id: '2',
          title: '沖縄家族旅行',
          description: '美しい海と自然を楽しむ家族旅行',
          startDate: new Date('2024-09-20'),
          endDate: new Date('2024-09-25'),
          places: [],
          isPublic: true,
          members: [{ userId: user.id, role: 'owner', joinedAt: new Date() }],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user.id,
        },
      ];
      setPlans(mockPlans);
    }
  }, [user, plans.length, setPlans]);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
  };

  return (
    <div className="min-h-screen bg-system-secondary-background">
      {/* ヘッダーセクション */}
      <div className="bg-white px-5 py-6">
        <h2 className="title-2 text-system-label mb-2">こんにちは！</h2>
        <p className="body text-system-secondary-label">
          次の冒険を計画しましょう
        </p>
      </div>

      {/* 新規作成ボタン */}
      <div className="px-5 py-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-full glass-effect rounded-xl p-6 flex items-center justify-between hover:shadow-elevation-3 transition-all"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-coral-500/10 rounded-full flex items-center justify-center mr-4">
              <PlusIcon className="w-6 h-6 text-coral-500" />
            </div>
            <div className="text-left">
              <h3 className="headline text-system-label">新しい旅行プラン</h3>
              <p className="footnote text-system-secondary-label">
                友達と一緒に計画を始める
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* プランリスト */}
      <div className="px-5 py-4">
        <h3 className="headline text-system-label mb-4">あなたのプラン</h3>
        <PlanList 
          plans={plans}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
          showActions={true}
        />
      </div>

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