'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    // Simulate a brief loading state for UX
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <button 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-sm bg-surface-container-high border border-outline-variant/20 rounded-lg text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50 transition-all active:scale-95 disabled:opacity-50"
      title="Refresh Data"
    >
      <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
    </button>
  );
}
