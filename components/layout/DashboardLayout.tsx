'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { MobileMenuButton } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  profile: {
    full_name?: string;
    username?: string;
    subscription_tier?: string;
    email?: string;
  } | null;
}

const DashboardLayout = ({ children, profile }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar — Slide-in on mobile, fixed on desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} profile={profile} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-md py-sm bg-surface-container-low border-b border-outline-variant/20 z-40">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={32} height={32} className="object-contain" />
            <span className="text-headline-sm font-bold tracking-tight">BioLinks</span>
          </Link>
          <MobileMenuButton isOpen={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)} />
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 h-full overflow-y-auto bg-background ml-0 md:ml-64 transition-all">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="max-w-6xl mx-auto px-md py-lg md:px-lg md:py-xl space-y-xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
