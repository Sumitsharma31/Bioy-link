'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const categories = ['All', 'Creator', 'Developer', 'Designer', 'Musician', 'Entrepreneur'];

const profiles = [
  { username: 'alexcreator', name: 'Alex Rivera', role: 'Content Creator', category: 'Creator', links: 12, views: '48K', gradient: 'from-primary-container/30' },
  { username: 'maya_dev', name: 'Maya Chen', role: 'Full-Stack Engineer', category: 'Developer', links: 8, views: '22K', gradient: 'from-purple-500/20' },
  { username: 'zach_design', name: 'Zachary Brooks', role: 'UI/UX Designer', category: 'Designer', links: 15, views: '67K', gradient: 'from-sky-500/20' },
  { username: 'nova_beats', name: 'Nova Williams', role: 'Music Producer', category: 'Musician', links: 6, views: '130K', gradient: 'from-pink-500/20' },
  { username: 'james_builds', name: 'James Park', role: 'Serial Founder', category: 'Entrepreneur', links: 10, views: '91K', gradient: 'from-orange-500/20' },
  { username: 'sara_codes', name: 'Sara Okafor', role: 'DevRel Engineer', category: 'Developer', links: 9, views: '34K', gradient: 'from-emerald-500/20' },
  { username: 'luna_art', name: 'Luna Torres', role: 'Illustrator', category: 'Designer', links: 7, views: '55K', gradient: 'from-violet-500/20' },
  { username: 'riff_collective', name: 'Riff Collective', role: 'Indie Band', category: 'Musician', links: 11, views: '29K', gradient: 'from-red-500/20' },
  { username: 'nadia_growth', name: 'Nadia Sato', role: 'Growth Marketer', category: 'Entrepreneur', links: 14, views: '78K', gradient: 'from-yellow-500/20' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function ShowcasePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? profiles : profiles.filter(p => p.category === activeCategory);

  return (
    <div className="wireframe-pattern min-h-screen">
      <Navbar />
      <main className="pt-28 pb-24">
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
            Community Showcase
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-md" style={{ lineHeight: 1.05 }}>
            Real pages.<br /><span className="text-primary-container">Real creators.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Explore how creators across every discipline use BioLinks to build their digital presence.
          </motion.p>
        </section>

        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl">
          <div className="flex gap-sm flex-wrap justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-md py-sm rounded-full text-label-sm uppercase tracking-wider font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-primary-container text-on-primary-container border-primary-container'
                    : 'border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {filtered.map((p, i) => (
              <motion.div key={p.username} custom={i} initial="hidden" animate="show" variants={fadeUp}
                className="group bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden hover:border-outline-variant/40 transition-all duration-300 hover:-translate-y-1">
                <div className={`h-32 bg-gradient-to-br ${p.gradient} to-transparent relative overflow-hidden`}>
                  <div className="absolute inset-0 wireframe-pattern opacity-20" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-surface-container-high border-4 border-surface-container-low flex items-center justify-center">
                    <span className="text-headline-sm font-black text-on-surface-variant">{p.name[0]}</span>
                  </div>
                </div>
                <div className="pt-10 px-lg pb-lg">
                  <div className="text-center mb-lg">
                    <h3 className="text-headline-sm text-on-surface font-bold">{p.name}</h3>
                    <p className="text-body-md text-on-surface-variant mt-xs">{p.role}</p>
                    <span className="inline-block mt-sm text-label-sm uppercase tracking-wider px-sm py-xs rounded-full border border-outline-variant/30 text-on-surface-variant">{p.category}</span>
                  </div>
                  <div className="flex justify-center gap-xl mb-lg">
                    <div className="text-center">
                      <div className="text-headline-sm font-black text-on-surface">{p.links}</div>
                      <div className="text-label-sm text-on-surface-variant uppercase">Links</div>
                    </div>
                    <div className="w-px bg-outline-variant/20" />
                    <div className="text-center">
                      <div className="text-headline-sm font-black text-on-surface">{p.views}</div>
                      <div className="text-label-sm text-on-surface-variant uppercase">Views</div>
                    </div>
                  </div>
                  <Link href={`/${p.username}`}
                    className="w-full flex items-center justify-center gap-sm py-sm border border-outline-variant/30 rounded-lg text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-primary-container hover:border-primary-container/30 transition-all">
                    View Page <ExternalLink size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-md sm:px-margin">
          <div className="bg-surface-container-low border border-primary-container/20 rounded-2xl p-xl md:p-[56px] flex flex-col md:flex-row items-center justify-between gap-xl">
            <div>
              <h2 className="text-headline-lg text-on-surface mb-sm">Add your page to the showcase</h2>
              <p className="text-body-lg text-on-surface-variant">Create your BioLinks profile and join the community.</p>
            </div>
            <Link href="/login?mode=signup" className="shrink-0 bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-sm">
              Build Yours <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
