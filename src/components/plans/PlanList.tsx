import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UsersIcon, MapPinIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Plan } from '@/types/core';

interface PlanListProps {
  plans: Plan[];
  onEdit?: (plan: Plan) => void;
  onDelete?: (planId: string) => void;
  showActions?: boolean;
}

export const PlanList: React.FC<PlanListProps> = ({ 
  plans, 
  onEdit, 
  onDelete,
  showActions = false 
}) => {
  const formatDateRange = (start?: Date, end?: Date) => {
    if (!start && !end) return '日程未定';
    
    const startStr = start ? start.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) : '';
    const endStr = end ? end.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) : '';
    
    if (start && end) {
      return `${startStr} - ${endStr}`;
    } else if (start) {
      return `${startStr} から`;
    } else {
      return `${endStr} まで`;
    }
  };

  const getPlaceImage = (plan: Plan) => {
    // 最初の場所の画像を使用（あれば）
    const firstPlace = plan.places[0];
    if (firstPlace?.photos?.[0]) {
      return firstPlace.photos[0];
    }
    // デフォルト画像
    return `https://source.unsplash.com/400x300/?travel,${plan.title}`;
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">まだプランがありません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div key={plan.id} className="card-interactive group">
          <Link to={`/plans/${plan.id}`} className="block">
            {/* 画像 */}
            <div className="relative h-48 overflow-hidden rounded-t-xl">
              <img
                src={getPlaceImage(plan)}
                alt={plan.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {showActions && (
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit(plan);
                      }}
                      className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 text-gray-700" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm('このプランを削除してもよろしいですか？')) {
                          onDelete(plan.id);
                        }
                      }}
                      className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 情報 */}
            <div className="p-4">
              <h3 className="headline text-system-label mb-2 line-clamp-1">
                {plan.title}
              </h3>
              
              {plan.description && (
                <p className="footnote text-system-secondary-label mb-3 line-clamp-2">
                  {plan.description}
                </p>
              )}

              <div className="space-y-2">
                {/* 日程 */}
                <div className="flex items-center text-system-secondary-label">
                  <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="caption-1">
                    {formatDateRange(plan.startDate, plan.endDate)}
                  </span>
                </div>

                {/* 場所数 */}
                <div className="flex items-center text-system-secondary-label">
                  <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="caption-1">
                    {plan.places.length} スポット
                  </span>
                </div>

                {/* メンバー数 */}
                <div className="flex items-center text-system-secondary-label">
                  <UsersIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="caption-1">
                    {plan.members.length} 人
                  </span>
                </div>
              </div>

              {/* 公開状態 */}
              {plan.isPublic && (
                <div className="mt-3 inline-flex items-center px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                  <GlobeAltIcon className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">公開</span>
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

// アイコンコンポーネント
const GlobeAltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);