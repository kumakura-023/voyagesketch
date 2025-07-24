import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { usePlanStore } from '@/stores/planStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { Plan } from '@/types/core';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPlan } = usePlanStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsCreating(true);

    try {
      const newPlan: Plan = {
        id: uuidv4(),
        title,
        description,
        places: [],
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isPublic,
        members: [{
          userId: user.id,
          role: 'owner',
          joinedAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id,
      };

      addPlan(newPlan);
      
      // 作成したプランのページに遷移
      navigate(`/plans/${newPlan.id}`);
      onClose();
    } catch (error) {
      console.error('プランの作成に失敗しました:', error);
    } finally {
      setIsCreating(false);
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
            <h2 className="title-2 text-system-label">新しい旅行プラン</h2>
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
                disabled={isCreating}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={!title || isCreating}
              >
                {isCreating ? '作成中...' : 'プランを作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};