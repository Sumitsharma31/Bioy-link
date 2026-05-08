'use client';

import React, { useState, useTransition } from 'react';
import { Shield, Trash2, CheckCircle, Loader2, Plus } from 'lucide-react';
import { updateProfile } from './actions';

const tabs = ['Account', 'Profile', 'Billing', 'Custom Domain', 'Security'];

interface SettingsClientProps {
  user: {
    email?: string;
  };
  profile: {
    full_name?: string;
    subscription_tier?: string;
    avatar_url?: string;
  } | null;
}

const SettingsClient = ({ user, profile }: SettingsClientProps) => {
  const [activeTab, setActiveTab] = useState('Account');
  const [isPending, startTransition] = useTransition();
  const [saveMessage, setSaveMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        await updateProfile(formData);
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (error) {
        setSaveMessage('Failed to update profile.');
      }
    });
  };

  // Split full name into first/last for the UI
  const nameParts = profile?.full_name?.split(' ') || ['', ''];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="space-y-xl">
      <div className="pt-sm md:pt-0">
        <h1 className="text-headline-lg text-on-surface mb-xs">Settings</h1>
        <p className="text-body-md text-on-surface-variant">Manage your account and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-xs border-b border-outline-variant/20 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-md py-sm text-label-md whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Form Column */}
        <div className="lg:col-span-8 space-y-xl">
          {/* User Information */}
          <form onSubmit={handleSave} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-headline-sm text-on-surface">User Information</h2>
              {saveMessage && (
                <span className={`text-label-sm ${saveMessage.includes('success') ? 'text-primary' : 'text-error'} animate-fade-in`}>
                  {saveMessage}
                </span>
              )}
            </div>
            {/* Avatar Upload */}
            <div className="flex items-center gap-lg pb-md border-b border-outline-variant/10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-2 border-outline-variant/20 group-hover:border-primary/50 transition-colors">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bold text-headline-sm">
                      {firstName?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-primary-container text-on-primary-container rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border-2 border-surface-container-low">
                  <Plus size={16} />
                  <input 
                    type="file" 
                    name="avatar" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="text-label-md text-on-surface font-bold">Profile Picture</h3>
                <p className="text-body-sm text-on-surface-variant">JPG, PNG or GIF. Max size of 2MB.</p>
                <div className="mt-sm flex gap-sm">
                   <button 
                    type="button" 
                    onClick={() => {
                      setAvatarPreview(profile?.avatar_url || null);
                      const fileInput = document.querySelector('input[name="avatar"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-label-sm text-on-surface-variant hover:text-on-surface"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  defaultValue={firstName} 
                  className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm" 
                />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  defaultValue={lastName} 
                  className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm" 
                />
              </div>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email} 
                readOnly 
                className="w-full bg-surface-container-high/50 border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 px-sm py-sm text-on-surface/60 text-body-md rounded-t-sm cursor-not-allowed" 
              />
              <p className="text-[10px] text-on-surface-variant mt-xs italic">Email can only be changed via security settings.</p>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Timezone</label>
              <select className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm">
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={isPending}
              className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all flex items-center gap-sm disabled:opacity-50"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
            </button>
          </form>

          {/* Security */}
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-md">
            <h2 className="text-headline-sm text-on-surface">Security Baseline</h2>
            <div className="flex items-center justify-between p-md bg-surface-container rounded-lg">
              <div className="flex items-center gap-md">
                <Shield size={20} className="text-primary-fixed-dim" />
                <div>
                  <span className="text-label-md text-on-surface font-bold">Two-Factor Authentication</span>
                  <p className="text-body-md text-on-surface-variant">Not configured</p>
                </div>
              </div>
              <button className="px-md py-xs border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors">
                Configure
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-error/30 rounded-xl p-lg space-y-md">
            <h2 className="text-headline-sm text-error">Danger Zone</h2>
            <p className="text-body-md text-on-surface-variant">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="flex items-center gap-sm px-md py-sm bg-error-container text-on-error-container rounded-lg font-bold text-label-md hover:opacity-90 transition-opacity">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-4 space-y-lg">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg">
            <div className="flex items-center justify-between mb-md">
              <span className="text-label-sm text-on-surface-variant uppercase">Account Status</span>
              <div className="flex items-center gap-xs text-primary-fixed-dim">
                <CheckCircle size={14} />
                <span className="text-label-sm font-bold">Verified</span>
              </div>
            </div>
            <div className="bg-primary-container/10 border border-primary-container/30 rounded-lg p-md mb-md">
              <span className="text-label-md text-primary-container font-bold uppercase">{profile?.subscription_tier || 'Free'} Plan</span>
              <p className="text-body-md text-on-surface-variant mt-xs">Renews Jan 15, 2025</p>
            </div>
            <button className="w-full py-sm border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors">
              Manage Subscription
            </button>
          </div>
          {/* Mini Profile Preview */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-md wireframe-pattern">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-variant mb-sm overflow-hidden border-2 border-outline-variant/10">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bold">
                    {firstName?.[0] || user.email?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-label-md text-on-surface font-bold truncate max-w-full">
                {firstName} {lastName}
              </div>
              <div className="text-[10px] text-on-surface-variant/50 truncate max-w-full mb-md">
                @{user.email?.split('@')[0]}
              </div>
              <div className="w-full space-y-xs">
                <div className="h-7 bg-surface-container rounded" />
                <div className="h-7 bg-surface-container rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsClient;
