'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from './actions';

const initialState = { error: '', message: '' };

const ForgotPasswordPage = () => {
  const router = useRouter();
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-md pt-md pb-24 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 wireframe-pattern opacity-30 pointer-events-none" />
      
      <div className="w-full max-w-[480px] bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-2xl relative z-10">
        {/* Close Button Inside Card */}
        <button 
          onClick={() => router.back()}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-all group"
          aria-label="Close"
        >
          <X size={20} className="group-active:scale-90 transition-transform" />
        </button>

        <Link 
          href="/login" 
          className="inline-flex items-center gap-xs text-label-sm text-on-surface-variant hover:text-primary transition-colors mb-xl group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="flex flex-col items-center mb-xl text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-lg">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={80} height={80} className="object-contain drop-shadow-[0_0_12px_rgba(200,255,0,0.6)]" />
          </div>
          <h1 className="text-headline-md text-on-surface mb-xs">
            Forgot Password?
          </h1>
          <p className="text-body-md text-on-surface-variant">
            No worries, it happens. Enter your email and we'll send you a recovery link.
          </p>
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
              className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm transition-all"
            />
          </div>

          {state?.error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-md">
              <p className="text-error text-body-md text-center">{state.error}</p>
            </div>
          )}
          
          {state?.message && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-md">
              <p className="text-primary text-body-md text-center">{state.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !!state?.message}
            className="w-full py-sm bg-primary-container text-on-primary-container rounded-lg font-bold flex items-center justify-center gap-sm group hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Send Reset Link <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-xl flex items-center justify-center gap-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> SECURE RECOVERY SYSTEM
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
