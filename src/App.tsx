import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/shared/Layout';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { useAuth } from '@/hooks/auth/useAuth';

// ページコンポーネント（後で実装）
import { LoginPage } from '@/components/auth/LoginPage';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { PlanPage } from '@/components/plans/PlanPage';
import { MyPlansPage } from '@/components/plans/MyPlansPage';
import { NotFoundPage } from '@/components/shared/NotFoundPage';

export default function App() {
  // 認証の初期化
  useAuth();
  return (
    <Router>
      <Routes>
        {/* 認証なしページ */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 認証ありページ */}
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/my-plans" element={<MyPlansPage />} />
            <Route path="/plans/:planId" element={<PlanPage />} />
          </Route>
        </Route>
        
        {/* 404ページ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
