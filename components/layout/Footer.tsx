import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = ({ className = '' }: { className?: string }) => {
  return (
    <footer className={`w-full border-t border-outline-variant/10 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-margin py-xl flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={64} height={64} className="object-contain w-auto h-auto drop-shadow-[0_0_6px_rgba(200,255,0,0.5)]" />
            <span className="text-headline-sm text-on-surface font-black tracking-tight">BioLinks</span>
          </Link>
          <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
            © 2026 BioLinks. Built for creators.
          </p>
        </div>
        <div className="flex gap-lg">
          <Link
            href="/privacy"
            className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
          >
            Terms of Service
          </Link>
          <Link
            href="/status"
            className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
          >
            Status
          </Link>
          <Link
            href="/contact"
            className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
