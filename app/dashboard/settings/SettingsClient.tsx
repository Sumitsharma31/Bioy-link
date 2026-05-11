'use client';

import React, { useState, useTransition, useActionState, useEffect } from 'react';
import { Shield, Trash2, CheckCircle, Loader2, Plus, AtSign, AlertTriangle, Key, Star } from 'lucide-react';
import { updateProfile, updateUsername, deleteAccount, updatePassword, updatePreferences, removeAvatar } from './actions';
import UsernameInput from '@/components/username/UsernameInput';
import MFASetup from './MFASetup';
import AlertDialog from '@/components/ui/AlertDialog';
import Toast from '@/components/ui/Toast';

const tabs = ['Account', 'Profile', 'Billing', 'Custom Domain', 'Security'];

interface SettingsClientProps {
  user: {
    email?: string;
    created_at?: string;
  };
  profile: {
    username?: string;
    full_name?: string;
    subscription_tier?: string;
    avatar_url?: string;
    timezone?: string;
  } | null;
}

const SettingsClient = ({ user, profile }: SettingsClientProps) => {
  const [activeTab, setActiveTab] = useState('Account');
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });
  const [newUsernameReady, setNewUsernameReady] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // @ts-ignore
  const [usernameState, usernameAction, isUsernamePending] = useActionState(updateUsername, {});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);

  // @ts-ignore
  const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, {});
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // @ts-ignore
  const [prefState, prefAction, isPrefPending] = useActionState(updatePreferences, {});

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'warning' | 'error' | 'info' | 'success' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info',
  });

  const showAlert = (config: Omit<typeof alertConfig, 'isOpen'>) => {
    setAlertConfig({ ...config, isOpen: true });
  };

  // Sync action states with Toast
  useEffect(() => {
    if (usernameState?.success) {
      setToast({ isVisible: true, message: 'Username updated successfully!', type: 'success' });
    } else if (usernameState?.error) {
      setToast({ isVisible: true, message: usernameState.error, type: 'error' });
    }
  }, [usernameState]);

  useEffect(() => {
    if (passwordState?.success) {
      setToast({ isVisible: true, message: 'Password updated successfully!', type: 'success' });
      setIsResettingPassword(false);
    } else if (passwordState?.error) {
      setToast({ isVisible: true, message: passwordState.error, type: 'error' });
    }
  }, [passwordState]);

  useEffect(() => {
    if (prefState?.success) {
      setToast({ isVisible: true, message: 'Preferences updated successfully!', type: 'success' });
    } else if (prefState?.error) {
      setToast({ isVisible: true, message: prefState.error, type: 'error' });
    }
  }, [prefState]);

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
        setToast({ isVisible: true, message: 'Settings saved successfully!', type: 'success' });
      } catch (error) {
        setToast({ isVisible: true, message: 'Failed to save settings.', type: 'error' });
      }
    });
  };

  const handleRemoveAvatar = async () => {
    showAlert({
      title: 'Delete Image?',
      description: 'Are you sure you want to delete profile image?',
      type: 'warning',
      autoClose: true,
      onConfirm: async () => {
        startTransition(async () => {
          try {
            await removeAvatar();
            setAvatarPreview(null);
            setToast({ isVisible: true, message: 'Profile picture removed!', type: 'success' });
          } catch (error) {
            setToast({ isVisible: true, message: 'Failed to remove picture.', type: 'error' });
          }
        });
      }
    });
  };

  // Split full name into first/last for the UI
  const nameParts = profile?.full_name?.split(' ') || ['', ''];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const accountStatusBox = (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-md">
        <span className="text-label-sm text-on-surface-variant uppercase">Account Status</span>
        <div className="flex items-center gap-xs text-primary-fixed-dim">
          <CheckCircle size={14} />
          <span className="text-label-sm font-bold">Verified</span>
        </div>
      </div>
      <div className="bg-primary-container/10 border border-primary-container/30 rounded-lg p-md mb-md flex-1">
        <span className="text-label-md text-primary-container font-bold uppercase">{profile?.subscription_tier || 'Free'} Plan</span>
        <p className="text-body-md text-on-surface-variant mt-xs">
          {user.created_at ? `Member since ${new Date(user.created_at).getFullYear()}` : 'Active Account'}
        </p>
      </div>
      <button className="w-full py-sm border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors mt-auto">
        Manage Subscription
      </button>
    </div>
  );

  const dangerZoneBox = (
    <div className="border border-error/30 rounded-xl p-lg space-y-md h-full flex flex-col">
      <div className="flex items-center gap-md">
        <AlertTriangle size={18} className="text-error" />
        <h2 className="text-headline-sm text-error">Danger Zone</h2>
      </div>
      <p className="text-body-md text-on-surface-variant flex-1">Once you delete your account, there is no going back. All your links, settings, and profile data will be permanently removed.</p>

      <div className="mt-auto pt-md">
        {confirmDelete ? (
          <div className="flex flex-col gap-sm p-sm bg-error/5 border border-error/20 rounded-lg">
            <p className="text-label-sm text-error font-bold text-center">Are you absolutely sure?</p>
            <div className="flex flex-col gap-sm">
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-sm bg-surface-container-high text-on-surface rounded-lg font-bold text-label-md hover:bg-surface-variant transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  const result = await deleteAccount();
                  if (result?.error) {
                    alert(result.error);
                    setIsDeleting(false);
                    setConfirmDelete(false);
                  }
                }}
                disabled={isDeleting}
                className="w-full flex justify-center items-center gap-sm py-sm bg-error text-on-error rounded-lg font-bold text-label-md hover:bg-error/90 transition-all disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> Yes, Delete</>}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full flex justify-center items-center gap-sm py-sm bg-error-container text-on-error-container rounded-lg font-bold text-label-md hover:opacity-90 transition-opacity active:scale-95 transition-all"
          >
            <Trash2 size={16} /> Delete Account
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-xl">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
      />
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
            className={`flex items-center gap-xs px-md py-sm text-label-md whitespace-nowrap transition-all ${activeTab === tab
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-xl">
        {/* ==================== ACCOUNT TAB ==================== */}
        {activeTab === 'Account' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl animate-fade-in items-stretch">
            {/* Row 1 */}
            <div className="lg:col-span-8">
              <form action={prefAction} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-md h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="text-headline-sm text-on-surface">Account Preferences</h2>
                </div>
                <div className="flex-1 space-y-md">
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
                    <select
                      name="timezone"
                      defaultValue={profile?.timezone || 'Asia/Kolkata'}
                      className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm"
                    >
                      <option value="America/Los_Angeles">UTC-8 (Pacific Time)</option>
                      <option value="America/New_York">UTC-5 (Eastern Time)</option>
                      <option value="Europe/London">UTC+0 (GMT)</option>
                      <option value="Asia/Kolkata">UTC+5:30 (Indian Standard Time)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-sm border-t border-outline-variant/10">
                  <button
                    type="submit"
                    disabled={isPrefPending}
                    className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all flex items-center gap-sm disabled:opacity-50"
                  >
                    {isPrefPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Preferences'}
                  </button>
                </div>
              </form>
            </div>
            <div className="lg:col-span-4">
              {accountStatusBox}
            </div>

            {/* Row 2 */}
            <div className="lg:col-span-8">
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-md h-full flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <AtSign size={18} className="text-primary-container" />
                    <h2 className="text-headline-sm text-on-surface">Change Username</h2>
                  </div>
                  <div className="flex items-center gap-xs px-sm py-1 rounded-full bg-[rgba(200,255,0,0.1)] border border-[rgba(200,255,0,0.2)]">
                    <Star size={12} className="text-[#c8ff00] fill-[#c8ff00]" />
                    <span className="text-[10px] font-bold text-[#c8ff00] uppercase tracking-wider pr-1">Premium</span>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  Current username: <strong className="text-on-surface font-mono">@{profile?.username}</strong>
                </p>

                <form
                  action={usernameAction}
                  className={`space-y-md flex-1 flex flex-col ${profile?.subscription_tier !== 'premium' ? 'pointer-events-none opacity-50 select-none grayscale' : ''}`}
                >
                  <input type="hidden" name="new_username" value={newUsername} />
                  <div className="flex-1">
                    <UsernameInput
                      initialValue=""
                      planType={(profile?.subscription_tier === 'premium' ? 'premium' : 'free')}
                      domain="biolinks.me"
                      onValidChange={(u) => { setNewUsername(u); setNewUsernameReady(true); }}
                      inputName="_new_username_display"
                    />

                    {usernameState?.error && (
                      <p className="text-error text-label-md mt-sm">{usernameState.error}</p>
                    )}
                    {usernameState?.success && (
                      <p className="text-primary text-label-md flex items-center gap-xs mt-sm">
                        <CheckCircle size={14} /> Username updated successfully!
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!newUsernameReady || isUsernamePending || profile?.subscription_tier !== 'premium'}
                    className="flex items-center gap-sm bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-auto self-start"
                  >
                    {isUsernamePending ? <Loader2 size={16} className="animate-spin" /> : 'Save Username'}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-4">
              {dangerZoneBox}
            </div>
          </div>
        )}

        {/* ==================== PROFILE TAB ==================== */}
        {activeTab === 'Profile' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <form onSubmit={handleSave} className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-headline-sm text-on-surface">Public Profile Details</h2>
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
                    {(avatarPreview || profile?.avatar_url) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (avatarPreview !== profile?.avatar_url) {
                            // Reverting a local selection
                            setAvatarPreview(profile?.avatar_url || null);
                            const fileInput = document.querySelector('input[name="avatar"]') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          } else {
                            // Deleting from DB
                            handleRemoveAvatar();
                          }
                        }}
                        disabled={isPending}
                        className="text-label-sm text-error hover:text-error/80 font-bold uppercase tracking-wider"
                      >
                        Remove Picture
                      </button>
                    )}
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
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all flex items-center gap-sm disabled:opacity-50"
              >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Save Profile'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== SECURITY TAB ==================== */}
        {activeTab === 'Security' && (
          <div className="animate-fade-in max-w-4xl mx-auto space-y-xl">
            <MFASetup />

            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-md">
              <h2 className="text-headline-sm text-on-surface">Password Management</h2>


              <div className="p-md bg-surface-container rounded-lg mt-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <Key size={20} className="text-primary-fixed-dim" />
                    <div>
                      <span className="text-label-md text-on-surface font-bold">Password Reset</span>
                      <p className="text-body-md text-on-surface-variant">Update your account password</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsResettingPassword(!isResettingPassword)}
                    className="px-md py-xs border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors"
                  >
                    {isResettingPassword ? 'Cancel' : 'Reset Password'}
                  </button>
                </div>

                {isResettingPassword && (
                  <form action={passwordAction} className="mt-md pt-md border-t border-outline-variant/10 space-y-md animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">New Password</label>
                        <input
                          type="password"
                          name="new_password"
                          required
                          minLength={6}
                          className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-label-sm text-on-surface-variant uppercase mb-xs">Confirm Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          required
                          minLength={6}
                          className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isPasswordPending}
                        className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all flex items-center gap-sm disabled:opacity-50"
                      >
                        {isPasswordPending ? <Loader2 size={16} className="animate-spin" /> : 'Save Password'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== BILLING TAB ==================== */}
        {activeTab === 'Billing' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-lg space-y-md">
              <h2 className="text-headline-sm text-on-surface">Billing & Plan</h2>
              <p className="text-body-md text-on-surface-variant">Manage your subscription and payment methods here.</p>
              <div className="p-md bg-surface-container rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-label-md font-bold text-on-surface">{profile?.subscription_tier || 'Free'} Plan</span>
                  <p className="text-body-sm text-on-surface-variant">Active</p>
                </div>
                <button className="px-md py-xs border border-outline-variant/30 rounded-lg text-label-md hover:bg-surface-variant transition-colors text-on-surface-variant">
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CUSTOM DOMAIN TAB ==================== */}
        {activeTab === 'Custom Domain' && (
          <div className="animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-high to-surface-container border border-outline-variant/10 p-2xl text-center min-h-[400px] flex flex-col items-center justify-center">
              {/* Abstract background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
              {/* Premium Badge - Top Right */}
              <div className="absolute top-lg right-lg z-20 flex items-center gap-xs px-sm py-1 rounded-full bg-[rgba(200,255,0,0.1)] border border-[rgba(200,255,0,0.2)] shadow-sm">
                <Star size={14} className="text-[#c8ff00] fill-[#c8ff00]" />
                <span className="text-[10px] font-bold text-[#c8ff00] uppercase tracking-wider pr-1">Premium</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-surface border border-outline-variant/20 rounded-2xl flex items-center justify-center mb-lg shadow-sm">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                </div>
                <h2 className="text-display-sm text-on-surface font-bold mb-sm">Custom Domains</h2>
                <span className="px-sm py-xs bg-primary-container text-on-primary-container text-label-sm font-bold uppercase tracking-wider rounded-full mb-md">Coming Soon</span>
                <p className="text-body-lg text-on-surface-variant max-w-md mx-auto">
                  We're working hard to bring you the ability to use your own custom domain name (like <span className="text-on-surface font-mono">yourname.com</span>) for your BioLinks profile.
                </p>
                <button className="mt-xl px-lg py-sm bg-surface-container-low border border-outline-variant/30 text-on-surface-variant rounded-full font-bold text-label-md hover:bg-surface-container-high hover:text-on-surface transition-all">
                  Notify me when available
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsClient;
