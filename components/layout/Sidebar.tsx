'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_EMAILS } from '@/lib/admins';
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
  Share2,
  Shield,
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
    email?: string;
  } | null;
}

const Sidebar = ({ isOpen, onClose, profile }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const handleShare = async () => {
    if (!profile?.username) return;
    const url = `${window.location.origin}/${profile.username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My BioLinks Profile',
          url: url
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Profile link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
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
        {/* Header — Logo */}
        <div className="flex items-center mb-xl px-sm">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={40} height={40} className="object-contain w-auto h-auto drop-shadow-[0_0_6px_rgba(200,255,0,0.5)]" />
            <span className="text-headline-sm font-bold text-on-surface tracking-tight">BioLinks</span>
          </Link>
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
            <div className="flex items-center gap-xs">
              <span className="text-[10px] text-primary-fixed-dim uppercase tracking-widest font-black">
                {profile?.subscription_tier || 'Free'} Plan
              </span>
              {profile?.subscription_tier === 'free' && (
                <Link href="/pricing" className="text-[8px] bg-primary-container text-on-primary-container px-xs py-[1px] rounded font-bold hover:opacity-80 transition-opacity">
                  UPGRADE
                </Link>
              )}
            </div>
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
          
          {/* Admin Link if authorized */}
          {profile?.email && ADMIN_EMAILS.includes(profile.email) && (
            <Link
              href="/admin"
              onClick={handleNavClick}
              className={`flex items-center gap-md rounded-lg px-md py-sm transition-all duration-150 active:scale-[0.98] mt-auto border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10`}
            >
              <Shield size={20} />
              <span className="text-label-md font-bold uppercase tracking-wider">Admin Panel</span>
            </Link>
          )}

        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-sm border-t border-outline-variant/20 pt-md">
          <button
            onClick={handleShare}
            className="w-full bg-surface-container-highest text-on-surface py-sm rounded-lg text-label-md hover:bg-surface-bright transition-colors flex items-center justify-center gap-sm"
          >
            <Share2 size={16} /> Share
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

export const MobileMenuButton = ({ isOpen, onClick, className }: { isOpen: boolean; onClick: () => void; className?: string }) => (
  <button
    onClick={onClick}
    className={`
      md:hidden w-12 h-12 
      rounded-2xl flex flex-col items-center justify-center gap-[4px]
      transition-all duration-300 active:scale-90
      ${isOpen 
        ? 'bg-surface-container-highest shadow-none' 
        : 'bg-primary-container text-on-primary-container shadow-[0_4px_20px_rgba(210,232,35,0.3)]'
      }
      ${className || ''}
    `}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <span 
      className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
        isOpen ? 'rotate-45 translate-y-[6px]' : ''
      }`} 
    />
    <span 
      className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
        isOpen ? 'opacity-0 scale-x-0' : ''
      }`} 
    />
    <span 
      className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
        isOpen ? '-rotate-45 -translate-y-[6px]' : ''
      }`} 
    />
  </button>
);

export default Sidebar;
