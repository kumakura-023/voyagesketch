import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const getTitle = () => {
    if (isHomePage) return 'VoyageSketch';
    if (location.pathname.includes('/plans/')) return '旅行プラン';
    return '';
  };

  return (
    <nav className="glass-effect border-b border-system-separator px-5 py-3 safe-area-inset">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {!isHomePage && (
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6 text-coral-500" />
            </button>
          )}
          <h1 className="headline text-system-label">{getTitle()}</h1>
        </div>
        
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <UserCircleIcon className="w-6 h-6 text-system-secondary-label" />
        </button>
      </div>
    </nav>
  );
};