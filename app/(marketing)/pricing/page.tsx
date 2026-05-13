'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap } from 'lucide-react';
import Script from 'next/script';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

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
    price: { monthly: 49, annual: 39 },
    description: 'For creators serious about growth.',
    features: ['Unlimited Links', 'Advanced Analytics', 'Custom Domain', 'Remove Watermark', 'Priority Support', 'Branded QR Codes', 'Scheduled Links'],
    cta: 'Upgrade to Pro',
    href: '/login?mode=signup',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Pro Max',
    price: { monthly: 199, annual: 149 },
    description: 'The ultimate power for professionals.',
    features: ['Everything in Pro', 'Team Collaboration', 'Advanced Customization', 'API Access', 'White-label Solution', 'Priority Support 24/7', 'Detailed Insights'],
    cta: 'Upgrade to Max',
    href: '/login?mode=signup',
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
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);

  const handleUpgrade = async (plan: any) => {
    try {
      setLoading(plan.name);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?mode=signup');
        return;
      }

      // Check if already pro
      if (user.user_metadata?.subscription_tier === 'pro' && plan.name === 'Pro') {
        alert('You are already on the Pro plan!');
        return;
      }

      // 1. Create order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: annual ? plan.price.annual : plan.price.monthly,
          planName: plan.name,
        }),
      });

      const order = await res.json();

      if (order.error) throw new Error(order.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'BioLinks',
        description: `Upgrade to ${plan.name} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              planName: plan.name,
              userId: user.id,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.status === 'ok') {
            alert('Payment successful! Your account has been upgraded.');
            router.push('/dashboard');
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#d2e823',
        },
        modal: {
          ondismiss: function() {
            setLoading(null);
            // Ensure scroll is restored if Razorpay failed to clean up
            document.body.style.overflow = 'auto';
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Upgrade error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // ✅ Auto-trigger payment if URL has ?auto=true&plan=Pro
  useEffect(() => {
    const auto = searchParams.get('auto');
    const planName = searchParams.get('plan');

    if (auto === 'true' && planName === 'Pro' && !hasAutoTriggered) {
      const proPlan = plans.find(p => p.name === 'Pro');
      if (proPlan) {
        setHasAutoTriggered(true);
        
        // Only trigger if we're reasonably sure they aren't already pro
        // (handleUpgrade handles the heavy lifting of fetching user)
        handleUpgrade(proPlan);
      }
    }
  }, [searchParams, hasAutoTriggered]);

  return (
    <div className="wireframe-pattern min-h-screen">
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
                className={`rounded-xl p-xl flex flex-col relative ${plan.highlight
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
                    <span className="text-5xl font-black text-on-surface">₹{annual ? plan.price.annual : plan.price.monthly}</span>
                    <span className="text-body-md text-on-surface-variant">/mo</span>
                  </div>
                  {annual && plan.price.monthly > 0 && (
                    <span className="text-label-sm text-emerald-400">Billed annually — save ₹{(plan.price.monthly - plan.price.annual) * 12}/yr</span>
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
                {plan.name === 'Standard' ? (
                  <Link href={plan.href}
                    className={`w-full py-md rounded-lg font-bold text-center flex items-center justify-center gap-sm transition-all active:scale-95 ${plan.highlight
                        ? 'bg-primary-container text-on-primary-container hover:opacity-90'
                        : 'border border-outline-variant text-on-surface hover:bg-surface-variant'
                      }`}>
                    {plan.cta} {plan.highlight && <ArrowRight size={16} />}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={loading === plan.name}
                    className={`w-full py-md rounded-lg font-bold text-center flex items-center justify-center gap-sm transition-all active:scale-95 disabled:opacity-50 ${plan.highlight
                        ? 'bg-primary-container text-on-primary-container hover:opacity-90'
                        : 'border border-outline-variant text-on-surface hover:bg-surface-variant'
                      }`}>
                    {loading === plan.name ? 'Processing...' : plan.cta} {plan.highlight && <ArrowRight size={16} />}
                  </button>
                )}
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


      </main>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
