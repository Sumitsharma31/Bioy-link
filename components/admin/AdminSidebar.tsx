'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, ShieldCheck, Palette } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Pricing', href: '/admin/pricing', icon: CreditCard },
  { label: 'Appearance', href: '/admin/appearance', icon: Palette },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-outline-variant/20 bg-surface-container-low flex-col shrink-0">
        <div className="p-xl flex items-center gap-sm text-primary font-black text-xl tracking-tight">
          <ShieldCheck size={28} />
          ADMIN
        </div>

        <nav className="flex-1 px-md space-y-xs overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-all font-medium group relative
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'}
                `}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-primary rounded-r-full" />}
                <item.icon size={20} className={`shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-md border-t border-outline-variant/10">
          <Link href="/" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all font-medium">
            <LogOut size={20} />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Mobile Flexible Bottom Menu Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-high/90 backdrop-blur-md border-t border-outline-variant/20 h-16 flex items-center px-xs pb-safe">
        <div className="flex-1 flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 w-full h-full relative transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-primary rounded-b-full" />}
                <item.icon size={20} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
          <Link href="/" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <LogOut size={20} />
            <span className="text-[10px] font-bold">Exit</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
