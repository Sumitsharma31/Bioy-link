'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const plans = [
  {
    name: 'Standard',
    price: { monthly: 0, annual: 0 },
    description: 'Everything you need to get started.',
    features: ['5 Core Links', 'Basic Analytics', 'Standard Branding', 'QR Code Generator', 'Public Profile Page'],
    cta: 'Get Started Free',
    href: '/login?mode=signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 12, annual: 9 },
    description: 'For creators serious about growth.',
    features: ['Unlimited Links', 'Advanced Analytics', 'Custom Domain', 'Remove Watermark', 'Priority Support', 'Branded QR Codes', 'Scheduled Links'],
    cta: 'Upgrade to Pro',
    href: '/login?mode=signup',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: { monthly: 49, annual: 39 },
    description: 'Built for teams and agencies.',
    features: ['Everything in Pro', 'Team Collaboration', 'Multi-Page Management', 'API Access', 'White-label Solution', 'Dedicated Account Manager', 'Custom Contracts'],
    cta: 'Contact Sales',
    href: 'mailto:hello@biolinks.io',
    highlight: false,
  },
];

const faqs = [
  { q: 'Can I switch plans anytime?', a: 'Yes. You can upgrade, downgrade, or cancel at any time. Changes take effect immediately with prorated billing.' },
  { q: 'Is there a free trial for Pro?', a: 'Yes — new accounts get a 14-day Pro trial automatically. No credit card required.' },
  { q: 'What counts as a custom domain?', a: 'You can point any domain or subdomain you own (e.g. links.yourbrand.com) to your BioLinks profile.' },
  { q: 'How does billing work?', a: 'Monthly plans are billed each month. Annual plans are charged once per year and save you up to 25%.' },
  { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee on all paid plans, no questions asked.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } }),
};

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="wireframe-pattern min-h-screen">
      <Navbar />
      <main className="pt-28 pb-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
            Simple Pricing
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-on-surface tracking-tight mb-md" style={{ lineHeight: 1.05 }}>
            Pay for what you need.<br /><span className="text-primary-container">Nothing more.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-xl">
            Start free forever. Upgrade when your audience grows.
          </motion.p>

          {/* Toggle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-md bg-surface-container-low border border-outline-variant/20 rounded-full p-xs">
            <button onClick={() => setAnnual(false)}
              className={`px-md py-sm rounded-full text-label-sm uppercase tracking-wider font-bold transition-all ${!annual ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              className={`px-md py-sm rounded-full text-label-sm uppercase tracking-wider font-bold transition-all flex items-center gap-xs ${annual ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}>
              Annual <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-xs py-[2px] rounded-full">Save 25%</span>
            </button>
          </motion.div>
        </section>

        {/* Plans */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin mb-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md items-stretch">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className={`rounded-xl p-xl flex flex-col relative ${
                  plan.highlight
                    ? 'bg-surface-container border-2 border-primary-container shadow-[0_0_40px_rgba(210,232,35,0.08)]'
                    : 'bg-surface-container-low border border-outline-variant/10'
                }`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-md py-xs rounded-full text-label-sm uppercase tracking-wider flex items-center gap-xs">
                    <Zap size={12} /> {plan.badge}
                  </span>
                )}
                <div className="mb-xl">
                  <span className={`text-label-sm uppercase tracking-wider font-bold ${plan.highlight ? 'text-primary' : 'text-on-surface-variant'}`}>{plan.name}</span>
                  <div className="flex items-baseline gap-xs mt-sm mb-xs">
                    <span className="text-5xl font-black text-on-surface">${annual ? plan.price.annual : plan.price.monthly}</span>
                    <span className="text-body-md text-on-surface-variant">/mo</span>
                  </div>
                  {annual && plan.price.monthly > 0 && (
                    <span className="text-label-sm text-emerald-400">Billed annually — save ${(plan.price.monthly - plan.price.annual) * 12}/yr</span>
                  )}
                  <p className="text-body-md text-on-surface-variant mt-sm">{plan.description}</p>
                </div>
                <ul className="flex-grow space-y-md mb-xl">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-sm text-body-md text-on-surface">
                      <Check size={16} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-primary-container' : 'text-on-surface-variant'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`w-full py-md rounded-lg font-bold text-center flex items-center justify-center gap-sm transition-all active:scale-95 ${
                    plan.highlight
                      ? 'bg-primary-container text-on-primary-container hover:opacity-90'
                      : 'border border-outline-variant text-on-surface hover:bg-surface-variant'
                  }`}>
                  {plan.cta} {plan.highlight && <ArrowRight size={16} />}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-md sm:px-margin mb-xl">
          <h2 className="text-headline-lg text-on-surface text-center mb-xl">Frequently asked questions</h2>
          <div className="space-y-sm">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-lg py-md text-left gap-md">
                  <span className="text-headline-sm text-on-surface">{faq.q}</span>
                  <span className={`text-primary-container text-xl font-bold shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-lg pb-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-md">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-md sm:px-margin">
          <div className="bg-surface-container-low border border-primary-container/20 rounded-2xl p-xl md:p-[56px] flex flex-col md:flex-row items-center justify-between gap-xl">
            <div>
              <h2 className="text-headline-lg text-on-surface mb-sm">Start free. Grow without limits.</h2>
              <p className="text-body-lg text-on-surface-variant">No credit card required. Cancel anytime.</p>
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
