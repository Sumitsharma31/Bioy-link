import React from 'react';
import { Shield, Key, Bell, Globe, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-xl max-w-4xl">
      <div>
        <h2 className="text-headline-md text-on-surface">Admin Settings</h2>
        <p className="text-body-md text-on-surface-variant">Configure platform-wide administrative controls and security.</p>
      </div>

      <div className="space-y-lg">
        {/* Security Section */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl">
          <div className="flex items-center gap-md mb-xl">
            <div className="p-sm rounded-lg bg-primary/10 text-primary">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-title-lg text-on-surface">Platform Security</h3>
              <p className="text-body-md text-on-surface-variant">Manage global security policies and access.</p>
            </div>
          </div>

          <div className="space-y-md">
            <div className="flex items-center justify-between py-md border-b border-outline-variant/10">
              <div>
                <p className="text-body-md font-bold text-on-surface">Maintenance Mode</p>
                <p className="text-label-sm text-on-surface-variant">Disable all public profile pages during maintenance.</p>
              </div>
              <div className="w-12 h-6 bg-outline-variant/30 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between py-md">
              <div>
                <p className="text-body-md font-bold text-on-surface">Enforce 2FA for Admins</p>
                <p className="text-label-sm text-on-surface-variant">Require all administrative users to use two-factor authentication.</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-on-primary-container rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* API Section */}
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-xl">
          <div className="flex items-center gap-md mb-xl">
            <div className="p-sm rounded-lg bg-purple-400/10 text-purple-400">
              <Key size={24} />
            </div>
            <div>
              <h3 className="text-title-lg text-on-surface">API & Integrations</h3>
              <p className="text-body-md text-on-surface-variant">Configure Razorpay, Supabase, and Cloudinary keys.</p>
            </div>
          </div>

          <div className="space-y-lg">
             <div>
               <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Razorpay Public Key</label>
               <input 
                 readOnly 
                 value={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '••••••••'} 
                 className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm text-on-surface-variant font-mono text-sm"
               />
             </div>
             <div>
               <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">Supabase URL</label>
               <input 
                 readOnly 
                 value={process.env.NEXT_PUBLIC_SUPABASE_URL || '••••••••'} 
                 className="w-full bg-surface-container-high border border-outline-variant/20 rounded-lg px-md py-sm text-on-surface-variant font-mono text-sm"
               />
             </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-sm px-xl py-md bg-primary-container text-on-primary-container rounded-lg font-bold hover:opacity-90 transition-all">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
