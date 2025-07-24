import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, MapIcon, FolderIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, MapIcon as MapIconSolid, FolderIcon as FolderIconSolid } from '@heroicons/react/24/solid';

interface TabItem {
  path: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  activeIcon: React.FC<{ className?: string }>;
}

export const TabBar: React.FC = () => {
  const location = useLocation();

  const tabs: TabItem[] = [
    {
      path: '/',
      label: 'ホーム',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      path: '/explore',
      label: '探索',
      icon: MapIcon,
      activeIcon: MapIconSolid,
    },
    {
      path: '/my-plans',
      label: 'マイプラン',
      icon: FolderIcon,
      activeIcon: FolderIconSolid,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-system-separator">
      <div className="flex justify-around items-center px-2 py-2 safe-area-inset">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = isActive ? tab.activeIcon : tab.icon;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center py-1 px-2 transition-all duration-150 ${
                isActive ? 'text-coral-500' : 'text-system-secondary-label'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="caption-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};