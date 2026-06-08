import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { Users, CreditCard, TrendingUp, UserPlus } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createAdminClient();

  // Fetch basic stats
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: proUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'pro');
  const { count: maxUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'pro max');
  
  // Fetch user growth from auth users
  const { data: { users: authUsers } = {} } = await supabase.auth.admin.listUsers();
  
  // Calculate new users today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newToday = authUsers?.filter(u => new Date(u.created_at) >= today).length || 0;

  // Calculate monthly growth for the last 5 months
  const monthlyData = [];
  const monthLabels = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.getMonth();
    const year = d.getFullYear();
    const count = authUsers?.filter(u => {
      const date = new Date(u.created_at);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length || 0;
    
    monthlyData.push(count);
    monthLabels.push(d.toLocaleDateString('default', { month: 'short' }));
  }
  
  // Normalize chart heights to max 100%
  const maxMonthly = Math.max(...monthlyData, 1);
  const normalizedData = monthlyData.map(count => (count / maxMonthly) * 100);

  // Fetch pricing plans
  const { data: pricingPlans } = await supabase.from('pricing_plans').select('*');
  const proPrice = pricingPlans?.find(p => p.tier_name === 'pro')?.monthly_price || 49;
  const maxPrice = pricingPlans?.find(p => p.tier_name === 'pro max')?.monthly_price || 199;

  // Calculate revenue
  const estimatedMRR = ((proUsers || 0) * proPrice) + ((maxUsers || 0) * maxPrice);

  const stats = [
    { label: 'Total Users', value: totalUsers || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pro/Max Subs', value: (proUsers || 0) + (maxUsers || 0), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Estimated MRR', value: `₹${estimatedMRR}`, icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'New Today', value: newToday, icon: UserPlus, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <div className="space-y-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
            <div className="flex items-center justify-between mb-md">
              <div className={`p-sm rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-on-surface-variant text-label-md uppercase tracking-wider">{stat.label}</p>
            <h2 className="text-3xl font-black text-on-surface mt-xs tracking-tight">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl">
          <h3 className="text-headline-sm text-on-surface mb-lg">User Growth</h3>
          <div className="h-64 flex items-end gap-xs">
            {normalizedData.map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-all relative group" style={{ height: `${h || 2}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-high px-xs py-[2px] rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                   {monthlyData[i]}
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-md text-label-sm text-on-surface-variant uppercase">
            {monthLabels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl">
          <h3 className="text-headline-sm text-on-surface mb-lg">Subscription Distribution</h3>
          <div className="space-y-md">
             <div>
               <div className="flex justify-between text-body-md mb-xs">
                 <span className="text-on-surface-variant">Free Plan</span>
                 <span className="text-on-surface font-bold">{((totalUsers || 0) - (proUsers || 0))} Users</span>
               </div>
               <div className="w-full bg-outline-variant/10 h-2 rounded-full overflow-hidden">
                 <div className="bg-primary/40 h-full" style={{ width: `${((totalUsers || 1) - (proUsers || 0)) / (totalUsers || 1) * 100}%` }} />
               </div>
             </div>
             <div>
               <div className="flex justify-between text-body-md mb-xs">
                 <span className="text-on-surface-variant">Pro Plan</span>
                 <span className="text-on-surface font-bold">{proUsers || 0} Users</span>
               </div>
               <div className="w-full bg-outline-variant/10 h-2 rounded-full overflow-hidden">
                 <div className="bg-primary h-full" style={{ width: `${(proUsers || 0) / (totalUsers || 1) * 100}%` }} />
               </div>
             </div>
             <div>
               <div className="flex justify-between text-body-md mb-xs">
                 <span className="text-on-surface-variant">Pro Max</span>
                 <span className="text-on-surface font-bold">{maxUsers || 0} Users</span>
               </div>
               <div className="w-full bg-outline-variant/10 h-2 rounded-full overflow-hidden">
                 <div className="bg-purple-400 h-full" style={{ width: `${(maxUsers || 0) / (totalUsers || 1) * 100}%` }} />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
