'use client';

import React, { useActionState } from 'react';
import Image from 'next/image';
import { Loader2, KeyRound, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { resetPassword } from './actions';

const initialState = { error: '', message: '' };

const ResetPasswordPage = () => {
  const router = useRouter();
  // @ts-ignore
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

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

        <div className="flex flex-col items-center mb-xl text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-lg">
            <Image src="/bioLink-Logo.png" alt="BioLinks Logo" width={80} height={80} className="object-contain drop-shadow-[0_0_12px_rgba(200,255,0,0.6)]" />
          </div>
          <h1 className="text-headline-md text-on-surface mb-xs">
            Set New Password
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Enter a secure password for your account. Make sure it's something you'll remember.
          </p>
        </div>

        <form action={formAction} className="space-y-lg">
          <div>
            <label className="block text-label-sm text-on-surface-variant uppercase mb-xs" htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-label-sm text-on-surface-variant uppercase mb-xs" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-surface-container-high border-b border-outline-variant/40 border-t-0 border-x-0 focus:ring-0 focus:border-primary px-sm py-sm text-on-surface text-body-md rounded-t-sm transition-all"
            />
          </div>

          {state?.error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-md">
              <p className="text-error text-body-md text-center">{state.error}</p>
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
                Update Password <KeyRound size={18} className="group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-xl flex items-center justify-center gap-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> END-TO-END ENCRYPTED
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
