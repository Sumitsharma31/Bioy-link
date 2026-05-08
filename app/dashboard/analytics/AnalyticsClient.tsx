'use client';

import React from 'react';
import { 
  Calendar, Download, TrendingUp, TrendingDown, 
  Monitor, Smartphone, Tablet, Globe, MousePointer2 
} from 'lucide-react';

interface AnalyticsClientProps {
  profileViews: number;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  initialLinks: any[];
}

const AnalyticsClient = ({ profileViews, deviceStats, initialLinks }: AnalyticsClientProps) => {
  const totalClicks = initialLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const ctr = profileViews > 0 ? ((totalClicks / profileViews) * 100).toFixed(1) : '0.0';

  const totalDeviceViews = (deviceStats?.mobile || 0) + (deviceStats?.desktop || 0) + (deviceStats?.tablet || 0);
  const getDevicePct = (val: number) => totalDeviceViews > 0 ? Math.round((val / totalDeviceViews) * 100) : 0;

  const stats = [
    { label: 'Profile Views', value: profileViews.toLocaleString(), icon: Globe, progress: 100 },
    { label: 'Link Clicks', value: totalClicks.toLocaleString(), icon: MousePointer2, progress: 100 },
    { label: 'Average CTR', value: `${ctr}%`, icon: TrendingUp, progress: parseFloat(ctr) },
  ];

  return (
    <div className="space-y-xl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-md pt-sm md:pt-0">
        <div>
          <h1 className="text-headline-lg text-on-surface mb-xs">Analytics Overview</h1>
          <p className="text-body-md text-on-surface-variant">Track performance across your link ecosystem.</p>
        </div>
        <div className="flex gap-md w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-sm px-md py-sm border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-sm bg-primary-container text-on-primary-container px-md py-sm rounded-lg text-label-md font-bold active:scale-95 transition-all">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-low border border-outline-variant/10 p-lg rounded-xl">
            <div className="flex items-center justify-between mb-md">
              <span className="text-label-sm text-on-surface-variant uppercase">{stat.label}</span>
              <stat.icon size={18} className="text-primary-fixed-dim" />
            </div>
            <span className="text-headline-lg text-on-surface">{stat.value}</span>
            <div className="mt-md w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-container rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(stat.progress, 100)}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Trends (Visualization of real clicks per link) */}
      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="text-headline-sm text-on-surface">Clicks by Link</h2>
            <div className="text-label-md text-on-surface-variant">Comparative Performance</div>
          </div>
          <div className="space-y-lg">
            {initialLinks.slice(0, 5).map((link, i) => {
              const linkPct = totalClicks > 0 ? (link.clicks / totalClicks) * 100 : 0;
              return (
                <div key={link.id} className="space-y-xs">
                  <div className="flex justify-between text-label-md">
                    <span className="text-on-surface font-medium truncate max-w-[200px]">{link.title}</span>
                    <span className="text-on-surface-variant">{link.clicks || 0} clicks ({linkPct.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-container rounded-full transition-all duration-1000" 
                      style={{ width: `${linkPct}%`, transitionDelay: `${i * 100}ms` }} 
                    />
                  </div>
                </div>
              );
            })}
            {initialLinks.length === 0 && (
              <div className="h-40 flex items-center justify-center text-on-surface-variant border border-dashed border-outline-variant/30 rounded-xl">
                No click data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Device Usage */}
        <div className="col-span-12 lg:col-span-4 space-y-md">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
            <h3 className="text-headline-sm text-on-surface mb-lg">Device Usage</h3>
            <div className="space-y-lg">
              {[
                { icon: Smartphone, label: 'Mobile', val: deviceStats.mobile },
                { icon: Monitor, label: 'Desktop', val: deviceStats.desktop },
                { icon: Tablet, label: 'Tablet', val: deviceStats.tablet },
              ].map((d) => {
                const pct = getDevicePct(d.val);
                return (
                  <div key={d.label} className="flex items-center gap-md">
                    <d.icon size={18} className="text-on-surface-variant shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-xs">
                        <span className="text-label-md text-on-surface">{d.label}</span>
                        <span className="text-label-md text-on-surface-variant">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-variant rounded-full">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-primary-container/10 border border-primary-container/30 rounded-xl p-md">
            <span className="text-label-md text-primary-container font-bold">Smart Insight</span>
            <p className="text-body-md text-on-surface mt-xs">
              {initialLinks.length > 0 && initialLinks[0].clicks > 0 
                ? `"${initialLinks[0].title}" is your best performer. Try moving it to the top of your profile.`
                : "Add more links and share your profile to start seeing traffic insights."}
            </p>
          </div>
        </div>
      </div>

      {/* Top Links Table */}
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
        <div className="p-lg border-b border-outline-variant/10">
          <h2 className="text-headline-sm text-on-surface">Detailed Link Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="text-left text-label-sm text-on-surface-variant uppercase px-lg py-md">Link Name</th>
                <th className="text-left text-label-sm text-on-surface-variant uppercase px-lg py-md">Clicks</th>
                <th className="text-left text-label-sm text-on-surface-variant uppercase px-lg py-md">Contribution</th>
                <th className="text-left text-label-sm text-on-surface-variant uppercase px-lg py-md">Status</th>
              </tr>
            </thead>
            <tbody>
              {initialLinks.map((link) => (
                <tr key={link.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50 transition-colors">
                  <td className="px-lg py-md">
                    <div className="flex flex-col">
                      <span className="text-body-md text-on-surface font-medium">{link.title}</span>
                      <span className="text-[10px] text-on-surface-variant truncate max-w-xs">{link.url}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md text-body-md text-on-surface font-bold">{link.clicks || 0}</td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                       <span className="text-body-md text-primary-fixed-dim font-bold">
                         {totalClicks > 0 ? ((link.clicks / totalClicks) * 100).toFixed(1) : 0}%
                       </span>
                       <div className="w-16 h-1 bg-surface-variant rounded-full overflow-hidden hidden sm:block">
                         <div className="h-full bg-primary-container" style={{ width: `${totalClicks > 0 ? (link.clicks / totalClicks) * 100 : 0}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <span className={`text-label-sm px-sm py-xs rounded-full ${
                      link.is_active ? 'bg-primary-container/20 text-primary-fixed-dim' : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {link.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                </tr>
              ))}
              {initialLinks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-lg py-xl text-center text-on-surface-variant">No links found to track.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsClient;
