import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { usePlanStore } from '@/stores/planStore';
import type { Plan } from '@/types/core';

interface EditPlanModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan, isOpen, onClose }) => {
  const { updatePlan } = usePlanStore();
  
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(plan.isPublic);
  const [isSaving, setIsSaving] = useState(false);

  // 日付の初期化
  useEffect(() => {
    if (plan.startDate) {
      const date = new Date(plan.startDate);
      setStartDate(date.toISOString().split('T')[0]);
    }
    if (plan.endDate) {
      const date = new Date(plan.endDate);
      setEndDate(date.toISOString().split('T')[0]);
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    try {
      const updates: Partial<Plan> = {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isPublic,
        updatedAt: new Date(),
      };

      updatePlan(plan.id, updates);
      onClose();
    } catch (error) {
      console.error('プランの更新に失敗しました:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダル本体 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-elevation-5 w-full max-w-md p-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-2 text-system-label">プランを編集</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                プラン名 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="例：京都旅行 2024"
                required
              />
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input resize-none"
                rows={3}
                placeholder="旅行の概要や目的を入力..."
              />
            </div>

            {/* 日程 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  開始日
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  終了日
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="input"
                />
              </div>
            </div>

            {/* 公開設定 */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <GlobeAltIcon className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">公開プラン</p>
                  <p className="text-xs text-gray-500">他のユーザーがプランを閲覧できます</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500"></div>
              </label>
            </div>

            {/* ボタン */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={isSaving}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={!title || isSaving}
              >
                {isSaving ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};