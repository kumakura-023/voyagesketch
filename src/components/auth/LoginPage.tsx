import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Firebase認証の実装
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-system-background px-6">
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-coral-500/10 rounded-2xl mb-4">
            <MapPinIcon className="w-10 h-10 text-coral-500" />
          </div>
          <h1 className="title-1 text-system-label">VoyageSketch</h1>
          <p className="subheadline text-system-secondary-label mt-2">
            旅行プランを共同で作成しよう
          </p>
        </div>

        {/* ログインフォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="input"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            ログイン
          </button>
        </form>

        {/* その他のオプション */}
        <div className="mt-6 space-y-3">
          <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="body">Googleでログイン</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button className="text-coral-500 text-sm hover:underline">
            アカウントをお持ちでない方
          </button>
        </div>
      </div>
    </div>
  );
};