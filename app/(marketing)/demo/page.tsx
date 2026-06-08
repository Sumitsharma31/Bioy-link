'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Globe, Instagram, Twitter, Linkedin,
  Github, Youtube, Mail, Music, ShoppingBag,
  Palette, Zap, ArrowRight, Check, Sparkles,
} from 'lucide-react';

// ─── Theme Definitions ──────────────────────────────────────────
const THEMES = [
  {
    key: 'modern-lime',
    label: 'Modern Lime',
    bg: '#131313',
    card: '#1c1c1c',
    text: '#ffffff',
    accent: '#d2e823',
    border: 'rgba(255,255,255,0.06)',
  },
  {
    key: 'deep-space',
    label: 'Deep Space',
    bg: '#0a0a2e',
    card: '#161644',
    text: '#e2e8f0',
    accent: '#7c3aed',
    border: 'rgba(124,58,237,0.15)',
  },
  {
    key: 'snow-peak',
    label: 'Snow Peak',
    bg: '#f8f8f8',
    card: '#ffffff',
    text: '#1a1a1a',
    accent: '#3b82f6',
    border: 'rgba(0,0,0,0.08)',
  },
  {
    key: 'custom-cyan',
    label: 'Cyber Wave',
    bg: '#0d1117',
    card: '#161b22',
    text: '#e6edf3',
    accent: '#00d9ff',
    border: 'rgba(0,217,255,0.12)',
  },
  {
    key: 'rose-gold',
    label: 'Rose Gold',
    bg: '#1a0e10',
    card: '#261418',
    text: '#fde8ec',
    accent: '#f43f5e',
    border: 'rgba(244,63,94,0.15)',
  },
];

const BUTTON_STYLES = [
  { key: 'rounded', label: 'Rounded', radius: '0.5rem' },
  { key: 'pill', label: 'Pill', radius: '9999px' },
  { key: 'sharp', label: 'Sharp', radius: '0px' },
];

// ─── Demo Data ───────────────────────────────────────────────────
const DEMO_LINKS = [
  { id: 1, title: 'My YouTube Channel', Icon: Youtube, url: '#' },
  { id: 2, title: 'Follow on Instagram', Icon: Instagram, url: '#' },
  { id: 3, title: 'GitHub Portfolio', Icon: Github, url: '#' },
  { id: 4, title: 'Latest Music Drop', Icon: Music, url: '#' },
  { id: 5, title: 'Shop My Merch', Icon: ShoppingBag, url: '#' },
];

const DEMO_SOCIALS = [Globe, Twitter, Linkedin, Mail];

