import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-md sm:px-margin flex justify-between items-center h-16">
        {/* Left — Logo + Nav Links */}
        <div className="flex items-center gap-xl">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={48} height={48} className="object-contain drop-shadow-[0_0_6px_rgba(200,255,0,0.5)]" />
            <span className="text-headline-sm font-black text-on-surface tracking-tight">BioLinks</span>
          </Link>
          <div className="hidden md:flex items-center gap-lg">
            <Link
              href="/product"
              className="text-body-md text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-200"
            >
              Product
            </Link>
            <Link
              href="/showcase"
              className="text-body-md text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-200"
            >
              Showcase
            </Link>
            <Link
              href="/pricing"
              className="text-body-md text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-body-md text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-200"
            >
              Docs
            </Link>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-md">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors p-sm">
            <Bell size={20} />
          </button>
          <Link
            href="/login"
            className="hidden sm:block text-body-md text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-200 active:scale-95"
          >
            Log In
          </Link>
          <Link
            href="/login?mode=signup"
            className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all text-body-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
