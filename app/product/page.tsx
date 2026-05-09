'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Palette, Link2, QrCode, Globe, Zap, Shield, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  {
    icon: Link2,
    title: 'Unlimited Links',
    description: 'Add as many links as you need. Reorder them with drag & drop. Activate or deactivate individually.',
    tag: 'Core',
    span: 'md:col-span-2',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Track every click, profile view, and referral source in real time.',
    tag: 'Insights',
    span: '',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    description: 'Choose from a curated library of designer themes or craft your own with a full color editor.',
    tag: 'Design',
    span: '',
  },
  {
    icon: QrCode,
    title: 'Branded QR Codes',
    description: 'Generate QR codes that inherit your brand colors and embed your logo at the center.',
    tag: 'Offline',
    span: '',
  },
  {
    icon: Globe,
    title: 'Custom Domain',
    description: 'Connect your own domain (e.g., links.yourbrand.com) for a fully white-labeled presence.',
    tag: 'Pro',
    span: 'md:col-span-2',
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    description: 'Password-protect pages or individual links. GDPR-compliant data handling built in.',
    tag: 'Security',
    span: '',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Edge-rendered pages load in under 100ms globally. No JavaScript bloat for visitors.',
    tag: 'Performance',
    span: '',
  },
];

const steps = [
  { n: '01', title: 'Create your account', body: 'Sign up in seconds — no credit card required. Your profile page is live instantly.' },
  { n: '02', title: 'Add your links', body: 'Paste any URL. Set a title, icon, and custom thumbnail. Reorder with drag & drop.' },
  { n: '03', title: 'Pick a theme', body: 'Browse the theme library or use the color editor to match your exact brand palette.' },
  { n: '04', title: 'Share everywhere', body: 'Drop your BioLinks URL in your Instagram bio, email signature, or business card QR.' },
];

export default function ProductPage() {
  return (
    <div className="wireframe-pattern min-h-screen">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl text-center">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md"
          >
            Everything you need
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-7xl text-on-surface font-black tracking-tight mb-md"
            style={{ lineHeight: 1.05 }}
          >
            Built for creators.<br />
            <span className="text-primary-container">Engineered to convert.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-xl"
          >
            Every feature in BioLinks is designed around one goal: turning profile visits into meaningful actions for your audience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="flex gap-md justify-center flex-wrap"
          >
            <Link href="/login?mode=signup" className="bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-sm">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link href="/pricing" className="border border-outline-variant text-on-surface px-xl py-md rounded-lg font-bold text-lg hover:bg-surface-variant active:scale-95 transition-all">
              See Pricing
            </Link>
          </motion.div>
        </section>

        {/* Bento Features */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`${f.span} bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl flex flex-col gap-md group hover:border-primary-container/40 transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container/20 transition-colors">
                    <f.icon size={20} />
                  </div>
                  <span className="text-label-sm uppercase tracking-wider text-on-surface-variant border border-outline-variant/30 px-sm py-xs rounded-full">
                    {f.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-headline-sm text-on-surface mb-xs">{f.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl">
          <div className="text-center mb-xl">
            <h2 className="text-headline-lg text-on-surface mb-sm">Up and running in minutes</h2>
            <p className="text-body-lg text-on-surface-variant">Four steps from zero to live profile.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-md"
              >
                <span className="text-5xl font-black text-primary-container/30">{s.n}</span>
                <div>
                  <h3 className="text-headline-sm text-on-surface mb-xs">{s.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin">
          <div className="bg-surface-container-low border border-primary-container/20 rounded-2xl p-xl md:p-[56px] flex flex-col md:flex-row items-center justify-between gap-xl">
            <div>
              <h2 className="text-headline-lg text-on-surface mb-sm">Ready to build your digital identity?</h2>
              <p className="text-body-lg text-on-surface-variant">Join 10,000+ creators already using BioLinks.</p>
            </div>
            <Link href="/login?mode=signup" className="shrink-0 bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-sm">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
