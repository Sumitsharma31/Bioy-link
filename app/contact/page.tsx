'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Zap, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const channels = [
  { icon: Mail, title: 'Email Support', description: 'For billing, account issues, and general questions.', contact: 'hello@biolinks.io', action: 'mailto:hello@biolinks.io', label: 'Send Email', response: 'Typically replies within 4–8 hours' },
  { icon: MessageSquare, title: 'Live Chat', description: 'Available to Pro and Enterprise users via the dashboard.', contact: null, action: '/login', label: 'Open Dashboard', response: 'Mon–Fri, 9am–6pm PST' },
  { icon: BookOpen, title: 'Documentation', description: 'Find answers to common questions in our knowledge base.', contact: null, action: '/docs', label: 'Browse Docs', response: 'Available 24/7' },
  { icon: Zap, title: 'Enterprise Sales', description: 'Discuss custom plans, white-labeling, and team accounts.', contact: 'sales@biolinks.io', action: 'mailto:sales@biolinks.io', label: 'Contact Sales', response: 'Typically replies within 24 hours' },
];

const topics = ['General Question', 'Bug Report', 'Feature Request', 'Billing & Subscription', 'Account & Security', 'Partnership / Press'];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="wireframe-pattern min-h-screen">
      <Navbar />
      <main className="pt-28 pb-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
            Get In Touch
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-md" style={{ lineHeight: 1.05 }}>
            We&apos;re here to help.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Choose the channel that works best for you, or fill out the form below.
          </motion.p>
        </section>

        {/* Contact Channels */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {channels.map((ch, i) => (
              <motion.div key={ch.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-md hover:border-outline-variant/40 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container/20 transition-colors">
                  <ch.icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-headline-sm text-on-surface mb-xs">{ch.title}</h3>
                  <p className="text-body-md text-on-surface-variant mb-sm">{ch.description}</p>
                  <p className="text-label-sm text-on-surface-variant opacity-70">{ch.response}</p>
                </div>
                <a href={ch.action}
                  className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-primary-container font-bold hover:underline">
                  {ch.label} <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-3xl mx-auto px-md sm:px-margin">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-xl">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-xl">
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-lg" />
                <h2 className="text-headline-md text-on-surface mb-sm">Message sent!</h2>
                <p className="text-body-md text-on-surface-variant mb-lg">
                  Thanks for reaching out, {form.name}. We&apos;ll get back to you at {form.email} within 4–8 hours.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                  className="text-primary-container font-bold hover:underline text-body-md">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-headline-md text-on-surface mb-xs">Send us a message</h2>
                <p className="text-body-md text-on-surface-variant mb-xl">Fill out the form and we&apos;ll get back to you shortly.</p>
                <form onSubmit={handleSubmit} className="space-y-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs" htmlFor="name">Full Name</label>
                      <input id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Alex Rivera"
                        className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm placeholder:text-on-surface-variant/50" />
                    </div>
                    <div>
                      <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs" htmlFor="email">Email Address</label>
                      <input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@creator.com"
                        className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm placeholder:text-on-surface-variant/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs" htmlFor="topic">Topic</label>
                    <select id="topic" required value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
                      className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm">
                      <option value="" disabled>Select a topic…</option>
                      {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs" htmlFor="message">Message</label>
                    <textarea id="message" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help…"
                      className="w-full bg-surface-container-high border border-outline-variant/20 focus:ring-0 focus:border-primary px-md py-sm text-on-surface text-body-md rounded-lg resize-none placeholder:text-on-surface-variant/50" />
                  </div>
                  <button type="submit"
                    className="w-full py-md bg-primary-container text-on-primary-container rounded-lg font-bold flex items-center justify-center gap-sm hover:opacity-90 active:scale-[0.98] transition-all">
                    Send Message <ArrowRight size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