// ─── Component ───────────────────────────────────────────────────
export default function DemoPage() {
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [activeButton, setActiveButton] = useState(BUTTON_STYLES[0]);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    async function fetchUser() {
      const { createClient } = await import('@/lib/supabase/client');
      const { data: { user } } = await createClient().auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <div className="wireframe-pattern min-h-screen">
      <main className="max-w-7xl mx-auto px-md sm:px-lg pt-24 pb-20">

        {/* ── Page Header ── */}
        <motion.div
          className="text-center mb-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex items-center gap-xs px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
            <Sparkles size={12} />
            Interactive Demo
          </span>
          <h1 className="text-headline-lg text-on-surface mb-sm" style={{ lineHeight: 1.1 }}>
            See your page come to life.
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Switch themes and button styles in real-time. This is exactly what your visitors will see.
          </p>
        </motion.div>

        {/* ── Split Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">

          {/* ── LEFT: Controls ── */}
          <motion.div
            className="lg:col-span-4 flex flex-col gap-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Theme Picker */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
              <div className="flex items-center gap-sm mb-md">
                <Palette size={18} className="text-primary" />
                <h2 className="text-headline-sm text-on-surface">Theme</h2>
              </div>
              <div className="grid grid-cols-1 gap-sm">
                {THEMES.map((theme) => {
                  const isActive = activeTheme.key === theme.key;
                  return (
                    <button
                      key={theme.key}
                      onClick={() => setActiveTheme(theme)}
                      className={`w-full flex items-center justify-between px-md py-sm rounded-lg border transition-all duration-200 ${
                        isActive
                          ? 'border-primary/40 bg-primary-container/10'
                          : 'border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-variant/30'
                      }`}
                    >
                      <div className="flex items-center gap-sm">
                        {/* Mini colour swatch */}
                        <div
                          className="w-8 h-8 rounded-md border border-white/10 flex items-center justify-center"
                          style={{ backgroundColor: theme.bg }}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent }} />
                        </div>
                        <span className={`text-label-md font-bold ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {theme.label}
                        </span>
                      </div>
                      {isActive && <Check size={14} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Button Style Picker */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
              <div className="flex items-center gap-sm mb-md">
                <Zap size={18} className="text-primary" />
                <h2 className="text-headline-sm text-on-surface">Button Style</h2>
              </div>
              <div className="grid grid-cols-3 gap-sm">
                {BUTTON_STYLES.map((style) => {
                  const isActive = activeButton.key === style.key;
                  return (
                    <button
                      key={style.key}
                      onClick={() => setActiveButton(style)}
                      className={`py-sm text-label-md font-bold border transition-all duration-200 ${
                        isActive
                          ? 'border-primary/40 bg-primary-container/10 text-primary'
                          : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'
                      }`}
                      style={{ borderRadius: style.radius }}
                    >
                      {style.label}
                    </button>
                  );
                })}
              </div>

              {/* Preview of the button style */}
              <div className="mt-md pt-md border-t border-outline-variant/10">
                <p className="text-label-sm text-on-surface-variant/50 uppercase tracking-wider mb-sm">Preview</p>
                <div
                  className="w-full py-sm flex items-center justify-between px-md border transition-colors"
                  style={{
                    backgroundColor: activeTheme.card,
                    borderColor: activeTheme.border,
                    borderRadius: activeButton.radius,
                    color: activeTheme.text,
                  }}
                >
                  <div className="flex items-center gap-sm">
                    <Youtube size={16} style={{ color: activeTheme.accent }} />
                    <span className="text-label-md font-bold" style={{ color: activeTheme.text }}>Link Button</span>
                  </div>
                  <ExternalLink size={14} style={{ opacity: 0.5 }} />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-md">
              <p className="text-body-md text-on-surface-variant">
                Ready to build your own? It takes under 2 minutes.
              </p>
              <Link
                href={user ? "/dashboard" : "/login?mode=signup"}
                className="flex items-center justify-center gap-sm bg-primary-container text-on-primary-container px-lg py-md rounded-lg font-bold text-body-lg hover:opacity-90 active:scale-95 transition-all"
              >
                {user ? "Go to Dashboard" : "Build Your Page"} <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="text-center text-label-md text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT: Live Profile Preview ── */}
          <motion.div
            className="lg:col-span-8 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Phone frame wrapper */}
            <div className="w-full max-w-sm">
              {/* Phone chrome */}
              <div className="rounded-[2.5rem] border-[8px] border-surface-container-high bg-surface-container-high shadow-2xl overflow-hidden">
                {/* Status bar */}
                <div
                  className="h-8 flex items-center justify-between px-lg"
                  style={{ backgroundColor: activeTheme.bg }}
                >
                  <span className="text-[10px] font-bold" style={{ color: activeTheme.text, opacity: 0.5 }}>9:41</span>
                  <div
                    className="w-20 h-4 rounded-full mx-auto"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                  />
                  <div className="flex gap-1 items-center">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1 rounded-sm" style={{ height: `${8 + i * 2}px`, backgroundColor: activeTheme.text, opacity: 0.5 }} />
                    ))}
                  </div>
                </div>

                {/* Profile page */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTheme.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center py-lg px-md overflow-y-auto"
                    style={{
                      backgroundColor: activeTheme.bg,
                      color: activeTheme.text,
                      minHeight: '580px',
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-20 h-20 rounded-full overflow-hidden border-2 mb-md relative"
                      style={{ borderColor: activeTheme.accent }}
                    >
                      <Image
                        src="/demo-avatar.png"
                        alt="Alex Creator"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Name & bio */}
                    <h2 className="text-lg font-black mb-xs" style={{ color: activeTheme.text }}>
                      @alexcreator
                    </h2>
                    <p className="text-xs text-center max-w-[220px] mb-lg leading-relaxed" style={{ color: activeTheme.text, opacity: 0.7 }}>
                      Creator · Developer · Music Maker<br />Building cool things on the internet ✦
                    </p>

                    {/* Links */}
                    <div className="w-full flex flex-col gap-sm mb-md">
                      {DEMO_LINKS.map(({ id, title, Icon }) => (
                        <motion.div
                          key={id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-md py-sm flex items-center justify-between cursor-pointer border transition-all"
                          style={{
                            backgroundColor: activeTheme.card,
                            borderColor: activeTheme.border,
                            borderRadius: activeButton.radius,
                            color: activeTheme.text,
                          }}
                        >
                          <div className="flex items-center gap-sm">
                            <Icon size={16} style={{ color: activeTheme.accent }} />
                            <span className="text-xs font-bold">{title}</span>
                          </div>
                          <ExternalLink size={12} style={{ opacity: 0.4 }} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Social row */}
                    <div
                      className="w-full flex justify-center gap-sm py-sm mt-sm border-t"
                      style={{ borderColor: 'rgba(150,150,150,0.15)' }}
                    >
                      {DEMO_SOCIALS.map((Icon, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: activeTheme.card }}
                        >
                          <Icon size={14} style={{ color: activeTheme.text, opacity: 0.7 }} />
                        </div>
                      ))}
                    </div>

                    {/* Watermark */}
                    <p className="mt-md text-[9px] uppercase tracking-widest font-black" style={{ color: activeTheme.text, opacity: 0.2 }}>
                      Built with BioLinks
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Phone bottom bar */}
              <div className="flex justify-center mt-md">
                <div className="w-24 h-1 rounded-full bg-surface-container-high" />
              </div>

              {/* Live badge */}
              <div className="flex justify-center mt-md">
                <span className="inline-flex items-center gap-xs px-sm py-xs bg-surface-container-high border border-outline-variant/20 rounded-full text-label-sm text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Live preview — changes apply instantly
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Feature highlights row ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-md mt-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { emoji: '⚡', title: 'Setup in 2 min', desc: 'No design skills needed' },
            { emoji: '🎨', title: '5 Themes', desc: 'More coming every month' },
            { emoji: '📊', title: 'Deep Analytics', desc: 'Know your audience' },
            { emoji: '🔗', title: 'Unlimited Links', desc: 'On Pro & Pro Max plans' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg text-center hover:border-primary/20 transition-all"
            >
              <div className="text-2xl mb-sm">{f.emoji}</div>
              <p className="text-label-md font-bold text-on-surface mb-xs">{f.title}</p>
              <p className="text-[11px] text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
