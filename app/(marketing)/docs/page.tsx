'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Zap, Settings, Globe, ChevronRight, Search } from 'lucide-react';

const categories = [
  {
    icon: Zap,
    title: 'Getting Started',
    color: 'text-primary-container',
    bg: 'bg-primary-container/10',
    articles: [
      { title: 'Creating your first BioLinks page', time: '2 min read' },
      { title: 'Setting up your profile', time: '3 min read' },
      { title: 'Adding and reordering links', time: '2 min read' },
      { title: 'Choosing a theme', time: '1 min read' },
    ],
  },
  {
    icon: Settings,
    title: 'Account & Billing',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    articles: [
      { title: 'Managing your subscription', time: '3 min read' },
      { title: 'Changing your username', time: '1 min read' },
      { title: 'Deleting your account', time: '2 min read' },
      { title: 'Invoices and receipts', time: '2 min read' },
    ],
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    articles: [
      { title: 'Connecting a custom domain', time: '5 min read' },
      { title: 'DNS configuration guide', time: '4 min read' },
      { title: 'SSL certificates', time: '2 min read' },
      { title: 'Troubleshooting domain issues', time: '3 min read' },
    ],
  },
  {
    icon: Book,
    title: 'Analytics',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    articles: [
      { title: 'Understanding your dashboard', time: '4 min read' },
      { title: 'Click tracking explained', time: '2 min read' },
      { title: 'Exporting analytics data', time: '2 min read' },
      { title: 'UTM parameters', time: '3 min read' },
    ],
  },
];

const quickLinks = [
  'How do I change my URL?',
  'Can I have multiple profiles?',
  'How do I add a YouTube video?',
  'What is the link limit on free?',
  'How to embed music?',
  'How to set a profile picture?',
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function DocsPage() {
  const [search, setSearch] = useState('');

  const filteredCategories = categories.map(cat => ({
    ...cat,
    articles: cat.articles.filter(a =>
      !search || a.title.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => !search || cat.articles.length > 0);

  return (
    <div className="wireframe-pattern min-h-screen">
      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-md sm:px-margin mb-xl text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
            Documentation
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-md" style={{ lineHeight: 1.05 }}>
            How can we help?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-xl">
            Guides, tutorials, and reference docs for everything in BioLinks.
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="Search documentation..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-[48px] pr-md py-md text-on-surface placeholder:text-on-surface-variant text-body-md focus:outline-none focus:border-primary-container/50 transition-colors"
            />
          </motion.div>
        </section>

        {/* Quick Links */}
        {!search && (
          <section className="max-w-4xl mx-auto px-md sm:px-margin mb-xl">
            <h2 className="text-label-sm uppercase tracking-wider text-on-surface-variant mb-md">Popular questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              {quickLinks.map((q, i) => (
                <motion.button key={q} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  onClick={() => setSearch(q)}
                  className="flex items-center justify-between gap-md bg-surface-container-low border border-outline-variant/10 rounded-lg px-md py-sm text-left text-body-md text-on-surface hover:border-outline-variant/40 hover:text-primary-container transition-all group">
                  {q}
                  <ChevronRight size={16} className="text-on-surface-variant group-hover:text-primary-container transition-colors shrink-0" />
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Doc Categories */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl">
          {search && filteredCategories.length === 0 && (
            <div className="text-center py-xl text-on-surface-variant">
              <p className="text-headline-sm mb-sm">No results for &quot;{search}&quot;</p>
              <button onClick={() => setSearch('')} className="text-primary-container hover:underline text-body-md">Clear search</button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {filteredCategories.map((cat, i) => (
              <motion.div key={cat.title} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl hover:border-outline-variant/30 transition-all">
                <div className="flex items-center gap-md mb-lg">
                  <div className={`w-10 h-10 rounded-lg ${cat.bg} flex items-center justify-center ${cat.color}`}>
                    <cat.icon size={20} />
                  </div>
                  <h2 className="text-headline-sm text-on-surface">{cat.title}</h2>
                </div>
                <ul className="space-y-sm">
                  {cat.articles.map(article => (
                    <li key={article.title}>
                      <button className="w-full flex items-center justify-between gap-md text-left group py-xs">
                        <span className="text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">{article.title}</span>
                        <div className="flex items-center gap-sm shrink-0">
                          <span className="text-label-sm text-on-surface-variant opacity-60">{article.time}</span>
                          <ChevronRight size={14} className="text-on-surface-variant group-hover:text-primary-container transition-colors" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Banner */}
        <section className="max-w-4xl mx-auto px-md sm:px-margin">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-xl text-center">
            <h2 className="text-headline-md text-on-surface mb-sm">Still need help?</h2>
            <p className="text-body-md text-on-surface-variant mb-lg">Our support team typically responds within a few hours.</p>
            <a href="mailto:hello@biolinks.io"
              className="inline-flex items-center gap-sm bg-primary-container text-on-primary-container px-xl py-md rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all">
              Contact Support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
