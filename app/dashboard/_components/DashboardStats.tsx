// app/dashboard/_components/DashboardStats.tsx
// Async Server Component — fetches its own data and streams in independently
import { createClient } from '@/lib/supabase/server';
import { getCachedProfile, getCachedAppearance } from '@/lib/queries';
import Link from 'next/link';
import { Share2, Plus, Globe, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import RefreshButton from '@/components/dashboard/RefreshButton';
import ShareButton from '@/components/dashboard/ShareButton';

export async function DashboardStats({ userId }: { userId: string }) {
  const supabase = await createClient();

  // ✅ Parallel: profile, appearance, and links fire simultaneously
  const [profile, appearance, { data: links }] = await Promise.all([
    getCachedProfile(userId),
    getCachedAppearance(userId),
    supabase.from('links').select('id, is_active, title, url, clicks').eq('profile_id', userId).order('order_index', { ascending: true }),
  ]);

  const activeLinksCount = links?.filter(l => l.is_active).length || 0;
  const totalClicks = links?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0;
  const profileViews = profile?.views || 0;

  return (
    <>
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-md pt-sm md:pt-0">
        <div>
          <h1 className="text-headline-lg text-on-surface">Dashboard</h1>
          <p className="text-body-md text-on-surface-variant mt-xs">
            Welcome back, {profile?.username}. Manage your creator profile and link ecosystem.
          </p>
        </div>
        <div className="flex gap-md items-center">
          <RefreshButton />
          {profile?.username && <ShareButton username={profile.username} />}
          <Link href="/dashboard/links" className="bg-primary-container text-on-primary-container px-md md:px-lg py-sm rounded-lg text-label-md font-bold flex items-center gap-sm active:scale-95 transition-all">
            <Plus size={18} /> Add Link
          </Link>
        </div>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-md lg:gap-lg">
        <div className="sm:col-span-2 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-md">
          {[
            { label: 'Active Links', value: activeLinksCount, change: 'Total', color: 'text-primary-fixed-dim' },
            { label: 'Views', value: profileViews, change: 'Total', color: 'text-on-surface-variant' },
            { label: 'Clicks', value: totalClicks, change: 'Total', color: 'text-on-surface-variant' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-low border border-outline-variant/10 p-md rounded-xl flex flex-col justify-between">
              <span className="text-label-sm text-on-surface-variant uppercase">{stat.label}</span>
              <div className="mt-md flex items-baseline gap-xs">
                <span className="text-headline-md text-on-surface">{stat.value}</span>
                <span className={`text-[10px] ${stat.color}`}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="sm:col-span-2 lg:col-span-4 bg-primary-container/10 border border-primary-container/30 p-md rounded-xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-sm opacity-20">
            <Sparkles size={48} />
          </div>
          <span className="text-label-md text-primary-container font-bold mb-xs">Next Level</span>
          <p className="text-body-md text-on-surface">Unlock Advanced Analytics &amp; Custom Domains.</p>
          <button className="mt-md text-primary font-bold text-label-md flex items-center gap-xs">
            Learn More <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Top Links */}
      <div className="space-y-md">
        <div className="flex justify-between items-center">
          <h2 className="text-headline-sm text-on-surface">Top Links</h2>
          <Link href="/dashboard/links" className="text-primary text-label-sm hover:underline">View all</Link>
        </div>
        {links?.slice(0, 3).map((link) => (
          <div key={link.id} className="bg-surface-container-low border border-outline-variant/10 p-md rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-md hover:border-outline/50 transition-colors">
            <div className="flex items-center gap-md flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                <Globe size={20} className="text-primary-fixed-dim" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-sm flex-wrap">
                  <span className="text-label-md text-on-surface font-bold">{link.title}</span>
                  {!link.is_active && <span className="bg-surface-variant px-xs py-[2px] rounded text-[10px] font-bold text-on-surface-variant">HIDDEN</span>}
                </div>
                <span className="text-body-md text-on-surface-variant truncate block">{link.url}</span>
              </div>
            </div>
            <div className="flex items-center gap-md w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-outline-variant/10 pt-sm sm:pt-0">
              <div className="flex flex-col items-end px-md">
                <span className="text-label-sm text-on-surface-variant uppercase">Clicks</span>
                <span className="text-label-lg font-black text-on-surface">{link.clicks || 0}</span>
              </div>
              <div className="flex gap-sm">
                <Link href="/dashboard/links" className="p-xs sm:p-sm hover:bg-surface-variant rounded-lg transition-colors">
                  <BarChart3 size={18} className="text-on-surface-variant" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {links?.length === 0 && (
          <div className="text-center py-lg text-on-surface-variant">No links added yet.</div>
        )}
      </div>

      {/* Theme Card */}
      <div className="bg-surface-container-low border border-outline-variant/10 p-md sm:p-lg rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-lg">
        <div className="flex-1">
          <h3 className="text-headline-sm text-on-surface">Visual Theme</h3>
          <p className="text-body-md text-on-surface-variant mt-sm">
            You are currently using the <strong className="text-on-surface">"{appearance?.theme_preset || 'Modern Lime'}"</strong> theme.
          </p>
          <Link href="/dashboard/appearance" className="inline-block mt-md px-md py-sm border border-outline-variant/30 rounded-lg text-label-md hover:bg-surface-variant transition-colors">
            Customize Theme
          </Link>
        </div>
        <div className="flex gap-sm">
          {(() => {
            const themes = [
              { name: 'Modern Lime', colors: ['#131313', '#d2e823', '#e5e2e1'] },
              { name: 'Deep Space', colors: ['#0a0a2e', '#7c3aed', '#e2e8f0'] },
              { name: 'Snow Peak', colors: ['#ffffff', '#1a1a1a', '#6b7280'] },
              { name: 'Custom', colors: ['#1a1a2e', '#00d9ff', '#f0f0f0'] },
            ];
            const activeTheme = themes.find(t => t.name === appearance?.theme_preset) || themes[0];
            return activeTheme.colors.map((c, i) => (
              <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-outline-variant/20" style={{ backgroundColor: c }} />
            ));
          })()}
        </div>
      </div>
    </>
  );
}

// ── Skeleton shown while DashboardStats streams in ───────────────
export function DashboardStatsSkeleton() {
  return (
    <>
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md pt-sm animate-pulse">
        <div className="space-y-xs">
          <div className="h-8 w-40 rounded-lg bg-surface-container-high" />
          <div className="h-4 w-72 rounded-md bg-surface-container-high" />
        </div>
        <div className="flex gap-md">
          <div className="h-9 w-28 rounded-lg bg-surface-container-high" />
          <div className="h-9 w-28 rounded-lg bg-surface-container-high" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-md lg:gap-lg animate-pulse">
        <div className="sm:col-span-2 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-container-high" />
          ))}
        </div>
        <div className="sm:col-span-2 lg:col-span-4 h-24 rounded-xl bg-surface-container-high" />
      </div>

      {/* Links skeleton */}
      <div className="space-y-md animate-pulse">
        <div className="h-6 w-28 rounded-md bg-surface-container-high" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-container-high" />
        ))}
      </div>

      {/* Theme card skeleton */}
      <div className="h-24 rounded-xl bg-surface-container-high animate-pulse" />
    </>
  );
}
