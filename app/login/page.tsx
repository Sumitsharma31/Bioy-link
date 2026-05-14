'use client';

import React, { useActionState, useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Loader2, X } from 'lucide-react';
import { handleAuth } from './actions';
import { createClient } from '@/lib/supabase/client';
import { ADMIN_EMAILS } from '@/lib/admins';
import Toast from '@/components/ui/Toast';

const initialState: { error?: string; message?: string; mfaRequired?: boolean } = { error: '', message: '' };

// Outer shell just provides the Suspense boundary needed by useSearchParams
const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-md">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');

  // true = login mode, false = signup mode
  const [isLoginMode, setIsLoginMode] = useState(mode !== 'signup');

  // Keep state in sync when the URL changes (e.g. pressing Get Started nav button
  // while already on the login page)
  useEffect(() => {
    setIsLoginMode(mode !== 'signup');
  }, [mode]);

  // Single stable action — never swapped. Mode is passed as a hidden field instead.
  // @ts-ignore - useActionState is available in React 19 but types might be lagging
  const [state, formAction, isPending] = useActionState(handleAuth, initialState);

  const toggleMode = () => {
    const nextIsLogin = !isLoginMode;
    setIsLoginMode(nextIsLogin);
    // Keep the URL in sync so browser back/forward works correctly
    router.push(`/login${nextIsLogin ? '' : '?mode=signup'}`, { scroll: false });
  };



  // --- MFA Logic ---
  const [mfaCode, setMfaCode] = useState('');
  const [isMfaPending, setIsMfaPending] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    if ((state as any)?.error) {
      setToast({ isVisible: true, message: (state as any).error, type: 'error' });
    } else if ((state as any)?.message) {
      setToast({ isVisible: true, message: (state as any).message, type: 'success' });
    }
  }, [state]);

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMfaPending(true);
    setMfaError('');
    
    const supabase = createClient();
    
    // 1. Get factors
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      setMfaError(factorsError.message);
      setIsMfaPending(false);
      return;
    }
    
    const totpFactor = factorsData.totp.find(f => f.status === 'verified');
    if (!totpFactor) {
      setMfaError('No verified 2FA factor found.');
      setIsMfaPending(false);
      return;
    }
    
    // 2. Challenge
    const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
    if (challenge.error) {
      setMfaError(challenge.error.message);
      setIsMfaPending(false);
      return;
    }
    
    // 3. Verify
    const verify = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challenge.data.id,
      code: mfaCode
    });
    
    if (verify.error) {
      setMfaError('Invalid verification code. Please try again.');
      setIsMfaPending(false);
      return;
    }
    
    // Success! Redirect.
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email && ADMIN_EMAILS.includes(user.email)) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
    router.refresh();
  };

  if ((state as any)?.mfaRequired) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center px-md pt-md pb-24 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 wireframe-pattern opacity-30 pointer-events-none" />
        <div className="w-full max-w-[480px] bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-2xl relative z-10">
          {/* Close Button Inside Card */}
          <Link 
            href="/"
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-all group"
            aria-label="Close"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
          </Link>

          <div className="flex flex-col items-center mb-xl">
            <div className="w-16 h-16 flex items-center justify-center mb-lg">
              <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={80} height={80} className="object-contain drop-shadow-[0_0_12px_rgba(200,255,0,0.6)]" />
            </div>
            <h1 className="text-headline-md text-on-surface mb-xs">Two-Factor Auth</h1>
            <p className="text-body-md text-on-surface-variant text-center">
              Enter the 6-digit code from your authenticator app to continue.
            </p>
          </div>

          <form onSubmit={handleMfaVerify} className="space-y-lg">
            <div>
              <label className="block text-label-sm text-on-surface-variant uppercase mb-xs text-center">Verification Code</label>
              <input 
                type="text" 
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                className="w-full bg-surface-container-high border border-outline-variant/30 px-sm py-md text-on-surface text-center tracking-[0.5em] text-title-lg rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            {mfaError && (
              <p className="text-error text-body-md text-center">{mfaError}</p>
            )}

            <button
              type="submit"
              disabled={mfaCode.length !== 6 || isMfaPending}
              className="w-full py-sm bg-primary-container text-on-primary-container rounded-lg font-bold flex items-center justify-center gap-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isMfaPending ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Log In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-md pt-md pb-24 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 wireframe-pattern opacity-30 pointer-events-none" />
      <div className="w-full max-w-[480px] bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-2xl relative z-10">
        {/* Close Button Inside Card */}
        <Link 
          href="/"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-all group"
          aria-label="Close"
        >
          <X size={20} className="group-active:scale-90 transition-transform" />
        </Link>

        <div className="flex flex-col items-center mb-xl">
          <div className="w-16 h-16 flex items-center justify-center mb-lg">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={80} height={80} className="object-contain drop-shadow-[0_0_12px_rgba(200,255,0,0.6)]" />
          </div>
          <h1 className="text-headline-md text-on-surface mb-xs">
            {isLoginMode ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {isLoginMode ? 'Log in to manage your digital footprint' : 'Sign up to start building your profile'}
          </p>
        </div>

        <div className="relative mb-lg">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30" /></div>
          <div className="relative flex justify-center">
            <span className="bg-surface-container-low px-md text-label-sm uppercase tracking-widest text-on-surface-variant">
              Login with Email
            </span>
          </div>
        </div>

        {/*
          KEY FIX: We use a single stable `handleAuth` action (never swapped).
          The mode is communicated via a hidden input field so the server action
          knows whether to call login() or signup().
        */}
        <form action={formAction} className="space-y-lg">
          {/* Hidden field tells the server action which path to take */}
          <input type="hidden" name="mode" value={isLoginMode ? 'login' : 'signup'} />

          <div>
            <label className="block text-label-sm text-on-surface-variant uppercase mb-xs" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="alex@creator.com"
              className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-xs">
              <label className="text-label-sm text-on-surface-variant uppercase" htmlFor="password">Password</label>
              {isLoginMode && (
                <Link href="/forgot-password" className="text-primary text-label-sm font-semibold hover:underline">Forgot?</Link>
              )}
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm"
            />
          </div>

          {((state as any)?.error || searchParams.get('error')) && (
            <p className="text-error text-body-md text-center">{(state as any)?.error || searchParams.get('error')}</p>
          )}
          {((state as any)?.message || searchParams.get('message')) && (
            <div className="bg-primary-container/20 border border-primary/20 rounded-lg p-md">
              <p className="text-primary text-body-md text-center">{(state as any)?.message || searchParams.get('message')}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-sm bg-primary-container text-on-primary-container rounded-lg font-bold flex items-center justify-center gap-sm group hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isLoginMode ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-lg text-center text-body-md text-on-surface-variant">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          {/* type="button" is critical — without it, the browser treats this as type="submit" */}
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary font-semibold hover:underline"
          >
            {isLoginMode ? 'Create an account' : 'Log in instead'}
          </button>
        </p>
        <div className="mt-xl flex items-center justify-center gap-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> SECURE AES-256 ENCRYPTED LOGIN
        </div>
      </div>
      <Toast 
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default LoginPage;
