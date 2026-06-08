'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Compass, Zap, User } from 'lucide-react';

// Navbar and Footer are rendered by app/(marketing)/layout.tsx (a Server Component).
// This page stays 'use client' purely for framer-motion animations.

const LandingPage = () => {
  const [proPrice, setProPrice] = useState(49);
  const [maxPrice, setMaxPrice] = useState(199);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    async function fetchData() {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Fetch user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Fetch pricing
      const { data } = await supabase.from('pricing_plans').select('*');
      if (data) {
        const pro = data.find(p => p.tier_name === 'pro');
        const max = data.find(p => p.tier_name === 'pro max');
        if (pro) setProPrice(pro.monthly_price);
        if (max) setMaxPrice(max.monthly_price);
      }
    }
    fetchData();
  }, []);

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
                {user ? (
                  <Link
                    href="/dashboard"
                    className="bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            <motion.div
              className="hidden lg:block lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="aspect-[4/3] rounded-xl relative flex items-center justify-center">
                <Image
                  src="/hero-mockup.png"
                  alt="BioLinks Digital Identity Blueprint"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_0_40px_rgba(210,232,35,0.2)]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
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
              { name: 'Arjun Dev', role: 'CONTENT CREATOR', image: '/avatar-1.png' },
              { name: 'Zara Okafor', role: 'PHOTOGRAPHER', image: '/avatar-2.png' },
              { name: 'Liam Cole', role: 'DEVELOPER', image: '/avatar-3.png' },
              { name: 'Sofia Reyes', role: 'DIGITAL ARTIST', image: '/avatar-4.png' },
              { name: 'Mia Chen', role: 'INFLUENCER', image: '/avatar-5.png' },
              { name: 'Omar Khalil', role: 'MUSICIAN', image: '/avatar-6.png' },
            ].map((user, i) => (
              <div key={i} className="flex flex-col items-center gap-sm group">
                <div className="aspect-square w-full relative rounded-lg overflow-hidden border border-outline-variant/10 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <Image src={user.image} alt={user.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw" />
                </div>
                <div className="text-center">
                  <div className="text-body-md font-bold text-on-surface">{user.name}</div>
                  <div className="text-[10px] tracking-widest uppercase text-on-surface-variant font-bold">{user.role}</div>
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
              <Link href={user ? "/dashboard" : "/login?mode=signup"} className="w-full py-sm border border-outline-variant rounded-lg font-bold text-on-surface hover:bg-surface-variant transition-all flex items-center justify-center">
                {user ? "Dashboard" : "Get Started"}
              </Link>
            </div>

            {/* Pro — Highlighted */}
            <div className="bg-surface-container border-2 border-primary-container rounded-xl p-xl flex flex-col h-full relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-md py-xs rounded-full text-label-sm uppercase tracking-wider">
                Most Adopted
              </span>
              <span className="text-label-sm uppercase tracking-wider text-primary mb-sm">Pro</span>
              <div className="flex items-baseline gap-xs mb-md">
                <span className="text-headline-lg text-on-surface">₹{proPrice}</span>
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
                <span className="text-headline-lg text-on-surface">₹{maxPrice}</span>
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
    </div>
  );
};

export default LandingPage;
