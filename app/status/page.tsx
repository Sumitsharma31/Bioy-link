'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const overallStatus = 'operational'; // 'operational' | 'degraded' | 'outage'

const services = [
  { name: 'Profile Pages', status: 'operational', description: 'Public BioLinks profile pages' },
  { name: 'Dashboard', status: 'operational', description: 'User dashboard and link management' },
  { name: 'Analytics', status: 'operational', description: 'Click tracking and view counts' },
  { name: 'Authentication', status: 'operational', description: 'Login and account creation' },
  { name: 'Image Storage', status: 'operational', description: 'Profile pictures and uploads via Cloudinary' },
  { name: 'QR Code Generator', status: 'operational', description: 'Dynamic QR code generation' },
  { name: 'Custom Domains', status: 'operational', description: 'Custom domain routing and SSL' },
  { name: 'API', status: 'operational', description: 'Public and private API endpoints' },
];

const incidents = [
  {
    date: 'May 5, 2026',
    title: 'Elevated latency on profile page loads',
    severity: 'minor',
    resolved: true,
    detail: 'Some users experienced slower-than-normal load times on public profile pages for approximately 22 minutes. Root cause: edge node misconfiguration in the EU region. Resolved and fully mitigated.',
  },
  {
    date: 'Apr 18, 2026',
    title: 'Analytics data delay',
    severity: 'minor',
    resolved: true,
    detail: 'Click and view data was delayed by up to 15 minutes due to a queue backlog in our event processing pipeline. No data was lost. Pipeline was cleared and normal processing resumed.',
  },
];

const uptimeHistory = [
  { month: 'Nov', uptime: 100 },
  { month: 'Dec', uptime: 99.98 },
  { month: 'Jan', uptime: 100 },
  { month: 'Feb', uptime: 99.95 },
  { month: 'Mar', uptime: 100 },
  { month: 'Apr', uptime: 99.92 },
  { month: 'May', uptime: 100 },
];

const statusConfig = {
  operational: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Operational' },
  degraded: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Degraded' },
  outage: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Outage' },
};

const overallConfig = statusConfig[overallStatus as keyof typeof statusConfig];

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background wireframe-pattern">
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-md sm:px-margin">
          {/* Header */}
          <div className="text-center mb-xl">
            <span className="inline-flex items-center px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-full text-label-sm uppercase tracking-wider text-primary mb-md">
              System Status
            </span>
            <h1 className="text-5xl font-black text-on-surface tracking-tight mb-md" style={{ lineHeight: 1.05 }}>
              BioLinks Status
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Live operational status for all BioLinks services.
            </p>
          </div>

          {/* Overall Status Banner */}
          <div className={`flex items-center gap-md p-lg rounded-xl border mb-xl ${overallConfig.bg} ${overallConfig.border}`}>
            <overallConfig.icon size={28} className={overallConfig.color} />
            <div>
              <p className={`text-headline-sm font-bold ${overallConfig.color}`}>
                All Systems {overallConfig.label}
              </p>
              <p className="text-body-md text-on-surface-variant mt-xs">
                Last checked: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="mb-xl">
            <h2 className="text-headline-sm text-on-surface mb-md">Services</h2>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl divide-y divide-outline-variant/10">
              {services.map((svc) => {
                const cfg = statusConfig[svc.status as keyof typeof statusConfig];
                return (
                  <div key={svc.name} className="flex items-center justify-between px-lg py-md gap-md">
                    <div>
                      <p className="text-body-md text-on-surface font-medium">{svc.name}</p>
                      <p className="text-label-sm text-on-surface-variant mt-xs">{svc.description}</p>
                    </div>
                    <div className={`flex items-center gap-xs px-sm py-xs rounded-full border ${cfg.bg} ${cfg.border} shrink-0`}>
                      <cfg.icon size={13} className={cfg.color} />
                      <span className={`text-label-sm font-bold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uptime History */}
          <div className="mb-xl">
            <h2 className="text-headline-sm text-on-surface mb-md">Uptime — Last 7 Months</h2>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
              <div className="flex items-end gap-sm h-24">
                {uptimeHistory.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-xs">
                    <span className="text-label-sm text-on-surface-variant">{m.uptime}%</span>
                    <div
                      className="w-full rounded-sm bg-emerald-500/70"
                      style={{ height: `${(m.uptime / 100) * 64}px` }}
                    />
                    <span className="text-label-sm text-on-surface-variant">{m.month}</span>
                  </div>
                ))}
              </div>
              <p className="text-label-sm text-on-surface-variant mt-md text-center">
                30-day rolling average uptime: <strong className="text-emerald-400">99.98%</strong>
              </p>
            </div>
          </div>

          {/* Incident History */}
          <div>
            <h2 className="text-headline-sm text-on-surface mb-md">Recent Incidents</h2>
            {incidents.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg text-center text-on-surface-variant text-body-md">
                No incidents in the past 90 days. 🎉
              </div>
            ) : (
              <div className="space-y-sm">
                {incidents.map((inc, i) => (
                  <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
                    <div className="flex items-start justify-between gap-md mb-sm">
                      <div>
                        <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">{inc.date}</span>
                        <h3 className="text-headline-sm text-on-surface mt-xs">{inc.title}</h3>
                      </div>
                      <div className="flex items-center gap-xs shrink-0">
                        <span className={`text-label-sm uppercase tracking-wider px-sm py-xs rounded-full border ${
                          inc.severity === 'minor' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'
                        }`}>{inc.severity}</span>
                        {inc.resolved && (
                          <span className="text-label-sm uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-sm py-xs rounded-full">Resolved</span>
                        )}
                      </div>
                    </div>
                    <p className="text-body-md text-on-surface-variant">{inc.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
