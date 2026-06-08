'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, Loader2, Crown, AlertCircle } from 'lucide-react';
import { validateUsernameFormat, normalizeUsername } from '@/lib/username';

// ─── Types ───────────────────────────────────────────────────────

type CheckState =
  | { status: 'idle' }
  | { status: 'typing' }
  | { status: 'checking' }
  | { status: 'available' }
  | { status: 'taken'; suggestions: string[] }
  | { status: 'premium'; message?: string; suggestions: string[] }
  | { status: 'format_error'; message: string }
  | { status: 'reserved' };

interface UsernameInputProps {
  initialValue?: string;
  planType?: 'free' | 'premium';
  domain?: string;
  /** Called when the current value is a VALID, available username */
  onValidChange?: (username: string) => void;
  /** Called when the current value is INVALID or checking */
  onInvalidChange?: () => void;
  /** Controlled name attr so parent form can read it */
  inputName?: string;
}

// ─── Component ───────────────────────────────────────────────────

export default function UsernameInput({
  initialValue = '',
  planType = 'free',
  domain = 'biolinks.me',
  onValidChange,
  onInvalidChange,
  inputName = 'username',
}: UsernameInputProps) {
  const [value, setValue] = useState(initialValue);
  const [checkState, setCheckState] = useState<CheckState>({ status: 'idle' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Debounced API check ──────────────────────────────────────
  const checkAvailability = useCallback(
    async (username: string) => {
      const normalized = normalizeUsername(username);

      // Instant format check (no API call needed)
      const format = validateUsernameFormat(normalized);
      if (!format.valid) {
        setCheckState({ status: 'format_error', message: format.error! });
        onInvalidChange?.();
        return;
      }

      setCheckState({ status: 'checking' });
      onInvalidChange?.();

      try {
        const res = await fetch(
          `/api/username/check?username=${encodeURIComponent(normalized)}&plan=${planType}`
        );
        const data = await res.json();

        if (data.formatError && data.formatError.includes('reserved')) {
          setCheckState({ status: 'reserved' });
          onInvalidChange?.();
          return;
        }
        if (data.formatError) {
          setCheckState({ status: 'format_error', message: data.formatError });
          onInvalidChange?.();
          return;
        }
        if (data.isPremiumRequired) {
          setCheckState({ status: 'premium', message: data.premiumMessage, suggestions: data.suggestions ?? [] });
          onInvalidChange?.();
          return;
        }
        if (data.available) {
          setCheckState({ status: 'available' });
          onValidChange?.(normalized);
          return;
        }
        setCheckState({ status: 'taken', suggestions: data.suggestions ?? [] });
        onInvalidChange?.();
      } catch {
        setCheckState({ status: 'format_error', message: 'Could not check availability' });
        onInvalidChange?.();
      }
    },
    [planType, onValidChange, onInvalidChange]
  );

  // ── Handle input change ──────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toLowerCase().replace(/\s/g, '');
    setValue(raw);

    if (!raw) {
      setCheckState({ status: 'idle' });
      onInvalidChange?.();
      return;
    }

    setCheckState({ status: 'typing' });
    onInvalidChange?.();

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => checkAvailability(raw), 420);
  };

  // ── Suggestion click ─────────────────────────────────────────
  const applySuggestion = (s: string) => {
    setValue(s);
    checkAvailability(s);
  };

  // ── Input border color ───────────────────────────────────────
  const borderColor =
    checkState.status === 'available'
      ? 'border-emerald-500/60'
      : checkState.status === 'taken' || checkState.status === 'format_error' || checkState.status === 'reserved'
      ? 'border-error/50'
      : checkState.status === 'premium'
      ? 'border-violet-500/50'
      : 'border-outline-variant/40';

  return (
    <div className="space-y-sm">
      {/* Input row */}
      <div
        className={`flex items-center bg-surface-container-high rounded-t-sm border-b-2 transition-colors duration-200 ${borderColor}`}
      >
        <span className="text-body-md text-on-surface-variant pl-sm select-none whitespace-nowrap">
          {domain}/
        </span>
        <input
          id={inputName}
          name={inputName}
          type="text"
          value={value}
          onChange={handleChange}
          autoComplete="off"
          spellCheck={false}
          required
          placeholder="yourcoolname"
          className="flex-1 bg-transparent border-0 focus:ring-0 px-xs py-sm text-on-surface text-body-md font-bold placeholder:font-normal placeholder:text-on-surface-variant/40 outline-none"
        />
        {/* Status icon */}
        <div className="px-sm">
          {checkState.status === 'checking' && (
            <Loader2 size={16} className="text-on-surface-variant animate-spin" />
          )}
          {checkState.status === 'available' && (
            <CheckCircle size={16} className="text-emerald-400" />
          )}
          {(checkState.status === 'taken' || checkState.status === 'format_error' || checkState.status === 'reserved') && (
            <XCircle size={16} className="text-error" />
          )}
          {checkState.status === 'premium' && (
            <Crown size={16} className="text-violet-400" />
          )}
        </div>
      </div>

      {/* Status message */}
      <div className="min-h-[18px]">
        {checkState.status === 'idle' && (
          <p className="text-label-sm text-on-surface-variant">
            Pick a unique username. You can change it later.
          </p>
        )}
        {checkState.status === 'available' && (
          <p className="text-label-sm text-emerald-400 flex items-center gap-xs">
            <CheckCircle size={12} /> <span className="font-bold">{domain}/{value}</span> is available!
          </p>
        )}
        {checkState.status === 'taken' && (
          <p className="text-label-sm text-error">
            @{value} is already taken. Try one of the suggestions below.
          </p>
        )}
        {checkState.status === 'reserved' && (
          <p className="text-label-sm text-error flex items-center gap-xs">
            <AlertCircle size={12} /> This username is reserved and cannot be used.
          </p>
        )}
        {checkState.status === 'format_error' && (
          <p className="text-label-sm text-error flex items-center gap-xs">
            <AlertCircle size={12} /> {checkState.message}
          </p>
        )}
        {checkState.status === 'premium' && (
          <p className="text-label-sm text-violet-400 flex items-center gap-xs">
            <Crown size={12} />
            <span>{checkState.message || "Short single-word usernames are Pro only. Try a variation below."}</span>
          </p>
        )}
      </div>

      {/* Suggestions */}
      {(checkState.status === 'taken' || checkState.status === 'premium') &&
        checkState.suggestions.length > 0 && (
          <div>
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-xs">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-sm">
              {checkState.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  className="px-sm py-xs bg-surface-container-high border border-outline-variant/30 rounded-md text-label-sm text-on-surface hover:border-primary-container/50 hover:text-primary-container transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Live URL preview */}
      {value && checkState.status === 'available' && (
        <div className="flex items-center gap-xs px-sm py-xs bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span className="text-label-sm text-emerald-400 font-mono">
            https://{domain}/{value}
          </span>
        </div>
      )}
    </div>
  );
}
