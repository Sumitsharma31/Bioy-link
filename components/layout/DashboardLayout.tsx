'use client';

import React, { useState } from 'react';
import Sidebar, { MobileMenuButton } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: {
    full_name?: string;
    username?: string;
    subscription_tier?: string;
  } | null;
}

const DashboardLayout = ({ children, profile }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar — Slide-in on mobile, fixed on desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} profile={profile} />

      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />

      {/* Main Content Workspace */}
      <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto bg-background">
        <div className="max-w-6xl mx-auto px-md py-lg md:px-lg md:py-xl space-y-xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
