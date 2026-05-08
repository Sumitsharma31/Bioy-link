'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Link2, ArrowRight, Loader2 } from 'lucide-react';
import { login, signup } from './actions';
import { createClient } from '@/lib/supabase/client';

const initialState = { error: '', message: '' };

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const action = isLoginMode ? login : signup;
  // @ts-ignore - useActionState is available in React 19 but types might be lagging
  const [state, formAction, isPending] = useActionState(action, initialState);

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-md relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 wireframe-pattern opacity-30 pointer-events-none" />
      <div className="w-full max-w-[480px] bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-xl">
          <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center mb-lg shadow-lg">
            <Link2 size={28} className="text-on-primary-container" />
          </div>
          <h1 className="text-headline-md text-on-surface mb-xs">
            {isLoginMode ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {isLoginMode ? 'Log in to manage your digital footprint' : 'Sign up to start building your profile'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-md mb-lg">
          <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-sm py-sm px-md rounded-lg bg-surface-container-high border border-outline-variant/20 hover:bg-surface-variant transition-colors text-body-md font-medium">Google</button>
          <button type="button" className="flex items-center justify-center gap-sm py-sm px-md rounded-lg bg-surface-container-high border border-outline-variant/20 hover:bg-surface-variant transition-colors text-body-md font-medium">Apple</button>
        </div>

        <div className="relative mb-lg">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30" /></div>
          <div className="relative flex justify-center">
            <span className="bg-surface-container-low px-md text-label-sm uppercase tracking-widest text-on-surface-variant">
              or continue with email
            </span>
          </div>
        </div>

        <form action={formAction} className="space-y-lg">
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
                <Link href="#" className="text-primary text-label-sm font-semibold hover:underline">Forgot?</Link>
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

          {state?.error && (
            <p className="text-error text-body-md text-center">{state.error}</p>
          )}
          {state?.message && (
            <div className="bg-primary-container/20 border border-primary/20 rounded-lg p-md">
              <p className="text-primary text-body-md text-center">{state.message}</p>
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
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="text-primary font-semibold hover:underline"
          >
            {isLoginMode ? 'Create an account' : 'Log in instead'}
          </button>
        </p>
        <div className="mt-xl flex items-center justify-center gap-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> SECURE AES-256 ENCRYPTED LOGIN
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
