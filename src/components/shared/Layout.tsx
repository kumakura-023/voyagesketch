import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { TabBar } from './TabBar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-system-background">
      <Navbar />
      <main className="pb-20">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
};