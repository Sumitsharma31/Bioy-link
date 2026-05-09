'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Link2,
  Palette,
  BarChart3,
  QrCode,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', end: true },
  { icon: Link2, label: 'Links', path: '/dashboard/links' },
  { icon: Palette, label: 'Appearance', path: '/dashboard/appearance' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: QrCode, label: 'QR Code', path: '/dashboard/qrcode' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    full_name?: string;
    username?: string;
    subscription_tier?: string;
  } | null;
}

const Sidebar = ({ isOpen, onClose, profile }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/30
          bg-surface-container-low flex flex-col p-md gap-sm z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header — Logo + Close Button */}
        <div className="flex items-center justify-between mb-xl px-sm">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={40} height={40} className="object-contain drop-shadow-[0_0_6px_rgba(200,255,0,0.5)]" />
            <span className="text-headline-sm font-bold text-on-surface tracking-tight">BioLinks</span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-xs text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-md px-sm mb-xl">
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-on-surface-variant text-sm font-bold">
              {profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-label-md text-on-surface font-bold truncate">
              {profile?.full_name || 'New Creator'}
            </span>
            <span className="text-[10px] text-primary-fixed-dim uppercase tracking-widest font-bold">
              {profile?.subscription_tier || 'Free'} Plan
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-sm">
          {navItems.map((item) => {
            const isActive = item.end 
              ? pathname === item.path 
              : pathname?.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-md rounded-lg px-md py-sm transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                }`}
              >
                <item.icon size={20} />
                <span className="text-label-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-sm border-t border-outline-variant/20 pt-md">
          <button
            onClick={() => {
              if (profile?.username) {
                router.push(`/${profile.username}`);
                handleNavClick();
              }
            }}
            className="w-full bg-surface-container-highest text-on-surface py-sm rounded-lg text-label-md hover:bg-surface-bright transition-colors"
          >
            View Live Page
          </button>
          <Link
            href="#"
            className="flex items-center gap-md text-on-surface-variant hover:text-on-surface px-sm py-xs transition-colors"
          >
            <HelpCircle size={18} />
            <span className="text-label-md">Help Center</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-md text-on-surface-variant hover:text-error px-sm py-xs transition-colors"
          >
            <LogOut size={18} />
            <span className="text-label-md">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export const MobileMenuButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="md:hidden fixed top-md left-md z-30 w-10 h-10 bg-surface-container-high border border-outline-variant/30 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-lg"
    aria-label="Open menu"
  >
    <Menu size={20} />
  </button>
);

export default Sidebar;
