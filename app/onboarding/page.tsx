'use client';

import React, { useState, useActionState } from 'react';
import { Check, ArrowLeft, ArrowRight, Loader2, User } from 'lucide-react';
import { createProfile } from './actions';
import UsernameInput from '@/components/username/UsernameInput';

const steps = [
  { id: 1, label: 'Username', description: 'Choose your unique handle' },
  { id: 2, label: 'Name', description: 'How should we call you?' },
  { id: 3, label: 'Visuals', description: 'Upload your avatar' },
  { id: 4, label: 'Style', description: 'Pick your theme' },
];

const initialState = { error: '' };

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 — username
  const [username, setUsername] = useState('');
  const [usernameReady, setUsernameReady] = useState(false);

  // Step 2 — name
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // @ts-ignore - React 19 typing
  const [state, formAction, isPending] = useActionState(createProfile, initialState);

  const nameReady = firstName.trim().length >= 1;

  const canContinue = () => {
    if (currentStep === 1) return usernameReady;
    if (currentStep === 2) return nameReady;
    return true;
  };

  const isLastStep = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-md wireframe-pattern">
      <div className="w-full max-w-5xl bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* ── Progress Sidebar ── */}
        <div className="lg:w-72 bg-surface-container p-xl flex flex-col border-r border-outline-variant/20">
          <span className="text-headline-sm text-on-surface font-black tracking-tight mb-xl">BioLinks</span>
          <nav className="space-y-lg flex-1">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-md">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold transition-colors ${
                  step.id < currentStep
                    ? 'bg-primary-container text-on-primary-container'
                    : step.id === currentStep
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {step.id < currentStep ? <Check size={16} /> : step.id}
                </div>
                <div>
                  <span className={`text-label-md font-bold ${step.id === currentStep ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {step.label}
                  </span>
                  <p className="text-[10px] text-on-surface-variant">{step.description}</p>
                </div>
              </div>
            ))}
          </nav>

          {/* Progress Bar */}
          <div className="mt-auto">
            <div className="flex justify-between text-label-sm text-on-surface-variant mb-xs">
              <span>Progress</span>
              <span>{Math.round(((currentStep - 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant rounded-full">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="flex-1 p-xl flex flex-col">
          <form action={formAction} className="flex-1 flex flex-col">
            {/* Hidden fields — carry resolved values to the server action */}
            <input type="hidden" name="username"   value={username} />
            <input type="hidden" name="first_name" value={firstName.trim()} />
            <input type="hidden" name="last_name"  value={lastName.trim()} />

            <div className="flex-1">
              <span className="text-label-sm text-primary uppercase tracking-widest mb-md block">
                Step {currentStep} of {steps.length}
              </span>

              {/* ── Step 1: Username ── */}
              {currentStep === 1 && (
                <>
                  <h1 className="text-headline-lg text-on-surface mb-sm">Choose your username</h1>
                  <p className="text-body-md text-on-surface-variant mb-xl">
                    This will be your unique URL. You can change it later from settings.
                  </p>

                  <UsernameInput
                    initialValue={username}
                    planType="free"
                    domain="biolinks.me"
                    onValidChange={(u) => { setUsername(u); setUsernameReady(true); }}
                    inputName="_username_display"
                  />

                  {state?.error && (
                    <div className="mt-md flex items-center gap-xs bg-error/10 border border-error/20 rounded-lg px-md py-sm">
                      <span className="text-error text-label-md">{state.error}</span>
                    </div>
                  )}
                </>
              )}

              {/* ── Step 2: Name ── */}
              {currentStep === 2 && (
                <>
                  <h1 className="text-headline-lg text-on-surface mb-sm">What&apos;s your name?</h1>
                  <p className="text-body-md text-on-surface-variant mb-xl">
                    This is how you&apos;ll appear on your public profile. You can update it any time.
                  </p>

                  <div className="space-y-lg">
                    {/* Name preview pill */}
                    {firstName && (
                      <div className="flex items-center gap-sm px-md py-sm bg-primary-container/10 border border-primary-container/20 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container font-black text-headline-sm">
                          {firstName[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Preview</p>
                          <p className="text-body-md text-on-surface font-bold">
                            {firstName} {lastName}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                      {/* First Name */}
                      <div>
                        <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs" htmlFor="firstName">
                          First Name <span className="text-error">*</span>
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Alex"
                          autoFocus
                          className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 focus:border-primary-container border-t-0 border-x-0 focus:ring-0 px-sm py-sm text-on-surface text-body-md font-bold placeholder:font-normal placeholder:text-on-surface-variant/40 outline-none transition-colors"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs" htmlFor="lastName">
                          Last Name <span className="text-on-surface-variant/50 normal-case">(optional)</span>
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Rivera"
                          className="w-full bg-surface-container-high border-b-2 border-outline-variant/40 focus:border-primary-container border-t-0 border-x-0 focus:ring-0 px-sm py-sm text-on-surface text-body-md font-bold placeholder:font-normal placeholder:text-on-surface-variant/40 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <p className="text-label-sm text-on-surface-variant">
                      <User size={12} className="inline mr-xs" />
                      Your full name is visible on your public BioLink profile.
                    </p>
                  </div>
                </>
              )}

              {/* ── Steps 3+: Placeholder ── */}
              {currentStep > 2 && (
                <>
                  <h1 className="text-headline-lg text-on-surface mb-sm">
                    {steps[currentStep - 1].label}
                  </h1>
                  <p className="text-body-md text-on-surface-variant mb-xl">
                    {steps[currentStep - 1].description} — coming in a future update.
                  </p>
                  <div className="grid grid-cols-2 gap-md">
                    <div className="x-placeholder aspect-video rounded-lg flex items-center justify-center text-on-surface-variant text-label-sm">
                      Feature coming soon
                    </div>
                    <div className="x-placeholder aspect-video rounded-lg" />
                  </div>
                </>
              )}
            </div>

            {/* ── Navigation ── */}
            <div className="flex justify-between items-center mt-xl pt-lg border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="flex items-center gap-sm px-md py-sm border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-30"
                disabled={currentStep === 1 || isPending}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="flex gap-md">
                {/* Skip — only on steps 3+ */}
                {currentStep > 2 && !isLastStep && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex items-center gap-sm bg-surface-container-high text-on-surface px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all"
                    disabled={isPending}
                  >
                    Skip <ArrowRight size={16} />
                  </button>
                )}

                {/* Continue / Finish */}
                {isLastStep ? (
                  <button
                    type="submit"
                    disabled={!canContinue() || isPending}
                    className="flex items-center gap-sm bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <>Finish Setup <Check size={16} /></>}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canContinue() || isPending}
                    className="flex items-center gap-sm bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default OnboardingPage;
