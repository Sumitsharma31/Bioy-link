'use client';

import React, { useState, useActionState } from 'react';
import { Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { createProfile } from './actions';

const steps = [
  { id: 1, label: 'Identity', description: 'Choose your username' },
  { id: 2, label: 'Visuals', description: 'Upload your avatar' },
  { id: 3, label: 'Style', description: 'Pick your theme' },
  { id: 4, label: 'Content', description: 'Add your first links' },
];

const initialState = { error: '' };

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('newcreator');
  // @ts-ignore - React 19 typing
  const [state, formAction, isPending] = useActionState(createProfile, initialState);

  const handleNext = () => {
    // For MVP, we will submit the form early if they try to skip steps
    setCurrentStep(Math.min(steps.length, currentStep + 1));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-md wireframe-pattern">
      <div className="w-full max-w-5xl bg-surface-container-low border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Progress Sidebar */}
        <div className="lg:w-72 bg-surface-container p-xl flex flex-col border-r border-outline-variant/20">
          <span className="text-headline-sm text-on-surface font-black tracking-tight mb-xl">Link-in-Bio</span>
          <nav className="space-y-lg flex-1">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-md">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold ${
                  step.id < currentStep
                    ? 'bg-primary-container text-on-primary-container'
                    : step.id === currentStep
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {step.id < currentStep ? <Check size={16} /> : step.id}
                </div>
                <div>
                  <span className={`text-label-md font-bold ${step.id === currentStep ? 'text-on-surface' : 'text-on-surface-variant'}`}>{step.label}</span>
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
              <div className="h-full bg-primary-container rounded-full transition-all" style={{ width: `${((currentStep - 1) / steps.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-xl flex flex-col">
          <form action={formAction} className="flex-1 flex flex-col">
            <div className="flex-1">
              <span className="text-label-sm text-primary uppercase tracking-widest mb-md block">Step {currentStep} of {steps.length}</span>
              <h1 className="text-headline-lg text-on-surface mb-sm">Choose your username</h1>
              <p className="text-body-md text-on-surface-variant mb-xl">This will be your unique URL that you share with the world.</p>

              {/* Username Input */}
              <div className="mb-xl">
                <label className="block text-label-sm text-on-surface-variant uppercase mb-xs" htmlFor="username">Username</label>
                <div className="flex items-center bg-surface-container-high rounded-t-sm border-b border-outline-variant/40">
                  <span className="text-body-md text-on-surface-variant pl-sm">linkinbio.me/</span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="flex-1 bg-transparent border-0 focus:ring-0 px-0 py-sm text-on-surface text-body-md font-bold"
                  />
                </div>
                {state?.error && (
                  <div className="text-error text-label-md mt-sm">{state.error}</div>
                )}
                <div className="flex items-center gap-xs mt-xs">
                  <Check size={14} className="text-primary-fixed-dim" />
                  <span className="text-label-md text-primary-fixed-dim">Start typing a username</span>
                </div>
              </div>

              {/* Preview Placeholder Grid */}
              {currentStep > 1 && (
                 <div className="grid grid-cols-2 gap-md">
                   <div className="x-placeholder aspect-video rounded-lg flex items-center justify-center text-on-surface-variant">Feature coming soon</div>
                   <div className="x-placeholder aspect-video rounded-lg" />
                 </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-xl pt-lg border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="flex items-center gap-sm px-md py-sm border border-outline-variant/30 rounded-lg text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors"
                disabled={currentStep === 1 || isPending}
              >
                <ArrowLeft size={16} /> Back
              </button>
              
              {currentStep < 4 ? (
                <div className="flex gap-md">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-sm bg-surface-container-high text-on-surface px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all"
                    disabled={isPending}
                  >
                    Skip <ArrowRight size={16} />
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-sm bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all disabled:opacity-50"
                    disabled={isPending}
                  >
                     {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Finish Setup'}
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-sm bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold text-label-md active:scale-95 transition-all disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Finish Setup'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
