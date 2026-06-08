import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { CreditCard, CheckCircle, Clock, Search, Filter, TrendingUp } from 'lucide-react';
import PricingConfigForm from '@/components/admin/PricingConfigForm';

export default async function AdminPricingPage() {
  const supabase = await createAdminClient();

  // Fetch all premium users
  const { data: premiumUsers, error: usersError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, subscription_tier, updated_at')
    .in('subscription_tier', ['pro', 'pro max'])
    .order('updated_at', { ascending: false });

  // Fetch pricing plans (handle error if table doesn't exist yet)
  const { data: pricingPlans } = await supabase.from('pricing_plans').select('*');

  if (usersError) {
    return <div className="text-error p-xl">Error fetching pro users: {usersError.message}</div>;
  }

  return (
    <div className="space-y-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="text-headline-md text-on-surface">Pricing & Subscriptions</h2>
          <p className="text-body-md text-on-surface-variant">Track and manage your platform's revenue and premium users.</p>
        </div>
        <div className="flex gap-md">
          <button className="flex items-center gap-sm px-md py-sm bg-surface-container-high border border-outline-variant/20 rounded-lg text-on-surface font-medium hover:bg-surface-variant transition-all">
            <Filter size={18} /> Filters
          </button>
          <button className="flex items-center gap-sm px-md py-sm bg-primary-container text-on-primary-container rounded-lg font-bold hover:opacity-90 transition-all">
            Export Data
          </button>
        </div>
      </div>

      {/* Pricing Tiers Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Active Subscriptions</span>
            <CreditCard size={18} className="text-primary" />
          </div>
          <span className="text-3xl font-black text-on-surface">{premiumUsers?.length || 0}</span>
          <p className="text-label-sm text-emerald-400 flex items-center gap-xs">
            <TrendingUp size={14} /> +12% from last month
          </p>
        </div>
        {/* Mock other stats */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Churn Rate</span>
            <Clock size={18} className="text-orange-400" />
          </div>
          <span className="text-3xl font-black text-on-surface">2.4%</span>
          <p className="text-label-sm text-on-surface-variant">Across all segments</p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Avg. Revenue Per User</span>
            <CreditCard size={18} className="text-purple-400" />
          </div>
          <span className="text-3xl font-black text-on-surface">₹49 - ₹199</span>
          <p className="text-label-sm text-on-surface-variant">Monthly recurring</p>
        </div>
      </div>

      {/* Pricing Configuration Form */}
      <PricingConfigForm plans={pricingPlans} />

      {/* Pro Users Table */}
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden mt-xl">
        <div className="p-xl border-b border-outline-variant/10 flex items-center justify-between bg-surface/30">
          <h3 className="text-headline-sm text-on-surface">Premium Subscribers</h3>
          <div className="relative">
            <Search size={18} className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              placeholder="Search users..." 
              className="bg-surface-container-high border border-outline-variant/20 rounded-lg pl-xl pr-md py-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 text-label-sm uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/10">
                <th className="px-xl py-md font-bold">User</th>
                <th className="px-xl py-md font-bold">Plan</th>
                <th className="px-xl py-md font-bold">Status</th>
                <th className="px-xl py-md font-bold">Started</th>
                <th className="px-xl py-md font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {premiumUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-surface-variant/20 transition-colors group">
                  <td className="px-xl py-md">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 overflow-hidden flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-bold">{user.username?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-body-md font-bold text-on-surface">{user.full_name || 'Anonymous'}</p>
                        <p className="text-label-sm text-on-surface-variant">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-xl py-md">
                    <span className={`text-label-sm px-sm py-[2px] rounded uppercase font-bold tracking-wider ${
                      user.subscription_tier === 'pro max' ? 'bg-purple-400/20 text-purple-400' : 'bg-primary-container text-on-primary-container'
                    }`}>
                      {user.subscription_tier}
                    </span>
                  </td>
                  <td className="px-xl py-md">
                    <div className="flex items-center gap-xs text-emerald-400 text-body-sm font-medium">
                      <CheckCircle size={14} /> Active
                    </div>
                  </td>
                  <td className="px-xl py-md text-body-sm text-on-surface-variant">
                    {new Date(user.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-xl py-md">
                    <button className="text-label-sm text-primary font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {premiumUsers?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-xl py-xl text-center text-on-surface-variant italic">
                    No premium subscribers found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


