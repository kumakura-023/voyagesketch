import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-system-background">
      <div className="text-center px-6">
        <h1 className="title-large text-coral-500 mb-4">404</h1>
        <p className="title-2 text-system-label mb-2">ページが見つかりません</p>
        <p className="body text-system-secondary-label mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <HomeIcon className="w-5 h-5 mr-2" />
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};