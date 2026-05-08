import React from 'react';
import Link from 'next/link';

const Footer = ({ className = '' }: { className?: string }) => {
  return (
    <footer className={`w-full border-t border-outline-variant/10 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-margin py-xl flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="text-headline-sm text-on-surface font-black tracking-tight">
            Link-in-Bio
          </span>
          <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
            © 2024 Link-in-Bio Systems. Built for creators.
          </p>
        </div>
        <div className="flex gap-lg">
          <Link
            href="#"
            className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
          >
            Status
          </Link>
          <Link
            href="#"
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
