import React from 'react';
import { 
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ShoppingBagIcon,
  TruckIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import type { PlaceCategory } from '@/types/core';

interface CategoryFilterProps {
  selectedCategories: PlaceCategory[];
  onCategoryChange: (categories: PlaceCategory[]) => void;
}

const categoryConfig = {
  restaurant: { label: '飲食', icon: BuildingStorefrontIcon, color: 'bg-red-100 text-red-800' },
  hotel: { label: '宿泊', icon: BuildingOfficeIcon, color: 'bg-blue-100 text-blue-800' },
  attraction: { label: '観光', icon: MapPinIcon, color: 'bg-green-100 text-green-800' },
  shopping: { label: '買い物', icon: ShoppingBagIcon, color: 'bg-purple-100 text-purple-800' },
  transport: { label: '交通', icon: TruckIcon, color: 'bg-yellow-100 text-yellow-800' },
  other: { label: 'その他', icon: EllipsisHorizontalIcon, color: 'bg-gray-100 text-gray-800' },
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const handleCategoryToggle = (category: PlaceCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    const allCategories = Object.keys(categoryConfig) as PlaceCategory[];
    onCategoryChange(allCategories);
  };

  const handleClearAll = () => {
    onCategoryChange([]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">カテゴリフィルター</h3>
        <div className="text-xs space-x-2">
          <button
            onClick={handleSelectAll}
            className="text-coral-600 hover:text-coral-700"
          >
            すべて選択
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={handleClearAll}
            className="text-gray-600 hover:text-gray-700"
          >
            クリア
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(categoryConfig).map(([category, config]) => {
          const isSelected = selectedCategories.includes(category as PlaceCategory);
          const Icon = config.icon;

          return (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category as PlaceCategory)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors border
                ${isSelected 
                  ? `${config.color} border-current` 
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};