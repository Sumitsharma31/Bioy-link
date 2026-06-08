'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Compass } from 'lucide-react';

/**
 * app/not-found.tsx
 * -----------------
 * Rendered automatically by Next.js for any unmatched route (404).
 * Uses the BioLinks design language: dark bg, lime accent, wireframe aesthetic.
 */
export default function NotFound() {
  return (
    <div className="wireframe-pattern min-h-screen flex flex-col items-center justify-center px-md text-on-surface relative overflow-hidden">

      {/* Ambient glow blobs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(210,232,35,0.04) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
        }}
      />

      <motion.div
        className="flex flex-col items-center text-center max-w-lg w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Illustration */}
        <motion.div
          className="w-56 h-56 mb-xl relative"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-2xl bg-surface-container-low border border-outline-variant/20 ring-1 ring-outline-variant/10 overflow-hidden relative p-sm">
            <Image
              src="/404-illustration.png"
              alt="Broken link — page not found"
              fill
              sizes="(max-width: 768px) 100vw, 224px"
              priority
              className="object-cover rounded-xl"
            />
            {/* bottom fade */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-surface-container-low/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.span
          className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          Error 404
        </motion.span>

        {/* Heading */}
        <motion.h1
          className="text-headline-lg text-on-surface mb-sm"
          style={{ lineHeight: 1.1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          This link is broken.
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          className="text-body-lg text-on-surface-variant mb-xl max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.4 }}
        >
          The page you're looking for has moved, been deleted, or never existed in this blueprint.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-md w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.4 }}
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-sm bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-bold text-body-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-sm border border-outline-variant text-on-surface px-xl py-md rounded-lg font-bold text-body-lg hover:bg-surface-variant active:scale-95 transition-all"
          >
            <Compass size={18} />
            Go to Dashboard
          </Link>
        </motion.div>

        {/* Go back helper */}
        <motion.button
          onClick={() => window.history.back()}
          className="mt-lg flex items-center gap-xs text-label-md text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ArrowLeft size={14} />
          or go back to previous page
        </motion.button>
      </motion.div>

      {/* Bottom BioLinks watermark */}
      <motion.p
        className="absolute bottom-lg text-label-sm text-on-surface-variant/20 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        BioLinks · Digital Identity Platform
      </motion.p>
    </div>
  );
}
