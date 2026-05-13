import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ADMIN_EMAILS } from '@/lib/admins';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/dashboard');
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Pricing', href: '/admin/pricing', icon: CreditCard },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-outline-variant/20 bg-surface-container-low flex flex-col">
        <div className="p-xl flex items-center gap-sm text-primary font-black text-xl tracking-tight">
          <ShieldCheck size={28} />
          ADMIN
        </div>

        <nav className="flex-1 px-md space-y-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all font-medium group"
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-md border-t border-outline-variant/10">
          <Link href="/dashboard" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all font-medium">
            <LogOut size={20} />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-outline-variant/10 flex items-center justify-between px-xl bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-title-md font-bold text-on-surface">Admin Control Panel</h1>
          <div className="flex items-center gap-md">
            <span className="text-label-sm text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-sm py-xs rounded">Live Status</span>
          </div>
        </header>

        <div className="p-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
