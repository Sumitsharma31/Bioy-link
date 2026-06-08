'use client';

import React, { useState } from 'react';
import { updatePricing } from '@/app/admin/pricing/actions';

type PricingPlan = {
  tier_name: string;
  monthly_price: number;
  annual_price: number;
};

export default function PricingConfigForm({ plans }: { plans: PricingPlan[] | null }) {
  const defaultPro = plans?.find(p => p.tier_name === 'pro') || { tier_name: 'pro', monthly_price: 49, annual_price: 490 };
  const defaultProMax = plans?.find(p => p.tier_name === 'pro max') || { tier_name: 'pro max', monthly_price: 199, annual_price: 1990 };

  const [proMonthly, setProMonthly] = useState(defaultPro.monthly_price);
  const [proAnnual, setProAnnual] = useState(defaultPro.annual_price);
  const [proMaxMonthly, setProMaxMonthly] = useState(defaultProMax.monthly_price);
  const [proMaxAnnual, setProMaxAnnual] = useState(defaultProMax.annual_price);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res1 = await updatePricing('pro', proMonthly, proAnnual);
    const res2 = await updatePricing('pro max', proMaxMonthly, proMaxAnnual);

    if (res1.success && res2.success) {
      setMessage('Pricing updated successfully!');
    } else {
      setMessage(`Error: ${res1.error || res2.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl mt-xl">
      <h3 className="text-headline-sm text-on-surface mb-lg">Update Pricing Models</h3>
      
      <form onSubmit={handleSave} className="space-y-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Pro Plan */}
          <div className="bg-surface-container border border-outline-variant/20 rounded-lg p-lg space-y-md">
            <h4 className="text-title-md font-bold text-on-surface uppercase tracking-wider text-emerald-400">Pro Plan</h4>
            <div className="space-y-sm">
              <label className="text-label-sm text-on-surface-variant font-bold">Monthly Price (₹)</label>
              <input 
                type="number" 
                value={proMonthly} 
                onChange={(e) => setProMonthly(Number(e.target.value))}
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div className="space-y-sm">
              <label className="text-label-sm text-on-surface-variant font-bold">Annual Price (₹)</label>
              <input 
                type="number" 
                value={proAnnual} 
                onChange={(e) => setProAnnual(Number(e.target.value))}
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          {/* Pro Max Plan */}
          <div className="bg-surface-container border border-outline-variant/20 rounded-lg p-lg space-y-md">
            <h4 className="text-title-md font-bold text-on-surface uppercase tracking-wider text-purple-400">Pro Max Plan</h4>
            <div className="space-y-sm">
              <label className="text-label-sm text-on-surface-variant font-bold">Monthly Price (₹)</label>
              <input 
                type="number" 
                value={proMaxMonthly} 
                onChange={(e) => setProMaxMonthly(Number(e.target.value))}
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
            <div className="space-y-sm">
              <label className="text-label-sm text-on-surface-variant font-bold">Annual Price (₹)</label>
              <input 
                type="number" 
                value={proMaxAnnual} 
                onChange={(e) => setProMaxAnnual(Number(e.target.value))}
                className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button 
            type="submit" 
            disabled={loading}
            className="px-xl py-sm bg-primary text-on-primary rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Pricing Changes'}
          </button>
          {message && (
            <span className={`text-label-sm font-bold ${message.includes('Error') ? 'text-error' : 'text-emerald-400'}`}>
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
