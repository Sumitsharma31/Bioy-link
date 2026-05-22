'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Compass, Zap, User } from 'lucide-react';

// Navbar and Footer are rendered by app/(marketing)/layout.tsx (a Server Component).
// This page stays 'use client' purely for framer-motion animations.

const LandingPage = () => {
  return (
    <div className="wireframe-pattern min-h-screen">
      <main className="pt-24 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-lg md:mb-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
            <div className="lg:col-span-5 flex flex-col gap-md">
              <span className="inline-flex items-center self-start px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary">
                Beta Access Now Open
              </span>
              <h1 className="text-headline-lg lg:text-6xl text-on-surface" style={{ lineHeight: 1.1 }}>
                The blueprint for your digital identity.
              </h1>
              <p className="text-body-lg text-on-surface-variant">
                A high-fidelity workspace for creators and freelancers to architect their presence. Connect everything you do in a single, minimal ecosystem.
              </p>
              <div className="flex gap-md mt-md flex-wrap">
                <Link
                  href="/login?mode=signup"
                  className="bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Build Your Page
                </Link>
                <Link
                  href="/demo"
                  className="border border-outline-variant text-on-surface px-xl py-md rounded-lg font-bold text-lg hover:bg-surface-variant active:scale-95 transition-all"
                >
                  View Demo
                </Link>
              </div>
            </div>

            <motion.div
              className="hidden lg:block lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Same card style as avatar cards */}
              <div className="rounded-xl bg-surface-container-low border border-outline-variant/20 ring-1 ring-outline-variant/10 shadow-2xl p-md flex items-center justify-center">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative">
                  <Image
                    src="/hero-mockup.png"
                    alt="BioLinks profile page preview"
                    fill
                    priority
                    className="object-cover object-center rounded-lg"
                    sizes="(max-width: 1024px) 0vw, 58vw"
                  />
                  {/* subtle corner vignette */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-surface-container-low/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bento Features Grid */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin py-lg md:py-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Modular Architecture — spans 2 cols */}
            <div className="md:col-span-2 bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl flex flex-col justify-between group hover:border-primary/20 transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-md text-primary text-2xl">⚙</div>
                <h3 className="text-headline-md text-on-surface mb-sm">Modular Architecture</h3>
                <p className="text-body-md text-on-surface-variant">
                  Drag, drop, and configure components. From custom buttons to live analytics widgets, your page grows with your career.
                </p>
              </div>
              <div className="mt-xl h-48 rounded-lg overflow-hidden relative">
                <Image
                  src="/modular-architecture.png"
                  alt="Modular Architecture — drag-and-drop component builder"
                  fill
                  className="object-cover object-top rounded-lg"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                {/* subtle bottom fade to blend with card */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/60 via-transparent to-transparent rounded-lg pointer-events-none" />
              </div>
            </div>

            {/* Structural Data */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl flex flex-col justify-between group hover:border-primary/20 transition-all">
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-md text-primary text-2xl">📊</div>
                <h3 className="text-headline-md text-on-surface mb-sm">Structural Data</h3>
                <p className="text-body-md text-on-surface-variant">
                  Deep insights into how your audience interacts with your links.
                </p>
              </div>
              <div className="mt-xl h-48 rounded-lg overflow-hidden relative">
                <Image
                  src="/structural-data.png"
                  alt="Structural Data — link analytics dashboard"
                  fill
                  className="object-cover object-top rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* subtle bottom fade to blend with card */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low/60 via-transparent to-transparent rounded-lg pointer-events-none" />
              </div>
            </div>

            {/* Design System */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl group hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-md text-primary text-2xl">🎨</div>
              <h3 className="text-headline-md text-on-surface mb-sm">Design System</h3>
              <p className="text-body-md text-on-surface-variant">
                Access a library of themes optimized for high conversion and readability.
              </p>
            </div>

            {/* Offline Nodes */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl group hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-md text-primary text-2xl">📱</div>
              <h3 className="text-headline-md text-on-surface mb-sm">Offline Nodes</h3>
              <p className="text-body-md text-on-surface-variant">
                Generate professional QR codes that match your brand identity perfectly.
              </p>
            </div>

            {/* Live Integration */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl group hover:border-primary/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-md text-primary text-2xl">🔗</div>
              <h3 className="text-headline-md text-on-surface mb-sm">Live Integration</h3>
              <p className="text-body-md text-on-surface-variant">
                Sync with your shop, newsletter, or portfolio platforms seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Showcase Gallery */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin py-lg md:py-xl overflow-hidden">
          <h2 className="text-headline-lg text-on-surface mb-xl text-center">
            Trusted by 10,000+ Architects of Culture
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
            {[
              { src: '/avatar-1.png', name: 'Arjun Dev', role: 'Content Creator' },
              { src: '/avatar-2.png', name: 'Zara Okafor', role: 'Photographer' },
              { src: '/avatar-3.png', name: 'Liam Cole', role: 'Developer' },
              { src: '/avatar-4.png', name: 'Sofia Reyes', role: 'Digital Artist' },
              { src: '/avatar-5.png', name: 'Mia Chen', role: 'Influencer' },
              { src: '/avatar-6.png', name: 'Omar Khalil', role: 'Musician' },
            ].map((creator) => (
              <div
                key={creator.name}
                className="flex flex-col items-center gap-sm group cursor-pointer"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden relative ring-1 ring-outline-variant/20 group-hover:ring-primary/40 transition-all duration-300">
                  <Image
                    src={creator.src}
                    alt={creator.name}
                    fill
                    className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  {/* lime tint overlay that fades on hover */}
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-all duration-300 pointer-events-none" />
                </div>
                <div className="text-center">
                  <p className="text-label-md text-on-surface font-bold truncate w-full">{creator.name}</p>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider">{creator.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin py-lg md:py-xl">
          <div className="flex flex-col items-center text-center mb-xl">
            <h2 className="text-headline-lg text-on-surface mb-sm">Simple Structural Tiers</h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Choose the plan that matches your current scale. No hidden fees, just pure utility.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Standard */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl flex flex-col h-full">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant mb-sm">Standard</span>
              <div className="flex items-baseline gap-xs mb-md">
                <span className="text-headline-lg text-on-surface">₹0</span>
                <span className="text-body-md text-on-surface-variant">/month</span>
              </div>
              <ul className="flex-grow space-y-md mb-xl">
                <li className="flex items-center gap-sm text-body-md text-on-surface-variant"><span className="text-sm">✓</span> 5 Core Links</li>
                <li className="flex items-center gap-sm text-body-md text-on-surface-variant"><span className="text-sm">✓</span> Basic Analytics</li>
                <li className="flex items-center gap-sm text-body-md text-on-surface-variant"><span className="text-sm">✓</span> Standard Branding</li>
              </ul>
              <Link href="/login?mode=signup" className="w-full py-sm border border-outline-variant rounded-lg font-bold text-on-surface hover:bg-surface-variant transition-all flex items-center justify-center">
                Get Started
              </Link>
            </div>

            {/* Pro — Highlighted */}
            <div className="bg-surface-container border-2 border-primary-container rounded-xl p-xl flex flex-col h-full relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-md py-xs rounded-full text-label-sm uppercase tracking-wider">
                Most Adopted
              </span>
              <span className="text-label-sm uppercase tracking-wider text-primary mb-sm">Pro</span>
              <div className="flex items-baseline gap-xs mb-md">
                <span className="text-headline-lg text-on-surface">₹49</span>
                <span className="text-body-md text-on-surface-variant">/month</span>
              </div>
              <ul className="flex-grow space-y-md mb-xl">
                <li className="flex items-center gap-sm text-body-md text-on-surface"><span className="text-primary text-sm">✓</span> Unlimited Links</li>
                <li className="flex items-center gap-sm text-body-md text-on-surface"><span className="text-primary text-sm">✓</span> Advanced Analytics</li>
                <li className="flex items-center gap-sm text-body-md text-on-surface"><span className="text-primary text-sm">✓</span> Custom Domain</li>
                <li className="flex items-center gap-sm text-body-md text-on-surface"><span className="text-primary text-sm">✓</span> Removal of Watermark</li>
              </ul>
              <Link href="/pricing?plan=Pro&auto=true" className="w-full py-sm bg-primary-container text-on-primary-container rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center">
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl flex flex-col h-full">
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant mb-sm">Pro Max</span>
              <div className="flex items-baseline gap-xs mb-md">
                <span className="text-headline-lg text-on-surface">₹199</span>
                <span className="text-body-md text-on-surface-variant">/month</span>
              </div>
              <ul className="flex-grow space-y-md mb-xl">
                <li className="flex items-center gap-sm text-body-md text-on-surface-variant"><span className="text-sm">✓</span> Priority Support</li>
                <li className="flex items-center gap-sm text-body-md text-on-surface-variant"><span className="text-sm">✓</span> Team Collaboration</li>
                <li className="flex items-center gap-sm text-body-md text-on-surface-variant"><span className="text-sm">✓</span> Multi-Page Management</li>
              </ul>
              <Link href="/pricing?plan=Pro+Max&auto=true" className="w-full py-sm border border-outline-variant rounded-lg font-bold text-on-surface hover:bg-surface-variant transition-all flex items-center justify-center">
                Upgrade to Max
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-background/80 backdrop-blur-md border-t border-outline-variant/20 md:hidden h-16 flex items-center">
        <div className="flex-1 flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center gap-1 text-primary">
            <Home size={20} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/showcase" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <Compass size={20} />
            <span className="text-[10px]">Explore</span>
          </Link>
          <Link href="/pricing" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <Zap size={20} />
            <span className="text-[10px]">Pricing</span>
          </Link>
          <Link href="/login" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <User size={20} />
            <span className="text-[10px]">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default LandingPage;
