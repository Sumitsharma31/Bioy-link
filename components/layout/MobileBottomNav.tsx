'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Zap, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-background/80 backdrop-blur-md border-t border-outline-variant/20 md:hidden h-16 flex items-center pb-safe">
      <div className="flex-1 flex justify-around items-center">
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
          <Home size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/showcase" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/showcase') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
          <Compass size={20} />
          <span className="text-[10px] font-bold">Explore</span>
        </Link>
        <Link href="/pricing" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/pricing') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
          <Zap size={20} />
          <span className="text-[10px] font-bold">Pricing</span>
        </Link>
        <Link href={user ? "/dashboard" : "/login"} className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
          <User size={20} />
          <span className="text-[10px] font-bold">{user ? "Dashboard" : "Account"}</span>
        </Link>
      </div>
    </nav>
  );
}
